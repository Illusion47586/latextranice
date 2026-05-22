---
name: job-posting-resume-brief
description: Use when the user provides a job posting URL and wants a structured job brief, requirements and skills analysis, target-resume guidance, and an interactive plan to improve a resume variant in this repository.
---

# Job Posting Resume Brief

Use this skill to turn a job posting link into a practical resume-targeting workflow for this repository.

## Workflow

1. Fetch the job posting URL.
   - Use browser or web tools if the page is dynamic.
   - Capture the canonical URL, company, role title, location, work mode, seniority, and posting date if visible.
   - If the posting is inaccessible, ask the user to paste the job description.
2. Create a job brief before editing any resume.
   - Use `references/job-brief-template.md` as the output shape.
   - Separate explicit requirements from inferred requirements.
   - Extract ATS keywords, technologies, responsibilities, seniority signals, and evaluation criteria.
   - Describe what a strong matching resume should emphasize.
3. Inspect the target resume.
   - Default document id: `dhruv-resume`.
   - Read `docs/<document-id>/main.tex`.
   - Use `bun src/cli.ts list --json` if the target document is unclear.
4. Compare job brief against the resume.
   - Identify strong matches, weak matches, missing evidence, overemphasized material, and risky claims.
   - Invoke or apply guidance from the installed `tech-resume-optimizer` skill for technical resume quality.
5. Work interactively with the user.
   - Ask before making strategic changes that affect truth, positioning, seniority, or role focus.
   - Use the structured question UI described below when it is available.
   - Prefer branching before tailoring: `bun src/cli.ts branch --from dhruv-resume --to <job-specific-id> --json`.
   - Never fabricate experience, metrics, employers, tools, or outcomes.
6. After edits, validate.
   - Run `bun src/cli.ts build --doc <document-id> --json`.
   - If build fails, fix LaTeX issues or report missing packages clearly.
   - Summarize changes and remaining gaps.

## Questions To Ask

Ask only questions that affect targeting or truth:

- Which resume variant should be tailored, if not `dhruv-resume`?
- Should this be a new branch/variant for the company or role?
- Which experiences are true but under-documented in the current resume?
- Are there metrics, scale numbers, or project details the user can confirm?
- What tradeoff should the resume optimize for: ATS keyword match, recruiter readability, technical depth, or executive impact?

## Question UI

When the `request_user_input` tool is available, use it for questions that decide resume positioning, truthfulness, or tailoring tradeoffs. Use plain text only when that tool is unavailable.

Use this syntax:

```json
{
  "questions": [
    {
      "id": "resume_focus",
      "header": "Focus",
      "question": "Which positioning should this resume variant optimize for?",
      "options": [
        {
          "label": "AI Dev Tools (Recommended)",
          "description": "Lead with agentic tooling, developer platforms, and code intelligence work."
        },
        {
          "label": "Full-Stack Product",
          "description": "Lead with end-to-end product engineering across UI, APIs, and systems."
        }
      ]
    }
  ]
}
```

Question UI rules:

- Ask one to three short questions at a time.
- Use stable `snake_case` ids.
- Keep `header` values 12 characters or fewer.
- Provide two or three mutually exclusive options.
- Put the recommended option first and suffix its label with `(Recommended)`.
- Make option descriptions explain the impact or tradeoff of choosing that option.
- Do not ask questions whose answers can be found in the job posting, repository, or resume.
- Do not use the UI for open-ended resume rewrite requests; ask those plainly and concisely.

## Output Rules

- Start with the job brief and gap analysis before suggesting edits.
- Keep explicit vs inferred requirements clearly labeled.
- For resume changes, describe the intent and exact section affected.
- Preserve the repository model: every resume is a full document folder under `docs/<document-id>/`.
- Keep CLI use non-interactive and JSON-friendly.
- For every code or workflow change, update `README.md` if behavior or commands changed.
