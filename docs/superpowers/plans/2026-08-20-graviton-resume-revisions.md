# Graviton Resume Evidence Revisions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Revise the Graviton resume's Senior Software Engineer bullets with evidence-backed MCP, collector-service, design-system, and POC wording while retaining Pinned Reviews and leaving Technical Skills unchanged.

**Architecture:** Make one focused edit to the Senior Software Engineer bullet list in the existing LaTeX document. Preserve every other section, rebuild and export with the repository CLI, compare the Technical Skills block against its pre-edit baseline, and render the one-page PDF for visual inspection.

**Tech Stack:** LaTeX, Bun/TypeScript resume CLI, latexmk, pdfTeX, Poppler, pdfplumber.

---

## File map

- Modify `docs/graviton-full-stack/main.tex`: replace only the Senior Software Engineer bullets at lines 183-188.
- Generate `.latex-build/graviton-full-stack/main.pdf`: document-local build artifact.
- Generate `dist/graviton-full-stack/resume.pdf`: sendable exported PDF.
- Generate `tmp/graviton-full-stack-render/resume.png`: visual QA render.

### Task 1: Protect deferred content and revise Senior Engineer bullets

**Files:**
- Modify: `docs/graviton-full-stack/main.tex:183-188`

- [ ] **Step 1: Capture the exact pre-edit Technical Skills block**

Run:

```bash
sed -n '242,249p' docs/graviton-full-stack/main.tex > /tmp/graviton-technical-skills-before.txt
```

Expected: the temporary file contains the Technical Skills heading and its four existing categories.

- [ ] **Step 2: Replace the Senior Software Engineer bullets**

Use these seven bullets in this exact order:

```latex
\item Built major parts of an internal \textbf{AI software-delivery platform}, including a \textbf{Next.js dashboard} for triggering, monitoring, and interacting with coding agents over live \textbf{SSE streams}, plus Temporal-orchestrated validation workflows with artifact-backed diffs, build-health gates, and auto-fix dispatch.
\item Built a custom \textbf{Model Context Protocol (MCP) server} over internal design-system and engineering sources, exposing design tokens, components, development workflows, and repository conventions as structured tools for LLM agents and \textbf{reducing repeated frontend implementation time by 80\%}.
\item Architected a common \textbf{Core Web Vitals collector service} that bulk-ingested telemetry across frontend applications and exported consolidated metrics to \textbf{Prometheus}, powering Grafana dashboards and automated regression alerts.
\item Fixed critical \textbf{Next.js memory leaks} that were causing pod restarts, eliminating a source of production instability and improving application reliability.
\item Actively shaped \textbf{Eevee, Headout's shared design system}, contributing to foundational component patterns and technical decisions across design tokens, reusable components, Storybook, documentation, and CI/release workflows in close collaboration with design.
\item Launched \textbf{Pinned Reviews} across headout.com and microbrands, driving a \textbf{38x increase in review interactions}.
\item Led a frontend-performance \textbf{proof of concept (POC)} that demonstrated a \textbf{55\% reduction in Total Blocking Time}, \textbf{28\% lower main-thread blocking}, and a \textbf{28\% improvement in Time to Interactive}.
```

- [ ] **Step 3: Verify content and ordering in source**

Run:

```bash
sed -n '180,195p' docs/graviton-full-stack/main.tex
```

Expected: all seven bullets appear, Pinned Reviews remains sixth, and the POC is seventh.

- [ ] **Step 4: Verify Technical Skills is byte-for-byte unchanged**

Run:

```bash
sed -n '243,250p' docs/graviton-full-stack/main.tex > /tmp/graviton-technical-skills-after.txt
cmp /tmp/graviton-technical-skills-before.txt /tmp/graviton-technical-skills-after.txt
```

Expected: `cmp` exits 0. If line-number movement changes the selected range, locate `Technical Skills` with `rg -n`, extract the identical eight-line block by content boundaries, and compare it again.

### Task 2: Build, export, and verify the revised PDF

**Files:**
- Generate: `.latex-build/graviton-full-stack/main.pdf`
- Generate: `dist/graviton-full-stack/resume.pdf`
- Generate: `tmp/graviton-full-stack-render/resume.png`

- [ ] **Step 1: Build and export through the repository CLI**

Run:

```bash
bun src/cli.ts build --doc graviton-full-stack --json --pretty
bun src/cli.ts export --doc graviton-full-stack --json --pretty
```

Expected: both commands exit 0 with `ok: true` and the export path `dist/graviton-full-stack/resume.pdf`.

- [ ] **Step 2: Verify one-page structure and revised text**

Run `pdfinfo` against the exported PDF and use bundled `pdfplumber` to extract its text.

Expected:

- `Pages: 1`.
- Extracted text includes `Model Context Protocol`, `80%`, `collector service`, `Prometheus`, `Eevee`, `38x`, and `proof of concept`.
- The proof-of-concept text follows the Pinned Reviews text.

- [ ] **Step 3: Render and inspect the page**

Use bundled `pdftoppm` at 150 DPI to render:

```text
tmp/graviton-full-stack-render/resume.png
```

Inspect the PNG for clipping, overlaps, broken glyphs, awkward orphan lines, and excessive density. If any defect appears, shorten only the revised bullets, then repeat Tasks 1 Step 4 and Task 2 Steps 1-3.

- [ ] **Step 4: Run repository checks and source audit**

Run:

```bash
bun run typecheck
bun run lint
git diff --check
git diff -- docs/graviton-full-stack/main.tex
```

Expected: typecheck and lint exit 0; whitespace checks pass; the resume diff changes only the Senior Software Engineer bullets.

### Task 3: Commit and refresh live preview

**Files:**
- Modify: `docs/graviton-full-stack/main.tex`

- [ ] **Step 1: Commit the scoped source change**

Run:

```bash
git add -f docs/graviton-full-stack/main.tex
git diff --cached --check
git commit -m "Refine Graviton resume evidence"
```

Expected: the commit includes only `docs/graviton-full-stack/main.tex`.

- [ ] **Step 2: Confirm the live preview server state**

Request `http://localhost:3000/api/state`. If the server is not reachable, run `bun run dev` in a persistent terminal session. Select `graviton-full-stack` through `POST /api/document` when necessary and trigger `POST /api/build`.

Expected: server state is `success`, the selected document id is `graviton-full-stack`, and the latest build message reports success.

- [ ] **Step 3: Report the revised source, exported PDF, and preview URL**

Report the absolute source path, final PDF path, one-page visual verification result, commit id, and `http://localhost:3000` preview URL.
