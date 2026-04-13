import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    skills: [{ type: String, required: true }],
    experienceLevel: { type: String, required: true },
    salaryRange: { type: String, required: true },
    jobType: { type: String, required: true },
    industry: { type: String, required: true },
    postedDate: { type: Date, required: true },
    description: { type: String, required: true }
  },
  { timestamps: true }
);

export const Job = mongoose.model('Job', JobSchema);

