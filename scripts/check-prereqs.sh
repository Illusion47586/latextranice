#!/usr/bin/env bash
set -euo pipefail

missing=()

for tool in bun latexmk pdflatex; do
  if ! command -v "$tool" >/dev/null 2>&1; then
    missing+=("$tool")
  fi
done

if [ "${#missing[@]}" -gt 0 ]; then
  printf 'Missing required tooling: %s\n\n' "${missing[*]}" >&2
  cat >&2 <<'MESSAGE'
Install Bun plus a local TeX distribution before running the previewer.

macOS:
  - Bun: https://bun.sh/docs/installation
  - TeX: https://tug.org/mactex/

After installation, make sure bun, latexmk, and pdflatex are available on PATH.
MESSAGE
  exit 1
fi

echo "Required tooling is available."
