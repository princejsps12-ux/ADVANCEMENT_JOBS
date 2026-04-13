"""Sklearn-based NLP: distinctive n-grams from resume that align with job corpus text."""

from __future__ import annotations

import re

import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer

_WS = re.compile(r"\s+")


def _job_corpus_blob(job_texts: list[str]) -> str:
    return _WS.sub(" ", " ".join(job_texts).lower()).strip()


def extract_nlp_skill_phrases(
    resume_text: str,
    job_texts: list[str],
    *,
    max_phrases: int = 22,
) -> list[str]:
    """
    TF-IDF over [resume | jobs]; take top resume bigrams/trigrams that also
    appear in the combined job text (so they are career-relevant vs noise).
    """
    if not resume_text.strip() or not job_texts:
        return []

    blob = _job_corpus_blob(job_texts)
    if len(blob) < 20:
        return []

    combined = [resume_text] + list(job_texts)
    vec = TfidfVectorizer(
        ngram_range=(2, 3),
        max_features=5000,
        stop_words="english",
        min_df=1,
        max_df=0.92,
        sublinear_tf=True,
    )
    try:
        X = vec.fit_transform(combined)
    except ValueError:
        return []

    names = vec.get_feature_names_out()
    r = np.asarray(X[0].todense()).ravel()
    order = np.argsort(r)[::-1]

    out: list[str] = []
    seen: set[str] = set()
    for i in order:
        if r[i] <= 0 or len(out) >= max_phrases:
            break
        phrase = str(names[i]).lower().strip()
        if len(phrase) < 4:
            continue
        if phrase in seen:
            continue
        if phrase not in blob:
            continue
        seen.add(phrase)
        out.append(phrase)

    return out
