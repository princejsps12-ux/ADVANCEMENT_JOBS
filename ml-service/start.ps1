# Avoids port 8000 (often WinError 10013 on Windows).
Set-Location $PSScriptRoot
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8765
