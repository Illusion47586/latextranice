# Graviton Two-Category Technical Skills Design

## Goal

Simplify the Graviton resume's Technical Skills section to two focused, defensible categories aligned with the target role: Frontend and AI.

## Approved Content

Use exactly these two lines:

```text
Frontend: React, Next.js, TypeScript, JavaScript, SSR, React Hooks, Storybook, Design Systems, Core Web Vitals, Web Performance
AI: Harness Engineering, Model Context Protocol (MCP), Agentic Workflows
```

## Scope

- Replace the existing four Technical Skills categories in `docs/graviton-full-stack/main.tex`.
- Do not change the Summary, Experience, Projects, Education, or contact header.
- Preserve the existing section heading, typography, spacing, and one-page layout.
- Keep every listed skill grounded in experience already described elsewhere in the resume.

## Verification

- Build and export the Graviton document through the repository CLI.
- Confirm the PDF remains one A4 page.
- Extract PDF text and verify that only the Frontend and AI category labels remain under Technical Skills.
- Render and visually inspect the full page for spacing and layout regressions.
- Run typecheck and lint, then confirm the live preview still reports a successful Graviton build.
