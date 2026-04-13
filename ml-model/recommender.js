// Simple content-based recommender using cosine similarity.
// Features: skills (multi-hot), city (one-hot), experienceLevel (one-hot)

const buildUniverses = (jobs, userPrefs) => {
  const skillSet = new Set();
  const citySet = new Set();
  const expSet = new Set();

  jobs.forEach((job) => {
    (job.skills || []).forEach((s) => skillSet.add(s));
    if (job.location) citySet.add(job.location);
    if (job.experienceLevel) expSet.add(job.experienceLevel);
  });

  (userPrefs.skills || []).forEach((s) => skillSet.add(s));
  if (userPrefs.city) citySet.add(userPrefs.city);
  if (userPrefs.experienceLevel) expSet.add(userPrefs.experienceLevel);

  const skills = Array.from(skillSet).sort();
  const cities = Array.from(citySet).sort();
  const exps = Array.from(expSet).sort();

  return { skills, cities, exps };
};

const buildJobVector = (job, universes) => {
  const vec = [];

  universes.skills.forEach((s) => {
    vec.push(job.skills && job.skills.includes(s) ? 1 : 0);
  });

  universes.cities.forEach((c) => {
    vec.push(job.location === c ? 1 : 0);
  });

  universes.exps.forEach((e) => {
    vec.push(job.experienceLevel === e ? 1 : 0);
  });

  return vec;
};

const buildUserVector = (prefs, universes) => {
  const vec = [];

  universes.skills.forEach((s) => {
    vec.push(prefs.skills && prefs.skills.includes(s) ? 1 : 0);
  });

  universes.cities.forEach((c) => {
    vec.push(prefs.city === c ? 1 : 0);
  });

  universes.exps.forEach((e) => {
    vec.push(prefs.experienceLevel === e ? 1 : 0);
  });

  return vec;
};

const cosineSimilarity = (a, b) => {
  if (a.length !== b.length || a.length === 0) return 0;
  let dot = 0;
  let magA = 0;
  let magB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }
  if (magA === 0 || magB === 0) return 0;
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
};

export const recommendJobs = (jobs, userPrefs, topN = 20) => {
  if (!jobs || jobs.length === 0) return [];

  const hasPrefs =
    (userPrefs.skills && userPrefs.skills.length > 0) ||
    Boolean(userPrefs.city) ||
    Boolean(userPrefs.experienceLevel);

  if (!hasPrefs) {
    return [...jobs]
      .sort(
        (a, b) =>
          new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()
      )
      .slice(0, topN);
  }

  const universes = buildUniverses(jobs, userPrefs);
  const userVector = buildUserVector(userPrefs, universes);

  const scored = jobs.map((job) => {
    const jobVector = buildJobVector(job, universes);
    const score = cosineSimilarity(userVector, jobVector);
    return { job, score };
  });

  scored.sort((a, b) => b.score - a.score);

  const filtered = scored.filter((x) => x.score > 0);

  return (filtered.length ? filtered : scored).slice(0, topN).map((x) => x.job);
};

