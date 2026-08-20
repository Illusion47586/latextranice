# Supabase AI Platform LLM Resume Export Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Regenerate the existing Supabase AI Platform resume and create a verified, professionally named PDF for LLM-focused Graviton outreach.

**Architecture:** Use the existing Bun CLI to produce the canonical PDF from the unchanged document source, then create a byte-identical send-ready copy with a role-specific filename. Validate content, hashes, page geometry, rendering, repository checks, and source cleanliness without changing CLI behavior or resume content.

**Tech Stack:** Bun, TypeScript resume CLI, LaTeX, SHA-256, pdfplumber, pypdf, Poppler.

---

### Task 1: Regenerate the canonical resume

**Files:**
- Read: `docs/supabase-ai-platform/main.tex`
- Generate: `.latex-build/supabase-ai-platform/main.pdf`
- Generate: `dist/supabase-ai-platform/resume.pdf`

- [ ] **Step 1: Record the source hash and status**

Run:

```bash
shasum -a 256 docs/supabase-ai-platform/main.tex
git status --short -- docs/supabase-ai-platform/main.tex
```

Expected: the source hash is recorded and the source has no tracked or untracked changes.

- [ ] **Step 2: Build and export through the CLI**

Run:

```bash
bun src/cli.ts build --doc supabase-ai-platform --json --pretty
bun src/cli.ts export --doc supabase-ai-platform --json --pretty
```

Expected: both commands exit 0 with `"ok": true`, producing `dist/supabase-ai-platform/resume.pdf`.

- [ ] **Step 3: Confirm source preservation**

Run the source hash and scoped status commands again. Expected: the hash is unchanged and `main.tex` remains clean.

### Task 2: Create and validate the send-ready file

**Files:**
- Create: `dist/supabase-ai-platform/Dhruv_Tiwari_LLM_Engineer_Resume.pdf`
- Generate: `tmp/pdfs/supabase-ai-platform-llm/page-*.png`

- [ ] **Step 1: Copy the canonical artifact**

Run:

```bash
cp dist/supabase-ai-platform/resume.pdf dist/supabase-ai-platform/Dhruv_Tiwari_LLM_Engineer_Resume.pdf
```

Expected: the named file exists.

- [ ] **Step 2: Verify byte identity**

Run SHA-256 for both PDFs and assert the two hashes are identical.

- [ ] **Step 3: Validate PDF structure and content**

Use bundled `pypdf` and `pdfplumber` to reopen the named PDF. Assert that its page count matches the canonical export, extracted text contains `Dhruv Tiwari`, and extracted text contains representative AI-role terms including `Model Context Protocol` and `AI` or `agent`.

- [ ] **Step 4: Verify geometry and render every page**

Use bundled `pdfinfo` and `pdftoppm` to confirm A4 geometry and render every page at 150 DPI into `tmp/pdfs/supabase-ai-platform-llm/`. Inspect every rendered PNG for clipping, overlap, broken glyphs, and layout defects.

### Task 3: Run final repository and artifact checks

**Files:**
- Verify: `dist/supabase-ai-platform/Dhruv_Tiwari_LLM_Engineer_Resume.pdf`

- [ ] **Step 1: Run repository checks**

Run:

```bash
bun run typecheck
bun run lint
git diff --check
```

Expected: all commands exit 0.

- [ ] **Step 2: Confirm no resume source changes**

Run:

```bash
git status --short -- docs/supabase-ai-platform/main.tex
```

Expected: no output.

- [ ] **Step 3: Confirm final artifact**

Verify the named PDF exists, has a nonzero size, reopens successfully, and retains the verified SHA-256 identity with `resume.pdf`.
