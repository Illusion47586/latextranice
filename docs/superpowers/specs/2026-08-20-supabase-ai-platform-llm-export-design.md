# Supabase AI Platform LLM Resume Export Design

## Goal

Regenerate the existing `supabase-ai-platform` resume and provide a professionally named PDF for an LLM-focused Graviton enquiry.

## Approved Output

Create the send-ready file:

```text
dist/supabase-ai-platform/Dhruv_Tiwari_LLM_Engineer_Resume.pdf
```

## Scope

- Preserve `docs/supabase-ai-platform/main.tex` and all resume content exactly.
- Build and export the existing `supabase-ai-platform` document through the repository CLI.
- Preserve the standard CLI artifact at `dist/supabase-ai-platform/resume.pdf`.
- Create the professionally named PDF as a byte-identical copy of the freshly exported standard artifact.
- Do not change global CLI export naming because that would affect unrelated documents.
- Do not create a new document variant because no content changes are requested.

## Verification

- Confirm the CLI build/export succeeds.
- Confirm both PDFs exist and have identical SHA-256 hashes.
- Confirm the named PDF opens as a valid PDF and matches the source page count and A4 geometry.
- Extract representative text to ensure the expected candidate name and AI/agent content are present.
- Render every page of the named PDF and inspect the complete resume for visual defects.
- Run repository typecheck and lint, and confirm no source files changed.
