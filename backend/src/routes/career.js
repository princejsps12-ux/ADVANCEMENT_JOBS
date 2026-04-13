import express from 'express';
import multer from 'multer';
import { Job } from '../models/Job.js';
import { buildFilterQuery } from './jobs.js';

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 }
});

function mlServiceBase() {
  const raw = (process.env.ML_SERVICE_URL || '').trim();
  if (!raw) return 'http://127.0.0.1:8765';
  const noTrail = raw.replace(/\/+$/, '');
  if (/^https?:\/\//i.test(noTrail)) return noTrail;
  return `https://${noTrail}`;
}

function connectionRefused(err) {
  const c = err?.cause;
  return (
    err?.code === 'ECONNREFUSED' ||
    c?.code === 'ECONNREFUSED' ||
    (typeof c?.message === 'string' && c.message.includes('ECONNREFUSED'))
  );
}

const ML_URL = mlServiceBase();

router.post('/match', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ message: 'Upload a PDF resume (field name: resume).' });
    }

    const mime = req.file.mimetype || '';
    const name = (req.file.originalname || '').toLowerCase();
    if (!mime.includes('pdf') && !name.endsWith('.pdf')) {
      return res.status(400).json({ message: 'Only PDF files are supported.' });
    }

    const maxJobs = Math.min(parseInt(req.query.limit || '120', 10), 200);
    const mongoQuery = buildFilterQuery(req.query);

    const jobs = await Job.find(mongoQuery)
      .sort({ postedDate: -1 })
      .limit(maxJobs)
      .lean();

    if (jobs.length === 0) {
      return res.status(400).json({
        message:
          'No jobs match your filters (or the database is empty). Clear filters or add jobs in MongoDB, then try again.'
      });
    }

    const payload = jobs.map((j) => ({
      _id: String(j._id),
      title: j.title,
      description: j.description,
      skills: j.skills || []
    }));

    const form = new FormData();
    const pdfBlob = new Blob([req.file.buffer], {
      type: req.file.mimetype || 'application/pdf'
    });
    form.append('file', pdfBlob, req.file.originalname || 'resume.pdf');
    form.append('jobs_json', JSON.stringify(payload));

    const mlRes = await fetch(`${ML_URL}/match`, {
      method: 'POST',
      body: form
    });

    const text = await mlRes.text();
    const trimmed = text.trim();
    let data;
    try {
      data = trimmed ? JSON.parse(trimmed) : null;
    } catch {
      const looksHtml = trimmed.startsWith('<!') || trimmed.startsWith('<html');
      const hint = looksHtml
        ? ' The URL returned a web page (HTML), not the Python API. Set ML_SERVICE_URL to your FastAPI service (e.g. http://127.0.0.1:8765) and ensure uvicorn is running.'
        : ' Start the ML service: cd ml-service && pip install -r requirements.txt && python -m uvicorn app.main:app --host 127.0.0.1 --port 8765';
      return res.status(502).json({
        message: `ML service returned invalid JSON.${hint}`,
        detail: trimmed.slice(0, 500)
      });
    }

    if (!mlRes.ok) {
      return res.status(mlRes.status >= 400 && mlRes.status < 600 ? mlRes.status : 502).json({
        message: data?.detail || data?.message || 'ML service error',
        detail: data
      });
    }

    const byId = new Map(jobs.map((j) => [String(j._id), j]));
    const enriched = (data.results || []).map((r) => {
      const doc = byId.get(r.jobId);
      return {
        ...r,
        job: doc || null
      };
    });

    res.json({
      extractedSkills: data.extractedSkills,
      resumeTextLength: data.resumeTextLength,
      skillsBySource: data.skillsBySource,
      similarityMethods: data.similarityMethods,
      results: enriched
    });
  } catch (err) {
    console.error('POST /career/match error', err);
    if (connectionRefused(err)) {
      return res.status(503).json({
        message:
          'Career ML service is unreachable. Start it with: cd ml-service; pip install -r requirements.txt; python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8765'
      });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
