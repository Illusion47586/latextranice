# Graviton Summary Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace only the Graviton resume summary with the approved frontend-first statement and deliver a verified one-page PDF through the live preview workflow.

**Architecture:** Make a single paragraph replacement in the existing LaTeX source. Verify the source diff is summary-only, rebuild and export through the Bun CLI, render the PDF for visual inspection, then commit the scoped edit and confirm the existing preview server rebuilt successfully.

**Tech Stack:** LaTeX, Bun/TypeScript resume CLI, latexmk, pdfTeX, Poppler, pdfplumber.

---

### Task 1: Replace only the summary

**Files:**
- Modify: `docs/graviton-full-stack/main.tex:170`

- [ ] **Step 1: Replace the existing summary paragraph**

Use exactly:

```latex
Frontend engineer with 3+ years building high-quality, responsive \textbf{React/TypeScript applications at scale}, spanning reusable component systems, design-system architecture, cross-browser UI, SSR, caching, and Core Web Vitals. Also builds \textbf{AI-agent tooling and MCP servers} that accelerate frontend delivery and improve engineering workflows.
```

- [ ] **Step 2: Verify source scope**

Run:

```bash
git diff --check -- docs/graviton-full-stack/main.tex
git diff -- docs/graviton-full-stack/main.tex
```

Expected: the diff replaces only the summary paragraph; experience, education, projects, and Technical Skills are unchanged.

### Task 2: Build and inspect the PDF

**Files:**
- Generate: `.latex-build/graviton-full-stack/main.pdf`
- Generate: `dist/graviton-full-stack/resume.pdf`
- Generate: `tmp/graviton-full-stack-render/resume.png`

- [ ] **Step 1: Build and export through the CLI**

Run:

```bash
bun src/cli.ts build --doc graviton-full-stack --json --pretty
bun src/cli.ts export --doc graviton-full-stack --json --pretty
```

Expected: both commands exit 0 with `ok: true`.

- [ ] **Step 2: Verify structure and text**

Use bundled `pdfinfo` and `pdfplumber`.

Expected:

- The PDF contains exactly one A4 page.
- Extracted text contains `3+ years`, `React/TypeScript`, `cross-browser UI`, `Core Web Vitals`, `AI-agent tooling`, and `MCP servers` after whitespace normalization.
- The previous `high-performance full-stack systems` wording is absent.

- [ ] **Step 3: Render and inspect**

Render the exported PDF at 150 DPI to `tmp/graviton-full-stack-render/resume.png`. Inspect the entire page for clipping, overlaps, broken glyphs, awkward summary wrapping, and excessive density.

- [ ] **Step 4: Run repository checks**

Run:

```bash
bun run typecheck
bun run lint
git diff --check
```

Expected: all commands exit 0.

### Task 3: Commit and refresh preview

**Files:**
- Modify: `docs/graviton-full-stack/main.tex`

- [ ] **Step 1: Commit the summary-only change**

Run:

```bash
git add -f docs/graviton-full-stack/main.tex
git diff --cached --check
git commit -m "Refresh Graviton resume summary"
```

Expected: the commit contains only the summary replacement in `main.tex`.

- [ ] **Step 2: Verify live preview**

Request `http://localhost:3000/api/state`. If needed, select `graviton-full-stack` and trigger a build through the existing API.

Expected: the selected document is `graviton-full-stack` and server state is `success`.
