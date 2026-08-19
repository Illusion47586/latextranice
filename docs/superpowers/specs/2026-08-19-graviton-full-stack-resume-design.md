# Graviton High-Performance Full-Stack Resume Design

Date: 2026-08-19

## Objective

Create a one-page, ATS-friendly LaTeX resume variant at `docs/graviton-full-stack/`, branched from `docs/frontend-product-quality/`, for the Graviton Research Capital frontend opportunity shared by the user.

The resume will position Dhruv as an engineer who builds high-performance full-stack systems, responsive real-time interfaces, and reliable production tooling. It will not claim trading, quantitative-finance, or business-intelligence experience.

## Target Signals

The supplied recruiter message emphasizes:

- High-performance web applications.
- Responsive dashboards and internal tools used during live operations.
- Data visualization and business-intelligence use cases.
- End-to-end ownership across UX, scalable application architecture, and backend collaboration.
- Design-system definition and reusable UI foundations.
- Performance, reliability, and responsiveness as business-critical properties.
- Technical excellence, collaboration, ownership, and continuous learning.

## Positioning

Use a balanced full-stack narrative rather than a consumer-product or platform-only narrative. Lead with React, Next.js, TypeScript, Node.js, live SSE interfaces, performance engineering, observability, and production reliability.

Data-visualization relevance will be demonstrated through Grafana performance dashboards, a live agent-monitoring interface, and interactive mapping work. The resume will not describe these systems as trading or financial applications.

## Content Design

### Summary

Describe Dhruv as a senior engineer specializing in high-performance full-stack systems, React/TypeScript interfaces, real-time applications, and reliable production platforms. Emphasize end-to-end ownership without introducing unsupported domain claims.

### Experience ordering

Order the strongest Headout evidence around the target role:

1. Next.js dashboard for triggering, monitoring, and interacting with agents through live SSE streams.
2. Quantified frontend-performance work: 55% lower Total Blocking Time, 28% lower main-thread blocking, and 28% lower Time to Interactive.
3. Core Web Vitals observability using Prometheus/Grafana dashboards and automated regression alerts.
4. Next.js memory-leak remediation that stopped pod restarts and improved production stability.
5. Design-system and frontend-quality work: reusable components, design tokens, Storybook automation, visual regression, TypeScript builds, CI, and unit coverage.
6. Consumer-product evidence compressed to the strongest quantified result, particularly the 38x increase in review interactions.
7. Earlier-role evidence for interactive maps, an 11% CDN cache-hit increase, and an 87% CPU reduction.

### Projects

Keep one public systems project. Use Isol8 and Maxions together to demonstrate TypeScript/Next.js interfaces, streaming APIs, isolated execution, persistent sessions, resource controls, telemetry, and end-to-end system ownership.

### Skills

Use ATS-readable categories:

- Frontend: React, Next.js, TypeScript, JavaScript, SSR, React Hooks, Storybook, Design Systems.
- Full Stack and Real Time: Node.js, SSE, APIs, Postgres, Temporal.
- Performance and Reliability: Core Web Vitals, Web Performance, Observability, Prometheus, Grafana, CI/CD, Visual Regression, Unit Testing.
- Infrastructure: Kubernetes, Docker, AWS, Bun.

Only include skills supported by the existing resume variants and repository evidence.

## Truth and Scope Rules

- Preserve verified employment dates, education, contact details, URLs, and metrics.
- Do not claim experience in trading, finance, quantitative research, or business intelligence.
- Do not add WebSockets; the documented live transport is SSE.
- Do not add charting libraries, accessibility claims, or backend technologies not already evidenced.
- Do not imply that the agent dashboard or Grafana dashboards were used by traders.
- Avoid inventing system scale, latency, uptime, user counts, or revenue impact.
- Keep every claim interview-defensible.

## Repository Changes

- Branch `docs/frontend-product-quality/` to `docs/graviton-full-stack/` using the existing non-interactive CLI.
- Tailor `docs/graviton-full-stack/main.tex`.
- Update the copied document metadata in `docs/graviton-full-stack/README.txt`.
- Update the root `README.md` to mention the new role-specific variant because document layout changes require a README update under repository instructions.
- Preserve the source variant unchanged.
- Do not modify or remove the unrelated untracked `tmp/` directory.
- Start the existing local preview server after the first successful build and leave it running for the user.

## Validation

- `bun src/cli.ts list --json --pretty` includes `graviton-full-stack`.
- `bun src/cli.ts build --doc graviton-full-stack --json` succeeds.
- `bun src/cli.ts export --doc graviton-full-stack --json` succeeds.
- The PDF contains exactly one page.
- Rendered output is visually inspected for clipping, collisions, broken wrapping, excessive density, and malformed links.
- Resume text naturally contains the supported target signals: React, Next.js, TypeScript, Node.js, SSE, dashboards, performance, observability, design systems, reliability, and end-to-end ownership.
- Unsupported trading, finance, quantitative, BI, WebSocket, and charting-library claims do not appear.
- The existing `frontend-product-quality` source remains unchanged.
- `bun run typecheck` and `bun run lint` succeed if repository documentation or managed content changes affect project checks.
- The preview server starts successfully, lists `graviton-full-stack`, and its local URL is reported to the user.

## Failure Handling

- If the resume exceeds one page, remove lower-signal consumer detail before shrinking typography or margins.
- If quantified performance and reliability bullets create excessive density, combine closely related observability and stability evidence without removing metrics.
- If compilation fails, fix only the new document unless the failure proves a repository-wide issue.
- If visual inspection exposes awkward wrapping, revise wording while preserving verified claims.
