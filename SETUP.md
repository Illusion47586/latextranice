# Setup

This guide prepares a local machine to build and preview the resume documents in this repository.

## 1. Install Bun

Install Bun if `bun --version` does not work:

```bash
curl -fsSL https://bun.sh/install | bash
```

Restart the shell or add Bun to `PATH`:

```bash
export PATH="$HOME/.bun/bin:$PATH"
```

Install project dependencies:

```bash
bun install
```

## 2. Install LaTeX

You need a TeX distribution that provides `latexmk` and `pdflatex`.

Recommended lightweight setup on macOS:

```bash
brew install --cask basictex
```

Restart the shell, then verify:

```bash
latexmk -v
pdflatex --version
```

If those commands are missing, add TeX Live to `PATH`. Common locations:

```bash
export PATH="/Library/TeX/texbin:$PATH"
export PATH="$HOME/Library/TinyTeX/bin/universal-darwin:$PATH"
```

Full MacTeX also works and includes more packages by default:

```bash
brew install --cask mactex
```

## 3. Install Resume LaTeX Packages

For the current `dhruv-resume` document, install the broader LaTeX package collection first:

```bash
tlmgr install collection-latexextra collection-fontsrecommended
```

If using TinyTeX or a minimal TeX install, these targeted packages may also be useful:

```bash
tlmgr install ragged2e wrapfig lipsum titlesec marvosym enumitem fancyhdr multirow cfr-lm fontawesome5 tcolorbox environ trimspaces svn-prov nfssext-cfr tikzfill pdfcol listings minted fvextra upquote catchfile xstring listingsutf8 psnfss
```

If `tlmgr` reports that a package is not present, search for the file instead:

```bash
tlmgr search --global --file missing-file.sty
```

Then install the package name shown by the search result.

## 4. Check Tools

Run the prerequisite checker:

```bash
bun run check:tools
```

Expected tools:

- `bun`
- `latexmk`
- `pdflatex`

## 5. Build a PDF

Build the default resume:

```bash
bun src/cli.ts clean --doc dhruv-resume
bun src/cli.ts build --doc dhruv-resume --json --pretty
```

The generated files are:

```text
.latex-build/dhruv-resume/main.pdf
dist/dhruv-resume/resume.pdf
```

Build a resume variant by changing `--doc`:

```bash
bun src/cli.ts build --doc sourcegraph-code-understanding --json --pretty
```

## 6. Start the Browser Preview

Start the local preview server:

```bash
bun run dev
```

Open the printed URL, usually:

```text
http://localhost:3000
```

The browser preview lists available documents, watches the selected document folder, rebuilds after source changes, and refreshes the PDF preview.

If the server prints an idle timeout warning for `/events`, restart the server after pulling the latest code. The browser client now uses state polling, and the SSE endpoint disables Bun's idle timeout for compatibility.

## 7. Install Project Skills

Install project-local skills with `bunx`:

```bash
bunx skills add https://bun.sh/docs
bunx skills add https://github.com/bahayonghang/academic-writing-skills --skill latex-paper-en
bunx skills add https://github.com/paramchoudhary/resumeskills --skill tech-resume-optimizer
```

`.agents/` is ignored by git, except for the committed `job-posting-resume-brief` skill.

## 8. Useful Agent Commands

All CLI commands are non-interactive and suitable for local agents:

```bash
bun src/cli.ts list --json --pretty
bun src/cli.ts check --json
bun src/cli.ts build --doc dhruv-resume --json --pretty
bun src/cli.ts export --doc dhruv-resume --json --pretty
bun src/cli.ts clean --doc dhruv-resume --json
bun src/cli.ts branch --from dhruv-resume --to company-role-resume --json --pretty
```

Package aliases:

```bash
bun run list
bun run build:pdf -- --doc dhruv-resume --json --pretty
bun run export:pdf -- --doc dhruv-resume --json --pretty
bun run branch -- --from dhruv-resume --to company-role-resume --json --pretty
```

## 9. Development Checks

Run these after changing TypeScript, server behavior, or CLI behavior:

```bash
bun run typecheck
bun run lint
```

Format when needed:

```bash
bun run format
```

## Troubleshooting

### `bun: command not found`

Use the full Bun path or fix `PATH`:

```bash
$HOME/.bun/bin/bun run typecheck
export PATH="$HOME/.bun/bin:$PATH"
```

### `latexmk` or `pdflatex` missing

Install BasicTeX, MacTeX, or TinyTeX, then restart the shell. Verify:

```bash
latexmk -v
pdflatex --version
```

### Missing `.sty` file

Search for the package that owns it:

```bash
tlmgr search --global --file missing-file.sty
```

Install the package shown by `tlmgr search`.

### Palatino font error like `pplr8t.tfm not found`

Install recommended fonts:

```bash
tlmgr install collection-fontsrecommended psnfss
```

Then clean and rebuild:

```bash
bun src/cli.ts clean --doc dhruv-resume
bun src/cli.ts build --doc dhruv-resume --json --pretty
```

### `latexmk` says a previous invocation failed

Clean generated artifacts before rebuilding:

```bash
bun src/cli.ts clean --doc dhruv-resume
bun src/cli.ts build --doc dhruv-resume --json --pretty
```
