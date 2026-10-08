#!/bin/sh
# Auto-publish: commit + push any change in this folder to GitHub.
cd "$(dirname "$0")" || exit 0
git add -A
git diff --cached --quiet && exit 0
git commit -q -m "Update knowledge base $(date +%Y-%m-%d_%H:%M)" && git push -q origin HEAD
