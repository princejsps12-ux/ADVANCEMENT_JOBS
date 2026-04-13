import re
from typing import Any

import numpy as np
from sklearn.decomposition import TruncatedSVD
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import Normalizer

from .nlp_extract import extract_nlp_skill_phrases
from .skills_lexicon import SKILL_LEXICON

_WS = re.compile(r"\s+")
_LETTER_SPACED_CHUNK = re.compile(
    r"(?<!\S)(?:[A-Za-z0-9@.+#/\-&] ){2,}[A-Za-z0-9@.+#/\-&](?!\S)"
)


def extract_text_from_pdf(file_bytes: bytes) -> str:
    from pypdf import PdfReader
    from io import BytesIO

    reader = PdfReader(BytesIO(file_bytes))
    parts: list[str] = []
    for page in reader.pages:
        t = page.extract_text()
        if t:
            parts.append(t)
    raw = "\n".join(parts)
    text = _collapse_letter_spaced_text(raw)
    return _WS.sub(" ", text).strip()


def _collapse_letter_spaced_text(text: str) -> str:
    """
    Some PDFs extract as single-character tokens:
    'R e a c t' / 'N o d e . j s' / '7 . 3 9'.
    Join those runs back into normal words so NLP scoring works.
    """
    return _LETTER_SPACED_CHUNK.sub(lambda m: m.group(0).replace(" ", ""), text)


def normalize_skill(s: str) -> str:
    return _WS.sub(" ", s.strip().lower())


def extract_skills_from_text(text: str, extra_phrases: list[str] | None = None) -> list[str]:
    """Match known skill phrases and job-listed skills against resume text."""
    low = text.lower()
    found: set[str] = set()
    phrases = list(SKILL_LEXICON)
    if extra_phrases:
        for p in extra_phrases:
            n = normalize_skill(p)
            if len(n) >= 2:
                phrases.append(n)

    # Longer phrases first to prefer "machine learning" over "learning"
    phrases = sorted({normalize_skill(p) for p in phrases}, key=len, reverse=True)
    for phrase in phrases:
        if len(phrase) < 2:
            continue
        if phrase in low:
            found.add(phrase)
            continue
        if " " not in phrase:
            pattern = r"(?<![a-z0-9])" + re.escape(phrase) + r"(?![a-z0-9])"
            if re.search(pattern, low):
                found.add(phrase)
    return sorted(found)


def jaccard_skills(resume_skills: set[str], job_skills: set[str]) -> float:
    if not job_skills:
        return 0.0
    inter = len(resume_skills & job_skills)
    union = len(resume_skills | job_skills)
    return inter / union if union else 0.0


def coverage_skills(resume_skills: set[str], job_skills: set[str]) -> float:
    """Fraction of required job skills present on resume."""
    if not job_skills:
        return 1.0
    return len(resume_skills & job_skills) / len(job_skills)


def tfidf_similarities(resume_text: str, job_texts: list[str]) -> np.ndarray:
    corpus = [resume_text] + job_texts
    vec = TfidfVectorizer(
        max_features=8000,
        ngram_range=(1, 2),
        min_df=1,
        stop_words="english",
        sublinear_tf=True,
    )
    mat = vec.fit_transform(corpus)
    sims = cosine_similarity(mat[0:1], mat[1:]).flatten()
    return np.clip(sims, 0.0, 1.0)


def lsa_similarities(resume_text: str, job_texts: list[str]) -> np.ndarray:
    """
    LSA: TF-IDF + TruncatedSVD + row L2-normalize, then cosine in dense space.
    Captures co-occurrence structure (lightweight alternative to neural embeddings).
    """
    corpus = [resume_text] + job_texts
    vec = TfidfVectorizer(
        max_features=12000,
        ngram_range=(1, 2),
        min_df=1,
        max_df=0.95,
        stop_words="english",
        sublinear_tf=True,
    )
    X = vec.fit_transform(corpus)
    n_samples, n_features = X.shape
    n_jobs = len(job_texts)
    if n_jobs == 0:
        return np.array([])

    m = min(n_samples, n_features)
    if m < 2:
        return tfidf_similarities(resume_text, job_texts)
    k = min(96, m - 1)
    if k < 1:
        return tfidf_similarities(resume_text, job_texts)

    try:
        svd = TruncatedSVD(n_components=k, random_state=42)
        dense = svd.fit_transform(X)
    except ValueError:
        return tfidf_similarities(resume_text, job_texts)

    dense = Normalizer(copy=False).fit_transform(dense)
    sims = (dense[0:1] @ dense[1:].T).flatten()
    return np.clip(np.asarray(sims, dtype=np.float64), 0.0, 1.0)


def roadmap_for_skill(skill: str) -> list[str]:
    title = skill.title()
    return [
        f"Learn core concepts of {title} (official docs or a structured intro course).",
        f"Practice {title} with 2–3 small projects or notebooks tied to realistic tasks.",
        f"Add {title} to your resume with measurable outcomes (metrics, scale, or impact).",
    ]


def analyze_resume_against_jobs(
    resume_bytes: bytes,
    jobs: list[dict[str, Any]],
) -> dict[str, Any]:
    raw_text = extract_text_from_pdf(resume_bytes)
    if not raw_text or len(raw_text) < 40:
        raise ValueError(
            "Could not extract enough text from the PDF. Try another file or a text-based PDF."
        )

    job_skill_phrases: list[str] = []
    for j in jobs:
        for s in j.get("skills") or []:
            if isinstance(s, str):
                job_skill_phrases.append(s)

    lexicon_skills = extract_skills_from_text(raw_text, job_skill_phrases)

    job_texts: list[str] = []
    for j in jobs:
        title = j.get("title") or ""
        desc = j.get("description") or ""
        skills_line = " ".join(j.get("skills") or [])
        job_texts.append(f"{title}\n{desc}\n{skills_line}")

    nlp_phrases = extract_nlp_skill_phrases(raw_text, job_texts)
    resume_skills_list = sorted(
        {normalize_skill(s) for s in lexicon_skills}
        | {normalize_skill(p) for p in nlp_phrases}
    )
    resume_skill_set = set(resume_skills_list)

    tfidf_scores = tfidf_similarities(raw_text, job_texts)
    lsa_scores = lsa_similarities(raw_text, job_texts)

    results: list[dict[str, Any]] = []
    for idx, job in enumerate(jobs):
        js = {normalize_skill(s) for s in (job.get("skills") or []) if isinstance(s, str)}
        jac = jaccard_skills(resume_skill_set, js)
        cov = coverage_skills(resume_skill_set, js)
        tf = float(tfidf_scores[idx]) if idx < len(tfidf_scores) else 0.0
        lsa = float(lsa_scores[idx]) if idx < len(lsa_scores) else 0.0
        # Blend: sparse + LSA “semantic” fit + structured skill overlap
        match_pct = round(
            100
            * (0.32 * tf + 0.28 * lsa + 0.28 * cov + 0.12 * jac),
            1,
        )
        missing = sorted(js - resume_skill_set)
        matched = sorted(js & resume_skill_set)

        roadmap = [{"skill": m, "steps": roadmap_for_skill(m)} for m in missing[:8]]

        results.append(
            {
                "jobId": str(job.get("_id", "")),
                "matchPercent": min(100.0, max(0.0, match_pct)),
                "tfidfSimilarity": round(tf, 4),
                "lsaSimilarity": round(lsa, 4),
                "skillJaccard": round(jac, 4),
                "skillCoverage": round(cov, 4),
                "missingSkills": missing,
                "matchedSkills": matched,
                "learningRoadmap": roadmap,
            }
        )

    results.sort(key=lambda x: x["matchPercent"], reverse=True)

    return {
        "resumeTextLength": len(raw_text),
        "extractedSkills": resume_skills_list,
        "skillsBySource": {
            "lexicon": sorted({normalize_skill(s) for s in lexicon_skills}),
            "nlpTfidfNgrams": nlp_phrases,
        },
        "similarityMethods": ["tfidf_cosine", "lsa_svd_cosine", "skill_coverage", "skill_jaccard"],
        "results": results,
    }
