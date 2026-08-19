# Graviton ATS-Safe Header Design

Date: 2026-08-20

## Objective

Replace the icon-based contact row in `docs/graviton-full-stack/main.tex` with a plain-text, ATS-safe row that presents a cleaner professional identity.

## Approved Header

Display this centered contact row beneath the name:

> Bengaluru, India | LinkedIn | GitHub | +91 88002 23291 | dhruvtiwari110058@gmail.com

`LinkedIn` remains linked to `https://www.linkedin.com/in/dhruvtiwari47586/`. `GitHub` remains linked to `https://github.com/Illusion47586`, while the raw `Illusion47586` handle is not displayed. The email remains a `mailto:` link.

## Design Decisions

- Remove the LinkedIn and GitHub icons because PDF extraction currently produces garbled characters for them.
- Add `Bengaluru, India` as a plain-text location.
- Use professional labels rather than displaying the GitHub gamertag.
- Format the Indian phone number with country code and readable grouping.
- Preserve clickable links for human reviewers.
- Use ASCII vertical bars as separators.
- Do not change the name, summary, experience, projects, education, or Technical Skills.

## Validation

- The exported PDF remains one A4 page.
- Extracted header text contains `Bengaluru, India`, `LinkedIn`, `GitHub`, `+91 88002 23291`, and the email address.
- Extracted header text does not contain `(cid:`, the section-sign artifact, or `Illusion47586`.
- The LinkedIn, GitHub, and email hyperlink annotations remain present.
- The rendered header is centered, evenly spaced, and does not wrap.
- CLI build/export, typecheck, and lint succeed.

## Failure Handling

- If the row wraps, reduce contact-row font size from `\small` to `\footnotesize` before removing information.
- If ATS extraction still produces artifacts, remove any remaining icon macro calls from the contact row and verify the PDF again.
