#!/bin/sh
# Install SaaS Video Editor as a Claude Code skill (works in Git Bash / macOS / Linux).
set -e
DEST="${CLAUDE_SKILLS_DIR:-$HOME/.claude/skills}/saas-video-editor"
SRC="$(cd "$(dirname "$0")" && pwd)"
mkdir -p "$DEST"
cp -R "$SRC"/. "$DEST"/
rm -rf "$DEST/.git"
python -m pip install -r "$SRC/requirements.txt"
python -m playwright install chromium
command -v ffmpeg >/dev/null || echo "!! ffmpeg not found on PATH - install it (winget install Gyan.FFmpeg / brew install ffmpeg)"
echo "Installed to $DEST. Restart Claude Code, then say: 'edit this video with saas-video-editor'."
