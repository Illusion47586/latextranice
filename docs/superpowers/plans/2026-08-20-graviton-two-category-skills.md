# Graviton Two-Category Technical Skills Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Graviton resume's four Technical Skills categories with the approved Frontend and AI categories while preserving its one-page layout.

**Architecture:** Make one focused LaTeX content edit in the Graviton document. Rebuild with the repository CLI, validate the exported PDF text and page geometry, inspect the rendered page, run repository checks, commit only the resume source, and confirm the existing live preview remains healthy.

**Tech Stack:** LaTeX, Bun, TypeScript, latexmk, pdfplumber, pypdf, Poppler.

---

### Task 1: Replace the Technical Skills content

**Files:**
- Modify: `docs/graviton-full-stack/main.tex:245-250`

- [ ] **Step 1: Replace the four existing category lines**

Use exactly:

```latex
\section{\textbf{Technical Skills}}
\vspace{1mm}
{\textbf{Frontend:} React, Next.js, TypeScript, JavaScript, SSR, React Hooks, Storybook, Design Systems, Core Web Vitals, Web Performance \\
\textbf{AI:} Harness Engineering, Model Context Protocol (MCP), Agentic Workflows}
```

- [ ] **Step 2: Verify the source diff**

Run:

```bash
git diff --check -- docs/graviton-full-stack/main.tex
git diff -- docs/graviton-full-stack/main.tex
```

Expected: only the Technical Skills contents change. The section heading and surrounding spacing remain unchanged.

### Task 2: Build and validate the exported PDF

**Files:**
- Generate: `.latex-build/graviton-full-stack/main.pdf`
- Generate: `dist/graviton-full-stack/resume.pdf`
- Generate: `tmp/graviton-full-stack-skills-render/resume.png`

- [ ] **Step 1: Build and export through the CLI**

Run:

```bash
bun src/cli.ts build --doc graviton-full-stack --json --pretty
bun src/cli.ts export --doc graviton-full-stack --json --pretty
```

Expected: both commands exit 0 and return `"ok": true`.

- [ ] **Step 2: Validate Technical Skills text**

Use bundled `pdfplumber` with `x_tolerance=2` to extract page one. Isolate text after `TECHNICAL SKILLS` and assert it contains:

```text
Frontend: React, Next.js, TypeScript, JavaScript, SSR, React Hooks, Storybook, Design Systems, Core Web Vitals, Web Performance
AI: Harness Engineering, Model Context Protocol (MCP), Agentic Workflows
```

Assert that this isolated section does not contain the removed labels `Full Stack & Real Time`, `Performance & Reliability`, or `Infrastructure`.

- [ ] **Step 3: Verify page geometry and render**

Use bundled Poppler:

```bash
pdfinfo dist/graviton-full-stack/resume.pdf
pdftoppm -f 1 -singlefile -r 150 -png dist/graviton-full-stack/resume.pdf tmp/graviton-full-stack-skills-render/resume
```

Expected: one A4 page. Inspect the full rendered page and confirm the two skill lines are legible, aligned, unclipped, and leave balanced bottom spacing.

### Task 3: Run checks, commit, and confirm preview

**Files:**
- Modify: `docs/graviton-full-stack/main.tex`

- [ ] **Step 1: Run repository checks**

Run:

```bash
bun run typecheck
bun run lint
git diff --check
```

Expected: all commands exit 0.

- [ ] **Step 2: Commit only the resume edit**

Run:

```bash
git add -f docs/graviton-full-stack/main.tex
git diff --cached --check
git commit -m "Simplify Graviton technical skills"
```

Expected: the commit changes only the Technical Skills content in `main.tex`.

- [ ] **Step 3: Confirm live preview state**

Request `http://localhost:3000/api/state` and assert:

```text
document.id = graviton-full-stack
status = success
```

If the server is unavailable, restart it with `bun run dev`, select `graviton-full-stack`, and trigger a build before repeating the assertion.
