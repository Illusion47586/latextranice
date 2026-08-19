# Graviton High-Performance Full-Stack Resume Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create, export, and live-preview a one-page Graviton-targeted resume that positions Dhruv around high-performance full-stack systems without unsupported finance claims.

**Architecture:** Branch the complete `frontend-product-quality` LaTeX document so the source variant remains unchanged, then tailor only the copied document's content and metadata. Use the repository CLI for branching, compiling, and exporting; use PDF metadata and page rendering for structural and visual verification; use the existing Bun server for live preview.

**Tech Stack:** Bun, TypeScript CLI, LaTeX, latexmk, pdflatex, Poppler PDF inspection, local Bun preview server.

---

## File map

- Create `docs/graviton-full-stack/main.tex`: self-contained, role-specific LaTeX resume.
- Create `docs/graviton-full-stack/latexmkrc`: copied document-local LaTeX build configuration.
- Create `docs/graviton-full-stack/README.txt`: document identity and targeting notes.
- Modify `README.md`: record the available Graviton role-specific variant and its build command.
- Create generated `.latex-build/graviton-full-stack/main.pdf` and `dist/graviton-full-stack/resume.pdf` through repository commands; do not edit generated files manually.

### Task 1: Branch and identify the new document

**Files:**
- Create: `docs/graviton-full-stack/main.tex`
- Create: `docs/graviton-full-stack/latexmkrc`
- Create: `docs/graviton-full-stack/README.txt`

- [ ] **Step 1: Branch the source resume with the non-interactive CLI**

Run:

```bash
bun src/cli.ts branch --from frontend-product-quality --to graviton-full-stack --json --pretty
```

Expected: exit 0 and JSON with `ok: true`, source `frontend-product-quality`, and destination `graviton-full-stack`.

- [ ] **Step 2: Verify discovery and source preservation**

Run:

```bash
bun src/cli.ts list --json --pretty
cmp docs/frontend-product-quality/main.tex docs/graviton-full-stack/main.tex
```

Expected: `graviton-full-stack` appears in the document list and `cmp` exits 0 before tailoring.

- [ ] **Step 3: Replace copied template metadata with document-specific notes**

Set `docs/graviton-full-stack/README.txt` to:

```text
Graviton High-Performance Full-Stack Resume

Source: docs/frontend-product-quality/

Purpose:
- Target the Graviton Research Capital frontend opportunity.
- Position Dhruv around high-performance full-stack systems, real-time interfaces, observability, reliability, and end-to-end ownership.
- Preserve only evidence-backed claims; do not imply trading, finance, quantitative-research, or business-intelligence experience.

Build:
bun src/cli.ts build --doc graviton-full-stack --json --pretty

Export:
bun src/cli.ts export --doc graviton-full-stack --json --pretty
```

### Task 2: Tailor the resume content

**Files:**
- Modify: `docs/graviton-full-stack/main.tex:167-247`

- [ ] **Step 1: Replace the summary**

Use this summary:

```latex
Senior software engineer specializing in \textbf{high-performance full-stack systems, React/TypeScript interfaces, and reliable production platforms}. Owns applications end to end across intuitive UX, real-time data flows, backend services, performance engineering, observability, and design-system foundations.
```

- [ ] **Step 2: Replace and reorder the Senior Software Engineer bullets**

Use these six bullets in order:

```latex
\item Built major parts of an internal \textbf{AI software-delivery platform}, including a \textbf{Next.js dashboard} for triggering, monitoring, and interacting with coding agents over live \textbf{SSE streams}, plus Temporal-orchestrated validation workflows with artifact-backed diffs, build-health gates, and auto-fix dispatch.
\item Led a production frontend-performance initiative that reduced \textbf{Total Blocking Time by 55\%}, \textbf{main-thread blocking by 28\%}, and \textbf{Time to Interactive by 28\%}.
\item Architected \textbf{Core Web Vitals observability} across multiple applications with \textbf{Prometheus/Grafana dashboards} and automated regression alerts, reducing mean time to detect performance issues.
\item Fixed critical \textbf{Next.js memory leaks} that were causing pod restarts, eliminating a source of production instability and improving application reliability.
\item Strengthened shared frontend foundations through reusable review and media components, design tokens, \textbf{Storybook automation}, TypeScript build separation, CI fixes, visual-regression workflows, and component-level unit coverage.
\item Launched \textbf{Pinned Reviews} across headout.com and microbrands, driving a \textbf{38x increase in review interactions}.
```

- [ ] **Step 3: Tighten the Software Engineer bullets around systems relevance**

Use these three bullets:

```latex
\item Architected and shipped interactive \textbf{experience itineraries} with Leaflet and Google Maps routing, owning the interface and service integration while \textbf{saving USD 7.8k annually}.
\item Increased \textbf{CDN cache hit ratio by 11\%} through cache-policy improvements and \textbf{reduced CPU usage across pages by 87\%}, strengthening performance and efficiency at scale.
\item Shipped product discovery, rankings, reviews, media, filters, and product-card experiments across headout.com, microbrands, and shared React components.
```

- [ ] **Step 4: Keep public project evidence but sharpen its full-stack framing**

Use:

```latex
\item Built a public full-stack platform with a Next.js interface, streaming APIs, isolated multi-runtime execution, persistent sessions, resource controls, and telemetry for unattended implementation and verification workflows.
```

- [ ] **Step 5: Replace technical skills with role-relevant categories**

Use:

```latex
{\textbf{Frontend:} React, Next.js, TypeScript, JavaScript, SSR, React Hooks, Storybook, Design Systems \\
\textbf{Full Stack \& Real Time:} Node.js, SSE, APIs, Postgres, Temporal \\
\textbf{Performance \& Reliability:} Core Web Vitals, Web Performance, Observability, Prometheus, Grafana, CI/CD, Visual Regression, Unit Testing \\
\textbf{Infrastructure:} Kubernetes, Docker, AWS, Bun}
```

- [ ] **Step 6: Verify truth constraints in the source text**

Run:

```bash
rg -ni "trading|finance|quantitative|business intelligence|websocket|d3|chart\.js" docs/graviton-full-stack/main.tex
rg -n "React|Next.js|TypeScript|Node.js|SSE|Prometheus|Grafana|Design Systems|Total Blocking Time|memory leaks" docs/graviton-full-stack/main.tex
```

Expected: the unsupported-term search returns no matches; every supported target signal appears.

### Task 3: Document the variant

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Add a role-specific variants subsection after Resume Branching**

Add:

```markdown
### Included Role-Specific Variants

- `frontend-product-quality` emphasizes frontend architecture, product quality systems, visual regression, and design-system work.
- `graviton-full-stack` emphasizes high-performance full-stack systems, real-time interfaces, observability, reliability, and end-to-end application ownership.

Build the Graviton variant with:

```bash
bun src/cli.ts build --doc graviton-full-stack --json --pretty
```
```

- [ ] **Step 2: Validate documentation formatting**

Run:

```bash
git diff --check -- README.md docs/graviton-full-stack/README.txt docs/graviton-full-stack/main.tex
```

Expected: exit 0 with no whitespace errors.

### Task 4: Build, export, and visually verify

**Files:**
- Generate: `.latex-build/graviton-full-stack/main.pdf`
- Generate: `dist/graviton-full-stack/resume.pdf`

- [ ] **Step 1: Compile the new document**

Run:

```bash
bun src/cli.ts build --doc graviton-full-stack --json --pretty
```

Expected: exit 0, JSON `ok: true`, and a generated PDF path.

- [ ] **Step 2: Export the sendable PDF**

Run:

```bash
bun src/cli.ts export --doc graviton-full-stack --json --pretty
```

Expected: exit 0, JSON `ok: true`, and `dist/graviton-full-stack/resume.pdf` exists.

- [ ] **Step 3: Verify page count and extractable text**

Run:

```bash
pdfinfo dist/graviton-full-stack/resume.pdf
pdftotext dist/graviton-full-stack/resume.pdf -
```

Expected: `Pages: 1`; output contains the summary, experience, education, project, and technical-skills sections.

- [ ] **Step 4: Render and inspect the page**

Run:

```bash
mkdir -p tmp/graviton-full-stack-render
pdftoppm -png -r 150 -singlefile dist/graviton-full-stack/resume.pdf tmp/graviton-full-stack-render/resume
```

Inspect `tmp/graviton-full-stack-render/resume.png` for clipping, overlaps, cramped wrapping, inconsistent whitespace, and broken glyphs. If any problem appears, revise only `docs/graviton-full-stack/main.tex`, then repeat Steps 1-4.

- [ ] **Step 5: Run repository checks**

Run:

```bash
bun run typecheck
bun run lint
```

Expected: both commands exit 0.

- [ ] **Step 6: Commit source and documentation**

Run:

```bash
git add README.md
git add -f docs/graviton-full-stack/main.tex docs/graviton-full-stack/latexmkrc docs/graviton-full-stack/README.txt
git diff --cached --check
git commit -m "Add Graviton full-stack resume variant"
```

Expected: only the root README and the three new document source files are committed; generated files and unrelated `tmp/` contents are excluded.

### Task 5: Start and verify live preview

**Files:**
- No source changes.

- [ ] **Step 1: Start the preview server in a persistent terminal session**

Run:

```bash
bun run dev
```

Expected: the process remains active and prints a localhost URL, normally `http://localhost:3000`.

- [ ] **Step 2: Verify the server and document discovery**

Open the printed URL or request its document-list endpoint as exposed by the existing server. Confirm the application responds and `graviton-full-stack` is available for selection.

- [ ] **Step 3: Report deliverables**

Report the absolute links to `docs/graviton-full-stack/main.tex`, `dist/graviton-full-stack/resume.pdf`, and the rendered PNG, plus the active localhost preview URL and the server session status.
