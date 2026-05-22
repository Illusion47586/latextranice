# Agent Instructions

This repository is a Bun + TypeScript LaTeX resume manager.

## Operating Rules

- Treat `docs/<document-id>/` as the source of truth for resume documents.
- Do not recreate root-level `main.tex`, `latexmkrc`, or `README.txt`; those were migrated into `docs/dhruv-resume/`.
- Keep CLI commands non-interactive. New commands must have stable exit codes and should support `--json` when useful.
- Prefer Bun-native APIs where available: `Bun.file`, `Bun.write`, `Bun.Glob`, `Bun.spawn`, `Bun.serve`, and `Bun.build`.
- Use Node-compatible modules only for gaps such as path operations, directory creation/removal, recursive copy, and filesystem watching.
- For every code change, make the relevant README update in the same change. If behavior, commands, setup, outputs, or document layout changes, update `README.md`.
- Keep `SETUP.md` updated when installation steps, prerequisites, TeX packages, or troubleshooting guidance changes.
- Keep `.agents/` out of git. Project-local skills belong there but should not be committed.
- Use the project-local `job-posting-resume-brief` skill when the user gives a job posting URL and wants resume targeting help.
- Use `tech-resume-optimizer` for technical resume quality review and ATS-oriented critique.

## Useful Commands

```bash
bun run check:tools
bun src/cli.ts list --json --pretty
bun src/cli.ts build --doc dhruv-resume --json
bun src/cli.ts branch --from dhruv-resume --to <new-document-id> --json
bun run typecheck
bun run lint
```

## Document Model

Each document folder is a complete LaTeX project. Compile from the document directory so local fonts, images, custom packages, `.sty`, `.cls`, `.bib`, and `latexmkrc` files resolve correctly.
