# Graviton Three-Category Technical Skills Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Graviton resume's two Technical Skills categories with the user's exact three-category content while preserving a polished one-page PDF.

**Architecture:** Make one focused LaTeX edit, escaping only the ampersand required by LaTeX. Rebuild through the Bun CLI, validate extracted text and A4 page geometry, inspect a full-page render, run repository checks, commit only the resume source, and confirm the live preview remains healthy.

**Tech Stack:** LaTeX, Bun, TypeScript, latexmk, pdfplumber, Poppler.

---

### Task 1: Replace Technical Skills content

**Files:**
- Modify: `docs/graviton-full-stack/main.tex:245-248`

- [ ] **Step 1: Replace the current category lines**

Use exactly:

```latex
\section{\textbf{Technical Skills}}
\vspace{1mm}
{\textbf{Frontend:} React, Next.js, TypeScript, JavaScript (ES6+), HTML, CSS, SSR, React Hooks, Storybook, Design Systems \\
\textbf{Quality \& Performance:} Core Web Vitals, Web Performance, Unit Testing, CI/CD, Git \\
\textbf{AI/Agent Tooling:} Model Context Protocol (MCP), Agentic Workflows}
```

- [ ] **Step 2: Verify source scope**

Run:

```bash
git diff --check -- docs/graviton-full-stack/main.tex
git diff -- docs/graviton-full-stack/main.tex
```

Expected: only the Technical Skills contents change. The section heading and surrounding spacing remain unchanged.

### Task 2: Build and inspect the PDF

**Files:**
- Generate: `.latex-build/graviton-full-stack/main.pdf`
- Generate: `dist/graviton-full-stack/resume.pdf`
- Generate: `tmp/graviton-full-stack-three-skills-render/resume.png`

- [ ] **Step 1: Build and export**

Run:

```bash
bun src/cli.ts build --doc graviton-full-stack --json --pretty
bun src/cli.ts export --doc graviton-full-stack --json --pretty
```

Expected: both commands exit 0 with `"ok": true`.

- [ ] **Step 2: Validate extracted Technical Skills text**

Use bundled `pdfplumber` with `x_tolerance=2`. Normalize whitespace after `TECHNICAL SKILLS`, then assert the section contains:

```text
Frontend: React, Next.js, TypeScript, JavaScript (ES6+), HTML, CSS, SSR, React Hooks, Storybook, Design Systems
Quality & Performance: Core Web Vitals, Web Performance, Unit Testing, CI/CD, Git
AI/Agent Tooling: Model Context Protocol (MCP), Agentic Workflows
```

Assert that `Harness Engineering` and the standalone category label `AI:` do not remain in the isolated section.

- [ ] **Step 3: Verify geometry and render**

Run bundled `pdfinfo` and `pdftoppm` at 150 DPI. Expected: one A4 page. Inspect the complete render for legibility, wrapping, clipping, alignment, and bottom spacing.

### Task 3: Check, commit, and confirm preview

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
git commit -m "Refine Graviton technical skills"
```

Expected: the commit changes only the Technical Skills content in `main.tex`.

- [ ] **Step 3: Confirm live preview**

Request `http://localhost:3000/api/state`. Expected: selected document `graviton-full-stack` and status `success`.
