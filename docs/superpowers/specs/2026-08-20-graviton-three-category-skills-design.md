# Graviton Three-Category Technical Skills Design

## Goal

Replace the Graviton resume's current two-category Technical Skills section with the user's exact three-category wording.

## Approved Content

Use exactly:

```text
Frontend: React, Next.js, TypeScript, JavaScript (ES6+), HTML, CSS, SSR, React Hooks, Storybook, Design Systems
Quality & Performance: Core Web Vitals, Web Performance, Unit Testing, CI/CD, Git
AI/Agent Tooling: Model Context Protocol (MCP), Agentic Workflows
```

## Scope

- Modify only the Technical Skills content in `docs/graviton-full-stack/main.tex`.
- Remove `Harness Engineering` and rename the AI category to `AI/Agent Tooling`.
- Preserve the section heading, typography, surrounding spacing, and all other resume content.
- Escape the ampersand in `Quality & Performance` for valid LaTeX while keeping the rendered text unchanged.

## Verification

- Build and export through the repository CLI.
- Confirm the PDF remains one A4 page.
- Extract the Technical Skills text and verify all three labels and exact skill lists.
- Confirm the old `AI:` label and `Harness Engineering` no longer appear in the Technical Skills section.
- Render and inspect the full page for clipping, wrapping, alignment, and bottom spacing.
- Run typecheck and lint, commit only the resume source, and confirm the live preview remains successful.
