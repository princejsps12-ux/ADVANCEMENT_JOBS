import express from 'express';
import { Job } from '../models/Job.js';
import { recommendJobs } from '../../../ml-model/recommender.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page || '1', 10);
    const limit = parseInt(req.query.limit || '10', 10);
    const skip = (page - 1) * limit;

    const [jobs, total] = await Promise.all([
      Job.find().sort({ postedDate: -1 }).skip(skip).limit(limit),
      Job.countDocuments()
    ]);

    res.json({
      jobs,
      page,
      total,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    console.error('GET /jobs error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export const buildFilterQuery = (query) => {
  const {
    city,
    skills,
    experienceLevel,
    jobType,
    salaryRange,
    industry,
    search
  } = query;

  const mongoQuery = {};

  if (city) {
    mongoQuery.location = city;
  }
  if (skills) {
    const skillsArr = skills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    if (skillsArr.length) {
      // Match jobs that include any selected skill (typical job-board behavior).
      mongoQuery.skills = { $in: skillsArr };
    }
  }
  if (experienceLevel) {
    mongoQuery.experienceLevel = experienceLevel;
  }
  if (jobType) {
    mongoQuery.jobType = jobType;
  }
  if (salaryRange) {
    mongoQuery.salaryRange = salaryRange;
  }
  if (industry) {
    mongoQuery.industry = industry;
  }
  if (search) {
    const pattern = new RegExp(search, 'i');
    mongoQuery.$or = [
      { title: pattern },
      { company: pattern },
      { description: pattern },
      { skills: pattern }
    ];
  }

  return mongoQuery;
};

router.get('/filter', async (req, res) => {
  try {
    const page = parseInt(req.query.page || '1', 10);
    const limit = parseInt(req.query.limit || '10', 10);
    const skip = (page - 1) * limit;

    const mongoQuery = buildFilterQuery(req.query);

    const [jobs, total] = await Promise.all([
      Job.find(mongoQuery)
        .sort({ postedDate: -1 })
        .skip(skip)
        .limit(limit),
      Job.countDocuments(mongoQuery)
    ]);

    res.json({
      jobs,
      page,
      total,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    console.error('GET /jobs/filter error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/recommend', async (req, res) => {
  try {
    const { skills, city, experienceLevel, limit } = req.query;

    const skillsArr = skills
      ? skills.split(',').map((s) => s.trim())
      : [];

    const baseQuery = {};
    if (city) baseQuery.location = city;
    if (experienceLevel) baseQuery.experienceLevel = experienceLevel;

    const allJobs = await Job.find(baseQuery);

    const userPrefs = {
      skills: skillsArr,
      city: city || '',
      experienceLevel: experienceLevel || ''
    };

    const maxResults = parseInt(limit || '20', 10);

    const recommendations = recommendJobs(allJobs, userPrefs, maxResults);

    res.json({ jobs: recommendations });
  } catch (err) {
    console.error('GET /jobs/recommend error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

