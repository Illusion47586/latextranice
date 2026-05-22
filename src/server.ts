import { type FSWatcher, watch } from "node:fs";
import path from "node:path";
import {
  type DocumentSummary,
  listDocuments,
  resolveDocument,
} from "./documents";
import {
  type BuildState,
  buildPdf,
  getBuildPaths,
  initialState,
} from "./latex";

type AppState = BuildState & {
  documents: DocumentSummary[];
};

interface SseClient {
  closed: boolean;
  controller: ReadableStreamDefaultController<Uint8Array>;
  heartbeat: ReturnType<typeof setInterval> | null;
}

const port = Number(process.env.PORT ?? 3000);
const publicDir = path.join(import.meta.dir, "..", "public");
const clientEntry = path.join(import.meta.dir, "client.ts");
const encoder = new TextEncoder();

let activeDocument: DocumentSummary | null = null;
let watcher: FSWatcher | null = null;
let state: AppState = {
  ...initialState(null),
  documents: [],
};
let compiling = false;
let queued = false;
let debounceTimer: ReturnType<typeof setTimeout> | null = null;
const clients = new Set<SseClient>();

const exists = async (filePath: string) => Bun.file(filePath).exists();

const logBackgroundError = (error: unknown) => {
  console.error(error);
};

const sendEvent = (client: SseClient, eventState: AppState) => {
  if (client.closed) {
    return;
  }

  client.controller.enqueue(
    encoder.encode(`data: ${JSON.stringify(eventState)}\n\n`)
  );
};

const closeClient = (client: SseClient) => {
  if (client.closed) {
    return;
  }

  client.closed = true;
  clients.delete(client);
  if (client.heartbeat) {
    clearInterval(client.heartbeat);
    client.heartbeat = null;
  }
};

const broadcast = () => {
  for (const client of clients) {
    try {
      sendEvent(client, state);
    } catch {
      closeClient(client);
    }
  }
};

const updateState = (patch: Partial<AppState>) => {
  state = { ...state, ...patch };
  broadcast();
};

const refreshDocuments = async () => {
  const documents = await listDocuments();
  updateState({ documents });
  return documents;
};

const runBuild = async (reason: string) => {
  if (!activeDocument) {
    updateState({
      log: "",
      message: "No document is selected.",
      status: "failed",
    });
    return;
  }

  if (compiling) {
    queued = true;
    return;
  }

  compiling = true;
  updateState({
    log: "",
    message: `Compiling ${activeDocument.id} after ${reason}...`,
    status: "compiling",
  });

  const result = await buildPdf(activeDocument);
  const now = new Date().toISOString();

  if (result.ok) {
    updateState({
      lastCompiledAt: now,
      log: result.log,
      message: result.message,
      pdfVersion: Date.now(),
      status: "success",
    });
  } else {
    updateState({
      lastCompiledAt: now,
      log: result.log,
      message: result.message,
      status: "failed",
    });
  }

  compiling = false;

  if (queued) {
    queued = false;
    runBuild("queued changes").catch(logBackgroundError);
  }
};

const scheduleBuild = (reason: string) => {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  debounceTimer = setTimeout(() => {
    debounceTimer = null;
    runBuild(reason).catch(logBackgroundError);
  }, 300);
};

const ignoredBasenames = new Set([
  ".DS_Store",
  ".git",
  ".latex-build",
  "dist",
  "node_modules",
]);

const isWatchedFile = (filename: string | null) => {
  if (!filename) {
    return false;
  }

  const parts = filename.replaceAll("\\", "/").split("/");
  return !parts.some((part) => ignoredBasenames.has(part));
};

const setActiveDocument = async (document: DocumentSummary) => {
  watcher?.close();
  activeDocument = document;
  const documents = await listDocuments();
  state = {
    ...initialState(document),
    documents,
  };
  broadcast();

  watcher = watch(document.dir, { recursive: true }, (_event, filename) => {
    if (isWatchedFile(filename?.toString() ?? null)) {
      scheduleBuild(`${filename}`);
    }
  });

  scheduleBuild("document selection");
};

const initialize = async () => {
  const resolved = await resolveDocument();
  if (!resolved.ok) {
    updateState({
      documents: [],
      log: resolved.message,
      message: resolved.message,
      status: "failed",
    });
    return;
  }

  await setActiveDocument(resolved.value);
};

const contentTypes: Record<string, string> = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
};

const staticResponse = async (pathname: string) => {
  const file = pathname === "/" ? "index.html" : pathname.slice(1);
  const filePath = path.join(publicDir, file);

  if (!(filePath.startsWith(publicDir) && (await exists(filePath)))) {
    return null;
  }

  const ext = path.extname(filePath);
  return new Response(Bun.file(filePath), {
    headers: {
      "Content-Type": contentTypes[ext] ?? "application/octet-stream",
    },
  });
};

const clientResponse = async () => {
  const build = await Bun.build({
    entrypoints: [clientEntry],
    minify: false,
    sourcemap: "inline",
    target: "browser",
  });

  if (!build.success) {
    return new Response(
      build.logs.map((log) => log.message).join("\n") ||
        "Client TypeScript build failed.",
      { status: 500 }
    );
  }

  const output = build.outputs[0];
  if (!output) {
    return new Response("Client TypeScript build produced no output.", {
      status: 500,
    });
  }

  return new Response(await output.text(), {
    headers: {
      "Content-Type": "text/javascript; charset=utf-8",
    },
  });
};

const pdfResponse = async (download: boolean) => {
  if (!activeDocument) {
    return new Response("No document is selected.", { status: 404 });
  }

  const buildPaths = getBuildPaths(activeDocument);
  if (!(await exists(buildPaths.exportPdf))) {
    return new Response("PDF has not been generated yet.", { status: 404 });
  }

  return new Response(Bun.file(buildPaths.exportPdf), {
    headers: {
      "Cache-Control": "no-store",
      ...(download
        ? {
            "Content-Disposition": `attachment; filename="${activeDocument.id}.pdf"`,
          }
        : {}),
      "Content-Type": "application/pdf",
    },
  });
};

Bun.serve({
  port,
  async fetch(request, server) {
    const url = new URL(request.url);

    if (url.pathname === "/events") {
      server.timeout(request, 0);
      let client: SseClient | null = null;
      const stream = new ReadableStream<Uint8Array>({
        start(controller) {
          client = {
            closed: false,
            controller,
            heartbeat: null,
          };
          clients.add(client);
          controller.enqueue(encoder.encode("retry: 1000\n\n"));
          sendEvent(client, state);
          client.heartbeat = setInterval(() => {
            if (!client || client.closed) {
              return;
            }

            try {
              controller.enqueue(encoder.encode(": ping\n\n"));
            } catch {
              closeClient(client);
            }
          }, 15_000);
        },
        cancel() {
          if (client) {
            closeClient(client);
          }
        },
      });

      request.signal.addEventListener("abort", () => {
        if (client) {
          closeClient(client);
        }
      });

      return new Response(stream, {
        headers: {
          "Cache-Control": "no-cache, no-transform",
          Connection: "keep-alive",
          "Content-Type": "text/event-stream",
        },
      });
    }

    if (url.pathname === "/api/state") {
      return Response.json(state);
    }

    if (url.pathname === "/api/documents") {
      return Response.json(await refreshDocuments());
    }

    if (url.pathname === "/api/document" && request.method === "POST") {
      const body = (await request.json()) as { id?: string };
      const resolved = await resolveDocument(body.id);
      if (!resolved.ok) {
        return Response.json(
          { ok: false, message: resolved.message },
          { status: 404 }
        );
      }

      await setActiveDocument(resolved.value);
      return Response.json({ ok: true, document: resolved.value });
    }

    if (url.pathname === "/api/build" && request.method === "POST") {
      runBuild("manual request").catch(logBackgroundError);
      return Response.json({ ok: true });
    }

    if (url.pathname === "/app.js") {
      return clientResponse();
    }

    if (url.pathname === "/pdf") {
      return pdfResponse(false);
    }

    if (url.pathname === "/download") {
      return pdfResponse(true);
    }

    const staticFile = await staticResponse(url.pathname);
    if (staticFile) {
      return staticFile;
    }

    return new Response("Not found", { status: 404 });
  },
});

console.log(`Codex LaTeX previewer running at http://localhost:${port}`);
initialize().catch(logBackgroundError);
