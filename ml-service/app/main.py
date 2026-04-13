import json
import os
from typing import Any

from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from .matching import analyze_resume_against_jobs

app = FastAPI(title="Career Intelligence ML Service")

_origins = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in _origins if o.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/match")
async def match_resume(
    file: UploadFile = File(...),
    jobs_json: str = Form(...),
):
    raw = await file.read()
    if not raw:
        raise HTTPException(status_code=400, detail="Empty file")

    try:
        jobs = json.loads(jobs_json)
    except json.JSONDecodeError as e:
        raise HTTPException(status_code=400, detail=f"Invalid jobs JSON: {e}") from e

    if not isinstance(jobs, list):
        raise HTTPException(status_code=400, detail="jobs must be a JSON array")

    for j in jobs:
        if not isinstance(j, dict):
            raise HTTPException(status_code=400, detail="Each job must be an object")

    try:
        out = analyze_resume_against_jobs(raw, jobs)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e)) from e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {e!s}") from e

    return out
