import express from 'express';
import { UserPreference } from '../models/UserPreference.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { skills, city, experienceLevel, jobType, salaryRange, industry } =
      req.body;

    const pref = await UserPreference.create({
      skills: skills || [],
      city: city || '',
      experienceLevel: experienceLevel || '',
      jobType: jobType || '',
      salaryRange: salaryRange || '',
      industry: industry || ''
    });

    res.status(201).json(pref);
  } catch (err) {
    console.error('POST /user/preferences error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

