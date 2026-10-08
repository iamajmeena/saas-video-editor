# Install SaaS Video Editor as a Claude Code skill (Windows PowerShell).
$ErrorActionPreference = "Stop"
$dest = Join-Path $env:USERPROFILE ".claude\skills\saas-video-editor"
New-Item -ItemType Directory -Force $dest | Out-Null
Copy-Item -Recurse -Force "$PSScriptRoot\*" $dest
Remove-Item -Recurse -Force "$dest\.git" -ErrorAction SilentlyContinue
python -m pip install -r "$PSScriptRoot\requirements.txt"
python -m playwright install chromium
if (-not (Get-Command ffmpeg -ErrorAction SilentlyContinue)) { Write-Warning "ffmpeg not found - run: winget install Gyan.FFmpeg" }
Write-Host "Installed to $dest. Restart Claude Code, then say: 'edit this video with saas-video-editor'."
