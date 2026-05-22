const frame = document.querySelector<HTMLIFrameElement>("#pdf-frame");
const emptyState = document.querySelector<HTMLDivElement>("#empty-state");
const statusDot = document.querySelector<HTMLSpanElement>("#status-dot");
const statusLabel =
  document.querySelector<HTMLParagraphElement>("#status-label");
const statusMessage =
  document.querySelector<HTMLParagraphElement>("#status-message");
const lastCompiled = document.querySelector<HTMLElement>("#last-compiled");
const sourcePath = document.querySelector<HTMLElement>("#source-path");
const buildLog = document.querySelector<HTMLPreElement>("#build-log");
const documentSelect =
  document.querySelector<HTMLSelectElement>("#document-select");
const themeToggle = document.querySelector<HTMLButtonElement>("#theme-toggle");
const themeIcon = document.querySelector<HTMLSpanElement>("#theme-icon");
const themeLabel = document.querySelector<HTMLSpanElement>("#theme-label");

type BuildStatus = "checking" | "compiling" | "failed" | "idle" | "success";

interface DocumentSummary {
  dir: string;
  id: string;
  latexmkrc: string | null;
  mainTex: string;
  name: string;
}

interface AppState {
  document: DocumentSummary | null;
  documents: DocumentSummary[];
  lastCompiledAt: string | null;
  log: string;
  message: string;
  pdfVersion: number;
  status: BuildStatus;
}

const labels: Record<BuildStatus, string> = {
  checking: "Checking",
  compiling: "Compiling",
  failed: "Failed",
  idle: "Idle",
  success: "Ready",
};

const requiredElement = <T extends Element>(
  element: T | null,
  name: string
) => {
  if (!element) {
    throw new Error(`Missing required element: ${name}`);
  }

  return element;
};

const pdfFrame = requiredElement(frame, "pdf-frame");
const empty = requiredElement(emptyState, "empty-state");
const dot = requiredElement(statusDot, "status-dot");
const label = requiredElement(statusLabel, "status-label");
const message = requiredElement(statusMessage, "status-message");
const compiled = requiredElement(lastCompiled, "last-compiled");
const source = requiredElement(sourcePath, "source-path");
const log = requiredElement(buildLog, "build-log");
const select = requiredElement(documentSelect, "document-select");
const themeButton = requiredElement(themeToggle, "theme-toggle");
const themeIconElement = requiredElement(themeIcon, "theme-icon");
const themeLabelElement = requiredElement(themeLabel, "theme-label");

type Theme = "dark" | "light";

const themeStorageKey = "latextranice-theme";
const moonIcon =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='black'%3E%3Cpath d='M21 14.8A8.7 8.7 0 0 1 9.2 3a9 9 0 1 0 11.8 11.8Z'/%3E%3C/svg%3E\")";
const sunIcon =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='black'%3E%3Cpath d='M12 4a1 1 0 0 0 1-1V2a1 1 0 1 0-2 0v1a1 1 0 0 0 1 1Zm0 16a1 1 0 0 0-1 1v1a1 1 0 1 0 2 0v-1a1 1 0 0 0-1-1Zm8-8a1 1 0 0 0 1 1h1a1 1 0 1 0 0-2h-1a1 1 0 0 0-1 1ZM2 13h1a1 1 0 1 0 0-2H2a1 1 0 1 0 0 2Zm15.7-5.3.7-.7A1 1 0 1 0 17 5.6l-.7.7a1 1 0 0 0 1.4 1.4ZM5.6 18.4A1 1 0 0 0 7 18l.7-.7a1 1 0 1 0-1.4-1.4l-.7.7a1 1 0 0 0 0 1.8Zm12.8 0a1 1 0 0 0 0-1.4l-.7-.7a1 1 0 1 0-1.4 1.4l.7.7a1 1 0 0 0 1.4 0ZM6.3 7.7A1 1 0 0 0 7.7 6.3L7 5.6A1 1 0 1 0 5.6 7l.7.7ZM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Z'/%3E%3C/svg%3E\")";

const getPreferredTheme = (): Theme => {
  const saved = localStorage.getItem(themeStorageKey);
  if (saved === "dark" || saved === "light") {
    return saved;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const setTheme = (theme: Theme) => {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem(themeStorageKey, theme);
  const nextTheme = theme === "dark" ? "light" : "dark";
  themeLabelElement.textContent = nextTheme === "dark" ? "Dark" : "Light";
  themeIconElement.style.setProperty(
    "--theme-icon",
    nextTheme === "dark" ? moonIcon : sunIcon
  );
  themeButton.setAttribute("aria-label", `Switch to ${nextTheme} mode`);
};

setTheme(getPreferredTheme());

themeButton.addEventListener("click", () => {
  const currentTheme = document.documentElement.dataset.theme;
  setTheme(currentTheme === "dark" ? "light" : "dark");
});

const formatTime = (value: string | null) => {
  if (!value) {
    return "Never";
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "medium",
  }).format(new Date(value));
};

const relativeSource = (document: DocumentSummary | null) => {
  if (!document) {
    return "No document selected";
  }

  return `docs/${document.id}/main.tex`;
};

const refreshPdf = (version: number) => {
  pdfFrame.src = `/pdf?v=${version}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`;
  pdfFrame.hidden = false;
  empty.hidden = true;
};

const renderDocuments = (
  documents: DocumentSummary[],
  selected: DocumentSummary | null
) => {
  const existing = [...select.options].map((option) => option.value).join(",");
  const incoming = documents.map((document) => document.id).join(",");
  if (existing !== incoming) {
    select.replaceChildren(
      ...documents.map((item) => {
        const option = document.createElement("option");
        option.value = item.id;
        option.textContent = item.id;
        return option;
      })
    );
  }

  select.value = selected?.id ?? "";
  select.disabled = documents.length === 0;
};

const render = (state: AppState) => {
  renderDocuments(state.documents, state.document);
  dot.className = `status-dot ${state.status}`;
  label.textContent = labels[state.status];
  message.textContent = state.message;
  compiled.textContent = formatTime(state.lastCompiledAt);
  source.textContent = relativeSource(state.document);
  log.textContent = state.log || "Build output will appear here.";
  log.classList.toggle("muted", !state.log);

  if (state.status === "success") {
    refreshPdf(state.pdfVersion);
  } else if (!pdfFrame.src) {
    pdfFrame.hidden = true;
    empty.hidden = false;
  }
};

select.addEventListener("change", async () => {
  const id = select.value;
  if (!id) {
    return;
  }

  await fetch("/api/document", {
    body: JSON.stringify({ id }),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  });
});

let lastState: AppState | null = null;
let reconnecting = false;

const setDisconnected = () => {
  if (reconnecting) {
    return;
  }

  reconnecting = true;
  dot.className = "status-dot failed";
  label.textContent = "Reconnecting";
  message.textContent = "Reconnecting to the Bun preview server...";
};

const pollState = async () => {
  try {
    const response = await fetch("/api/state", { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`State request failed with ${response.status}`);
    }

    lastState = (await response.json()) as AppState;
    reconnecting = false;
    render(lastState);
  } catch {
    setDisconnected();
  }
};

pollState();
setInterval(() => {
  pollState();
}, 1000);
