import {
  branchDocument,
  type DocumentSummary,
  listDocuments,
  resolveDocument,
} from "./documents";
import {
  type BuildPaths,
  buildPdf,
  checkPrerequisites,
  cleanBuildArtifacts,
  getBuildPaths,
} from "./latex";

type CliCommand =
  | "branch"
  | "build"
  | "check"
  | "clean"
  | "export"
  | "help"
  | "list";

interface CliOutput {
  command: string;
  document?: DocumentSummary;
  documents?: DocumentSummary[];
  log?: string;
  message: string;
  ok: boolean;
  paths?: BuildPaths;
}

const args = process.argv.slice(2);
const json = args.includes("--json");
const pretty = args.includes("--pretty");
const command =
  (args.find((arg) => !arg.startsWith("--")) as CliCommand | undefined) ??
  "build";

const valueFor = (name: string) => {
  const index = args.indexOf(name);
  if (index === -1) {
    return;
  }

  return args[index + 1];
};

const usage = `Usage: bun src/cli.ts <command> [options] [--json] [--pretty]

Commands:
  list                         List document folders under docs/.
  check                        Verify required local tooling is available.
  build --doc <id>             Compile docs/<id>/main.tex.
  export --doc <id>            Alias for build.
  clean [--doc <id>]           Remove generated artifacts for one document or all documents.
  branch --from <id> --to <id> Copy a full LaTeX project folder into a new variation.
  help                         Print this help text.

All commands are non-interactive and exit with 0 on success, 1 on failure.
Document ids must use lowercase letters, numbers, and hyphens.`;

const writeOutput = (output: CliOutput) => {
  if (json) {
    const spacing = pretty ? 2 : 0;
    const serialized = JSON.stringify(output, null, spacing);
    const stream = output.ok ? console.log : console.error;
    stream(serialized);
    return;
  }

  const stream = output.ok ? console.log : console.error;
  stream(output.message);

  if (output.documents && output.documents.length > 0) {
    stream(output.documents.map((document) => `- ${document.id}`).join("\n"));
  }

  if (output.log) {
    stream(`\n${output.log}`);
  }
};

const finish = (output: CliOutput): never => {
  writeOutput(output);
  process.exit(output.ok ? 0 : 1);
};

const documentOrFinish = async (id?: string): Promise<DocumentSummary> => {
  const result = await resolveDocument(id);
  if (result.ok) {
    return result.value;
  }

  finish({
    command,
    message: result.message,
    ok: false,
  });
  throw new Error("unreachable");
};

try {
  switch (command) {
    case "list": {
      const documents = await listDocuments();
      finish({
        command,
        documents,
        message:
          documents.length > 0
            ? "Available documents:"
            : "No documents found under docs/.",
        ok: documents.length > 0,
      });
      break;
    }

    case "check": {
      const result = await checkPrerequisites();
      finish({
        command,
        log: result.log,
        message: result.message,
        ok: result.ok,
      });
      break;
    }

    case "build":
    case "export": {
      const document = await documentOrFinish(valueFor("--doc"));
      const result = await buildPdf(document);
      finish({
        command,
        document,
        log: result.log,
        message: result.ok
          ? `${result.message} Exported to ${result.paths?.exportPdf}`
          : result.message,
        ok: result.ok,
        paths: result.paths,
      });
      break;
    }

    case "clean": {
      const docId = valueFor("--doc");
      const document = docId ? await documentOrFinish(docId) : undefined;
      await cleanBuildArtifacts(document);
      finish({
        command,
        document,
        message: document
          ? `Removed generated artifacts for ${document.id}.`
          : "Removed generated artifacts for all documents.",
        ok: true,
        paths: document ? getBuildPaths(document) : undefined,
      });
      break;
    }

    case "branch": {
      const from = valueFor("--from");
      const to = valueFor("--to");
      if (!(from && to)) {
        finish({
          command,
          message: `branch requires --from <id> and --to <id>.\n\n${usage}`,
          ok: false,
        });
      }

      const result = await branchDocument(from as string, to as string);
      finish({
        command,
        document: result.ok ? result.value : undefined,
        message: result.ok ? `Created ${to} from ${from}.` : result.message,
        ok: result.ok,
      });
      break;
    }

    case "help": {
      finish({
        command,
        message: usage,
        ok: true,
      });
      break;
    }

    default:
      finish({
        command,
        message: `Unknown command: ${command}\n\n${usage}`,
        ok: false,
      });
  }
} catch (error) {
  finish({
    command,
    log: error instanceof Error ? error.stack : String(error),
    message: "CLI command failed unexpectedly.",
    ok: false,
  });
}
