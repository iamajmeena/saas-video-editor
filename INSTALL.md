# Install

```bash
git clone https://github.com/iamajmeena/saas-video-editor.git
cd saas-video-editor
sh install.sh            # Git Bash / macOS / Linux      (Windows PowerShell: .\install.ps1)
```
Needs: Python 3.10+, ffmpeg on PATH, Chrome/Chromium (installed by Playwright), ~2 GB for the Whisper large-v3-turbo model on first transcription.
The installer copies this repo to `~/.claude/skills/saas-video-editor`, installs `requirements.txt` and Playwright Chromium.

## First video (say this to Claude Code)
> "Edit this video with saas-video-editor: C:/path/to/source.mov"

Claude then follows `WORKFLOW.md`: scaffolds the project (`scripts/new_reel.py`), transcribes (Hinglish-safe), shows the transcript
and a beat plan, asks everything unclear in one message, builds beat 1 as a trial, then continues beat by beat.

## Manual use
```bash
python scripts/new_reel.py MyReel source.mov            # project folder, face frames, audio, transcript
python scripts/render.py MyReel/comp.html --out MyReel/trial.mp4 --width 1080 --height 1920 --fps 30 --workers 6
python scripts/make_preview.py MyReel/trial.mp4          # light playable copy
python scripts/make_preview.py MyReel/trial.mp4 --gif --ss 2 --t 4   # README-size GIF
```
License: PolyForm Noncommercial 1.0.0 (derived from onetake by Patrick). Noncommercial use only.
