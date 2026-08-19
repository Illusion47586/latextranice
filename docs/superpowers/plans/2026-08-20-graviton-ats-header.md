# Graviton ATS-Safe Header Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the icon-based Graviton resume contact row with an ATS-safe plain-text row while preserving clickable professional links.

**Architecture:** Make a focused LaTeX header edit that removes icon macros and hides the raw GitHub handle behind a professional label. Rebuild through the Bun CLI, inspect PDF text and link annotations programmatically, render the page visually, then commit only the header change and confirm live preview success.

**Tech Stack:** LaTeX, hyperref, Bun/TypeScript resume CLI, latexmk, pdfTeX, Poppler, pdfplumber, pypdf.

---

### Task 1: Replace the contact row

**Files:**
- Modify: `docs/graviton-full-stack/main.tex:158-162`

- [ ] **Step 1: Replace the icon-based row**

Use exactly:

```latex
\begin{center}
    \small{
    Bengaluru, India |
    \href{https://www.linkedin.com/in/dhruvtiwari47586/}{LinkedIn} |
    \href{https://github.com/Illusion47586}{GitHub} |
    +91 88002 23291 | \href{mailto:dhruvtiwari110058@gmail.com}{dhruvtiwari110058@gmail.com}
    }
\end{center}
```

- [ ] **Step 2: Verify source scope**

Run:

```bash
git diff --check -- docs/graviton-full-stack/main.tex
git diff -- docs/graviton-full-stack/main.tex
```

Expected: only the contact row changes; no `\socialicon`, `\faLinkedin`, or `\faGithub` call remains in the row.

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

- [ ] **Step 2: Verify ATS-visible text**

Use bundled `pdfplumber` to extract the first page.

Expected header text contains `Bengaluru, India`, `LinkedIn`, `GitHub`, `+91 88002 23291`, and `dhruvtiwari110058@gmail.com`. It does not contain `(cid:`, `§`, or `Illusion47586`.

- [ ] **Step 3: Verify hyperlinks**

Use `pypdf` to enumerate first-page `/Link` annotations and `/URI` actions.

Expected URI list contains:

```text
https://www.linkedin.com/in/dhruvtiwari47586/
https://github.com/Illusion47586
mailto:dhruvtiwari110058@gmail.com
```

- [ ] **Step 4: Render and inspect**

Use bundled `pdfinfo` and `pdftoppm` to confirm one A4 page and render at 150 DPI to `tmp/graviton-full-stack-render/resume.png`. Inspect the entire page, especially header centering, separators, single-line fit, and spacing above Summary.

- [ ] **Step 5: Run repository checks**

Run:

```bash
bun run typecheck
bun run lint
git diff --check
```

Expected: all commands exit 0.

### Task 3: Commit and refresh live preview

**Files:**
- Modify: `docs/graviton-full-stack/main.tex`

- [ ] **Step 1: Commit the header-only change**

Run:

```bash
git add -f docs/graviton-full-stack/main.tex
git diff --cached --check
git commit -m "Make Graviton resume header ATS-safe"
```

Expected: the commit changes only the contact row in `main.tex`.

- [ ] **Step 2: Confirm live preview**

Request `http://localhost:3000/api/state`. If needed, select `graviton-full-stack` and trigger a build.

Expected: selected document is `graviton-full-stack` and status is `success`.
