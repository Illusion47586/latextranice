import { mkdir, rm, unlink } from "node:fs/promises";
import path from "node:path";
import { Glob } from "bun";
import type { DocumentSummary } from "./documents";

export type BuildStatus =
  | "checking"
  | "compiling"
  | "failed"
  | "idle"
  | "success";

export interface BuildState {
  document: DocumentSummary | null;
  lastCompiledAt: string | null;
  log: string;
  message: string;
  pdfVersion: number;
  status: BuildStatus;
}

export interface BuildPaths {
  buildDir: string;
  builtPdf: string;
  distDir: string;
  exportPdf: string;
  mainTex: string;
}

export interface BuildResult {
  log: string;
  message: string;
  ok: boolean;
  paths?: BuildPaths;
}

const rootDir = process.cwd();
const requiredTools = ["latexmk", "pdflatex"] as const;
const rootFileGlob = new Glob("*");
const auxExtensions = [
  ".aux",
  ".bbl",
  ".bcf",
  ".blg",
  ".fls",
  ".fdb_latexmk",
  ".log",
  ".out",
  ".run.xml",
  ".synctex.gz",
  ".toc",
] as const;

const exists = async (filePath: string) => Bun.file(filePath).exists();

export const getBuildPaths = (document: DocumentSummary): BuildPaths => {
  const buildDir = path.join(rootDir, ".latex-build", document.id);
  const distDir = path.join(rootDir, "dist", document.id);

  return {
    buildDir,
    builtPdf: path.join(buildDir, "main.pdf"),
    distDir,
    exportPdf: path.join(distDir, "resume.pdf"),
    mainTex: document.mainTex,
  };
};

export const initialState = (document: DocumentSummary | null): BuildState => ({
  document,
  lastCompiledAt: null,
  log: "",
  message: document
    ? `Watching ${document.id}.`
    : "No LaTeX document is selected.",
  pdfVersion: Date.now(),
  status: "idle",
});

const run = async (command: string[], options: { cwd?: string } = {}) => {
  const proc = Bun.spawn(command, {
    cwd: options.cwd ?? rootDir,
    stderr: "pipe",
    stdout: "pipe",
  });

  const [stdout, stderr, exitCode] = await Promise.all([
    new Response(proc.stdout).text(),
    new Response(proc.stderr).text(),
    proc.exited,
  ]);

  return {
    exitCode,
    output: [stdout, stderr].filter(Boolean).join("\n").trim(),
  };
};

export const checkPrerequisites = async (): Promise<BuildResult> => {
  const missing: string[] = [];

  for (const tool of requiredTools) {
    const result = await run(["sh", "-lc", `command -v ${tool}`]);
    if (result.exitCode !== 0) {
      missing.push(tool);
    }
  }

  if (missing.length > 0) {
    const list = missing.join(", ");
    return {
      ok: false,
      message: `Missing required LaTeX tooling: ${list}.`,
      log: `Install Bun plus a TeX distribution before building.\n\nMissing: ${list}\n\nmacOS: install MacTeX from https://tug.org/mactex/ or use a TeX Live package manager.\nAfter installation, make sure latexmk and pdflatex are available on PATH.`,
    };
  }

  return {
    ok: true,
    log: "",
    message: "Required LaTeX tooling is available.",
  };
};

export const buildPdf = async (
  document: DocumentSummary
): Promise<BuildResult> => {
  const prereq = await checkPrerequisites();
  if (!prereq.ok) {
    return prereq;
  }

  const buildPaths = getBuildPaths(document);
  if (!(await exists(buildPaths.mainTex))) {
    return {
      ok: false,
      message: `Cannot find main.tex for ${document.id}.`,
      log: `Expected LaTeX entrypoint at ${buildPaths.mainTex}`,
      paths: buildPaths,
    };
  }

  await mkdir(buildPaths.buildDir, { recursive: true });
  await mkdir(buildPaths.distDir, { recursive: true });

  const result = await run(
    [
      "latexmk",
      "-pdf",
      "-interaction=nonstopmode",
      "-halt-on-error",
      `-outdir=${buildPaths.buildDir}`,
      "main.tex",
    ],
    { cwd: document.dir }
  );

  if (result.exitCode !== 0) {
    return {
      ok: false,
      log: result.output || "latexmk exited without output.",
      message: `LaTeX compilation failed for ${document.id}.`,
      paths: buildPaths,
    };
  }

  if (!(await exists(buildPaths.builtPdf))) {
    return {
      ok: false,
      message: `LaTeX completed for ${document.id}, but no PDF was produced.`,
      log: `Expected output at ${buildPaths.builtPdf}\n\n${result.output}`,
      paths: buildPaths,
    };
  }

  await Bun.write(buildPaths.exportPdf, Bun.file(buildPaths.builtPdf));

  return {
    ok: true,
    log: result.output,
    message: `PDF compiled successfully for ${document.id}.`,
    paths: buildPaths,
  };
};

export const cleanBuildArtifacts = async (document?: DocumentSummary) => {
  const buildRoot = path.join(rootDir, ".latex-build");
  const distRoot = path.join(rootDir, "dist");
  const targets = document
    ? [getBuildPaths(document).buildDir, getBuildPaths(document).distDir]
    : [buildRoot, distRoot];

  const auxFiles = document
    ? [...rootFileGlob.scanSync({ cwd: document.dir, onlyFiles: true })].filter(
        (file) => auxExtensions.some((extension) => file.endsWith(extension))
      )
    : [];

  await Promise.all([
    ...targets.map((target) => rm(target, { recursive: true, force: true })),
    ...auxFiles.map((file) =>
      unlink(path.join(document?.dir ?? rootDir, file))
    ),
  ]);
};
