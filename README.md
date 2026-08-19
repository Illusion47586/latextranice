# latextranice

`latextranice` is a local resume workspace for people who want an LLM coding agent to edit LaTeX while the browser stays focused on preview, build status, and export.

The core idea is simple: **Codex is the editor, the filesystem is the source of truth, and the browser is the live PDF preview.** There is no browser text editor. Resume variants are ordinary LaTeX project folders that agents and humans can edit directly.

## What This Project Does

- Manages multiple resume variants as full LaTeX document folders.
- Builds each document with local LaTeX tooling using `latexmk` and `pdflatex`.
- Watches the active document and automatically rebuilds when files change.
- Serves a browser preview with PDF refresh, build status, compile logs, and download/export links.
- Provides a non-interactive Bun + TypeScript CLI for agents.
- Supports branching a resume into role-specific variants.
- Includes project-local agent guidance for job-posting analysis and resume tailoring.

This is primarily built for resume iteration: branch from a base resume, analyze a job posting, tailor the variant, preview the PDF, export it, and keep the process local.

## How It Works

Each document is a self-contained LaTeX project under `docs/<document-id>/`.

```text
docs/
  base-resume/
    main.tex
    latexmkrc
    README.txt
    assets/
    fonts/
```

The compiler runs from the selected document directory, so local assets, fonts, `.sty`, `.cls`, `.bib`, and per-document `latexmkrc` files resolve like they would in a normal LaTeX project.

Generated artifacts live outside document source:

```text
.latex-build/<document-id>/main.pdf
dist/<document-id>/resume.pdf
```

`docs/`, `dist/`, and `.latex-build/` are ignored by git in this repository setup, so private resume contents and generated PDFs do not get committed by default.

## Setup

Full setup instructions live in [SETUP.md](./SETUP.md), including Bun, TeX distribution choices, LaTeX package installs, project skills, and troubleshooting.

Minimum local setup:

```bash
bun install
bun run check:tools
```

Required external tools:

- `bun`
- `latexmk`
- `pdflatex`

## Browser Preview

Start the local preview server:

```bash
bun run dev
```

Open the printed localhost URL, usually:

```text
http://localhost:3000
```

The preview app:

- lists available documents from `docs/*/main.tex`
- lets you switch the active document
- watches the selected document folder recursively
- rebuilds after source, package, font, or asset changes
- shows build state, last compile time, source path, and LaTeX output
- refreshes the PDF after successful builds
- embeds the PDF with browser viewer controls hidden where supported
- exposes a download link for the exported PDF
- includes a persisted light/dark theme toggle
- uses quiet state polling with reconnect status for local reliability

## CLI

All CLI commands are non-interactive. They are designed for local agents and scripts: stable exit codes, no prompts, and JSON output where useful.

List documents:

```bash
bun src/cli.ts list --json --pretty
```

Check prerequisites:

```bash
bun src/cli.ts check --json
```

Build a document:

```bash
bun src/cli.ts build --doc base-resume --json --pretty
```

Export a document PDF:

```bash
bun src/cli.ts export --doc base-resume --json --pretty
```

Clean generated artifacts:

```bash
bun src/cli.ts clean --doc base-resume --json
```

Branch a resume variant:

```bash
bun src/cli.ts branch --from base-resume --to company-role-resume --json --pretty
```

Package aliases are available:

```bash
bun run list
bun run build:pdf -- --doc base-resume --json --pretty
bun run export:pdf -- --doc base-resume --json --pretty
bun run branch -- --from base-resume --to company-role-resume --json --pretty
```

## Resume Branching

Branching copies an entire document folder. This preserves local LaTeX context, custom packages, assets, fonts, and document-specific settings.

```bash
bun src/cli.ts branch --from base-resume --to company-role-resume --json --pretty
```

Document ids must use lowercase letters, numbers, and hyphens. Branching refuses to overwrite an existing document.

### Included Role-Specific Variants

- `frontend-product-quality` emphasizes frontend architecture, product quality systems, visual regression, and design-system work.
- `graviton-full-stack` emphasizes high-performance full-stack systems, real-time interfaces, observability, reliability, and end-to-end application ownership.

Build the Graviton variant with:

```bash
bun src/cli.ts build --doc graviton-full-stack --json --pretty
```

## Job Posting Workflow

This repo includes a project-local `job-posting-resume-brief` skill for turning a job posting URL into a resume-targeting workflow.

Recommended flow:

1. Create or choose a resume variant.
2. Gather the posting into a structured brief.
3. Extract explicit requirements, inferred requirements, skills, ATS keywords, and seniority signals.
4. Compare the job brief against `docs/<document-id>/main.tex`.
5. Use the installed `tech-resume-optimizer` skill for technical resume quality and positioning.
6. Ask truth/positioning questions before making strategic resume changes.
7. Build and inspect the PDF after edits.

When a structured question UI is available, agents should use it for targeting and truth-confirmation questions. Otherwise, ask concise plain-text questions.

## Agent Skills

Project-local skills are installed under `.agents/`. The directory is ignored by git, except for the committed `job-posting-resume-brief` skill.

Install useful skills with:

```bash
bunx skills add https://bun.sh/docs
bunx skills add https://github.com/bahayonghang/academic-writing-skills --skill latex-paper-en
bunx skills add https://github.com/paramchoudhary/resumeskills --skill tech-resume-optimizer
```

Useful agent rules live in [AGENTS.md](./AGENTS.md).

## Development

Run checks:

```bash
bun run typecheck
bun run lint
```

Format:

```bash
bun run format
```

This project prefers Bun-native APIs where they fit:

- `Bun.file()` for file references and existence checks
- `Bun.write()` for file copies/writes
- `Bun.Glob` for file matching
- `Bun.spawn()` for subprocess execution
- `Bun.serve()` and `Bun.build()` for the preview server

Node-compatible modules are kept for primitives Bun does not replace directly, such as `node:path`, recursive directory operations, and filesystem watching.

## Notes

- The browser preview is not the editor. Edit LaTeX files directly with Codex, another agent, or your local editor.
- The embedded PDF hides browser viewer controls where supported, but this is only a presentation choice, not a security boundary.
- Local TeX package availability matters. If a build fails with a missing `.sty` or font metric file, see [SETUP.md](./SETUP.md#troubleshooting).
