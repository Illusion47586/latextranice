import type { Dirent } from "node:fs";
import { cp, mkdir, readdir, stat } from "node:fs/promises";
import path from "node:path";

export interface DocumentSummary {
  dir: string;
  id: string;
  latexmkrc: string | null;
  mainTex: string;
  name: string;
}

export type DocumentResult<T> =
  | {
      ok: true;
      value: T;
    }
  | {
      ok: false;
      message: string;
    };

const rootDir = process.cwd();
const docsDir = path.join(rootDir, "docs");
const documentIdPattern = /^[a-z0-9][a-z0-9-]*$/;

const toName = (id: string) =>
  id
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

export const paths = {
  docsDir,
  rootDir,
};

export const isValidDocumentId = (id: string) => documentIdPattern.test(id);

const exists = async (filePath: string) => Bun.file(filePath).exists();

export const listDocuments = async (): Promise<DocumentSummary[]> => {
  let entries: Dirent[];
  try {
    entries = await readdir(docsDir, { withFileTypes: true });
  } catch {
    return [];
  }

  const documents = await Promise.all(
    entries
      .filter((entry) => entry.isDirectory() && isValidDocumentId(entry.name))
      .map(async (entry) => {
        const dir = path.join(docsDir, entry.name);
        const mainTex = path.join(dir, "main.tex");
        if (!(await exists(mainTex))) {
          return null;
        }

        const latexmkrc = path.join(dir, "latexmkrc");

        return {
          dir,
          id: entry.name,
          latexmkrc: (await exists(latexmkrc)) ? latexmkrc : null,
          mainTex,
          name: toName(entry.name),
        };
      })
  );

  return documents
    .filter((document): document is DocumentSummary => Boolean(document))
    .sort((a, b) => a.id.localeCompare(b.id));
};

export const resolveDocument = async (
  requestedId?: string
): Promise<DocumentResult<DocumentSummary>> => {
  const documents = await listDocuments();
  if (documents.length === 0) {
    return {
      ok: false,
      message: `No documents found. Add a folder like ${path.join("docs", "dhruv-resume")} with a main.tex file.`,
    };
  }

  const firstDocument = documents[0];
  if (!firstDocument) {
    return {
      ok: false,
      message: `No documents found. Add a folder like ${path.join("docs", "dhruv-resume")} with a main.tex file.`,
    };
  }

  const id = requestedId ?? process.env.DOC_ID ?? firstDocument.id;
  const document = documents.find((candidate) => candidate.id === id);
  if (!document) {
    return {
      ok: false,
      message: `Unknown document "${id}". Available documents: ${documents.map((item) => item.id).join(", ")}.`,
    };
  }

  return {
    ok: true,
    value: document,
  };
};

export const branchDocument = async (
  fromId: string,
  toId: string
): Promise<DocumentResult<DocumentSummary>> => {
  if (!isValidDocumentId(toId)) {
    return {
      ok: false,
      message:
        "Destination document id must use lowercase letters, numbers, and hyphens.",
    };
  }

  const source = await resolveDocument(fromId);
  if (!source.ok) {
    return source;
  }

  const destinationDir = path.join(docsDir, toId);
  try {
    await stat(destinationDir);
    return {
      ok: false,
      message: `Document "${toId}" already exists at ${destinationDir}.`,
    };
  } catch {
    // Missing destination is the expected path for creating a branch.
  }

  await mkdir(docsDir, { recursive: true });
  await cp(source.value.dir, destinationDir, {
    errorOnExist: true,
    filter: async (sourcePath) => {
      const basename = path.basename(sourcePath);
      if (basename === ".DS_Store") {
        return false;
      }

      const sourceStat = await stat(sourcePath);
      if (sourceStat.isDirectory()) {
        return ![".latex-build", "dist", "node_modules"].includes(basename);
      }

      return true;
    },
    force: false,
    recursive: true,
  });

  return resolveDocument(toId);
};
