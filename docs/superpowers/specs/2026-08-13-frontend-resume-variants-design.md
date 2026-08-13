# Frontend Resume Variants Design

Date: 2026-08-13

## Objective

Create two one-page, ATS-friendly LaTeX resume variants from `docs/dhruv-resume/`:

1. `docs/frontend-product-quality/` — position Dhruv as a senior frontend engineer who combines consumer product delivery with frontend architecture, performance, quality systems, and AI-assisted software delivery.
2. `docs/consumer-product-frontend/` — position Dhruv as a senior consumer frontend engineer who owns polished, high-impact discovery and conversion experiences from idea through production.

Both variants target the shared requirements of the Phantom Frontend / Full Stack (Trading) role and the Supabase Frontend Engineer role while preserving a distinct emphasis for each posting.

## Posting Snapshot

### Phantom

- URL: https://jobs.ashbyhq.com/phantom/e213be58-ba98-486d-93bc-a7716f33003e
- Company: Phantom
- Role: Software Engineer, Frontend / Full Stack (Trading)
- Location / work mode: Remote, full time
- Seniority: Senior; posting asks for 5+ years of full-time software engineering experience
- Source date: Retrieved 2026-08-13

### Supabase

- URL: https://jobs.ashbyhq.com/supabase/f048dd68-63f8-4f98-9860-3d5a43c09a01
- Company: Supabase
- Role: Frontend Engineer
- Location / work mode: Remote, full time
- Seniority: Experienced individual contributor with autonomous end-to-end ownership
- Posting date: 2026-07-29
- Source date: Retrieved 2026-08-13

## Role Summary

The shared target is a high-agency frontend engineer who can ship user-facing products end to end, collaborate closely with product and design, make sound architectural decisions, and maintain quality at scale. Phantom weights consumer discovery, React/TypeScript, mobile and browser-extension surfaces, and trading-domain interest. Supabase weights React fundamentals, SSR and modern rendering, 0-to-1 delivery, tests and CI guardrails, visual regression, observability, AI coding agents, open-source work, and asynchronous written communication.

## Explicit Requirements

### Shared

- Strong React and TypeScript frontend engineering.
- Ownership from product concept through production operation.
- High agency, autonomy, and comfort with ambiguity.
- User feedback and product judgment.
- Cross-functional collaboration with product and design.
- Production quality, reliability, and maintainability.

### Phantom-specific

- React Native and development across web, mobile, and browser extensions.
- Asset-discovery experiences across tokens, perpetuals, and prediction markets.
- Five or more years of full-time software engineering experience.
- Demonstrated interest in open and community-driven platforms.
- Trading-system experience is preferred.

### Supabase-specific

- Modern frontend knowledge including SSR, streaming, server components, and edge delivery.
- Layered quality checks including types, linting, formatting, unit and component tests, API contract tests, accessibility, visual regression, and bundle-size budgets.
- Comfort reviewing and constraining code produced by AI agents.
- Work across frontend UI, API contracts, preview deployments, and observability.
- Public, open-source, remote, and asynchronous collaboration.
- Experience launching a real 0-to-1 product and iterating from user feedback.

## Inferred Requirements

- Present technical decisions as product outcomes rather than isolated implementation tasks.
- Demonstrate both frontend depth and enough full-stack fluency to own API and deployment boundaries.
- Show evidence of operating high-traffic consumer surfaces and handling regressions responsibly.
- Establish credibility through specific metrics, public work, and concrete systems rather than broad adjectives.
- Keep every technical claim interview-defensible.

## ATS Keywords

- Languages: TypeScript, JavaScript, Go, Python.
- Frameworks and frontend: React, Next.js, React Hooks, SSR, component libraries, Storybook, responsive UI, localization.
- Quality and performance: Core Web Vitals, web performance, visual regression, unit testing, CI/CD, accessibility, observability, Prometheus, Grafana.
- Platform and delivery: Node.js, APIs, SSE, Temporal, Kubernetes, Docker, preview environments, design systems, MCP, AI coding agents.
- Product and domain: product discovery, experimentation, conversion, reviews, media, maps, analytics, 0-to-1 products, user feedback.
- Process and collaboration: end-to-end ownership, cross-functional collaboration, asynchronous communication, open source, technical leadership.

React Native, WebSockets, trading, crypto, Playwright, Vitest, and MSW must not be claimed unless supported by repository evidence or confirmed by the user.

## Current Resume Gap Analysis

### Strong matches already present

- React, Next.js, TypeScript, SSR, web performance, and frontend observability.
- High-scale consumer discovery, rankings, reviews, media, mapping, and experimentation work at Headout.
- Core Web Vitals monitoring and measurable performance improvements.
- Shared UI and design-system work through Espeon and associated Storybook automation.
- AI software-delivery infrastructure, visual regression, feature validation, and agent-facing interfaces.
- End-to-end platform ownership spanning frontend, APIs, infrastructure, and production operations.
- Public 0-to-1 projects plus Google Summer of Code and PlutoDesktop open-source work.

### Weak or missing evidence

- No confirmed React Native production experience.
- No confirmed trading or crypto product experience.
- No explicit WebSocket experience in the current resume.
- No confirmed use of Playwright, Vitest, or MSW.
- Phantom's five-year full-time requirement is not met by the dates currently documented.
- Accessibility work is not yet evidenced strongly enough for a standalone claim.

### Material to reduce

- Infrastructure detail that does not support frontend ownership or product outcomes.
- Long enumerations of internal platform mechanics that crowd out user-facing frontend evidence.
- Generic full-stack or AI language that weakens the frontend narrative.
- Personal projects whose main value is backend isolation rather than frontend or product delivery.

## Variant 1: Frontend Product + Quality Platform

### Positioning

Lead with React/Next.js product engineering, then differentiate with performance, observability, shared UI systems, visual regression, and AI-agent quality guardrails. This is the primary Supabase-oriented variant while remaining credible for Phantom.

### Content structure

1. Contact information.
2. Two-sentence summary focused on frontend architecture, product delivery, performance, and quality systems.
3. Experience, with Headout bullets ordered as follows:
   - AI-assisted visual regression and feature-validation platform plus the agent dashboard.
   - MCP-backed design-system and engineering context that reduced repeated frontend implementation time.
   - SSR, caching, runtime, and Core Web Vitals improvements.
   - Shared component and Storybook quality workflows.
   - Consumer features with quantified review and itinerary outcomes.
4. Projects, prioritizing a public 0-to-1 project and PlutoDesktop/open-source evidence.
5. Technical skills grouped in an ATS-readable flat or categorical format.
6. Education.

### Evidence selection

GitHub contributions from `headout/espeon`, `headout/next-deimos`, `headout/eevee`, `headout/kirby`, and `headout/mystique` will be grouped into resume-scale themes rather than listed individually. Strong candidate themes include the unified reviews system, shared review/image-gallery components, Storybook automation, SSR routing and caching work, Core Web Vitals, media performance, React modernization, and consumer feature experiments.

## Variant 2: Consumer Product Frontend

### Positioning

Lead with polished consumer experiences, product discovery, experimentation, reviews, media, localization, mapping, and measurable engagement or cost outcomes. Use performance and platform work as proof of senior frontend depth without letting it dominate. This is the primary Phantom-oriented variant.

### Content structure

1. Contact information.
2. Two-sentence summary focused on consumer product ownership, React/Next.js, experimentation, performance, and cross-functional delivery.
3. Experience, with Headout bullets ordered as follows:
   - Product discovery, rankings, cards, filters, sorting, and collection/category experiences.
   - Pinned and unified reviews with the 38x interaction result.
   - Media and video experiences, traveler content, galleries, and performance work.
   - Interactive itineraries and mapping with the USD 7.8k annual saving.
   - SSR, caching, Core Web Vitals, and application resilience.
   - AI/platform work compressed to one bullet showing end-to-end ownership and delivery leverage.
4. Projects, prioritizing PlutoDesktop or another user-facing 0-to-1 public product.
5. Technical skills led by React, Next.js, TypeScript, JavaScript, frontend architecture, web performance, and experimentation.
6. Education.

### Evidence selection

GitHub contributions will support coherent product narratives: discovery and navigation, reviews and trust, media-rich product pages, localization and SEO, product experimentation, analytics, and performance. Small fixes and maintenance PRs will be treated as corroborating evidence, not separate bullets.

## Shared Evidence and Truth Rules

- Use `docs/dhruv-resume/` as the source document and preserve its contact, employer, education, and verified metrics.
- Treat GitHub PR titles and descriptions as evidence of scope, technologies, and shipped work, but do not infer business metrics that are not documented.
- Preserve the existing verified figures: 80% repeated frontend implementation-time reduction, 38x review interaction increase, USD 7.8k annual saving, 11% CDN cache-hit improvement, and 87% CPU reduction, subject to consistency with contribution evidence.
- Do not present every PR as merged unless merge status is explicitly verified.
- Do not claim sole ownership when the evidence only supports contribution or implementation.
- Do not add technologies solely because they occur in a job description.

## Contribution Data Flow

1. Search authored pull requests for GitHub user `Illusion47586` in each named Headout repository.
2. Retrieve PR metadata and descriptions in bounded repository/date slices so results are not truncated by search limits.
3. Normalize each contribution into repository, PR number, title, URL, theme, technology, scope, and documented outcome.
4. Cluster contributions into resume themes.
5. Select only high-signal, role-relevant evidence for each variant.
6. Preserve a local contribution brief alongside the design artifacts so claims can be audited later.

## Failure Handling

- If a JavaScript-rendered posting cannot be fetched directly, use agent-browser to inspect the rendered posting.
- If GitHub search reaches a result cap, divide the search by repository and creation-date range.
- If a repository returns no authored PRs, record that result and search authored commits before concluding there were no contributions.
- If a metric cannot be tied to the existing resume or contribution evidence, omit it or request confirmation.
- If a resume exceeds one page, reduce low-signal content before shrinking typography or margins.
- If LaTeX compilation fails, fix document-local issues and rerun the build from the document directory through the CLI.

## Validation

Each variant must pass all of the following:

- `bun src/cli.ts build --doc <document-id> --json` succeeds.
- The exported PDF is one page and visually inspected for clipping, awkward wrapping, broken links, or density problems.
- Contact details, dates, employer names, metrics, and URLs remain accurate.
- Standard ATS section headings and text-based content are preserved.
- React, Next.js, TypeScript, product ownership, performance, and relevant quality keywords appear naturally.
- Unsupported React Native, trading, crypto, WebSocket, Playwright, Vitest, or MSW claims do not appear.
- Each Headout bullet follows action + technical scope + outcome where evidence permits.
- The two variants are materially distinct in summary, bullet ordering, emphasis, projects, and skills rather than simple filename copies.

## Implementation Boundary

The implementation will branch twice from `dhruv-resume`, create a contribution evidence brief, tailor each `main.tex`, build both documents, inspect the PDFs, and revise for one-page readability. No application code, CLI behavior, setup instructions, or repository README behavior will change.
