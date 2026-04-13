import '../env.js';
import mongoose from 'mongoose';
import { Job } from '../models/Job.js';

const uri = process.env.MONGO_URI;
if (!uri) {
  console.error('MONGO_URI is not set. Copy backend/.env.example to backend/.env');
  process.exit(1);
}

const demoJobs = [
  {
    title: 'Full Stack Developer',
    company: 'Nexus Labs',
    location: 'Remote',
    skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'REST APIs'],
    experienceLevel: 'Mid',
    salaryRange: '$90k–$120k',
    jobType: 'Full-time',
    industry: 'Technology',
    postedDate: new Date(),
    description:
      'Build and maintain web applications using React and Node.js. Collaborate on REST APIs, MongoDB data models, and cloud deployment.'
  },
  {
    title: 'Python ML Engineer',
    company: 'DataStream AI',
    location: 'San Francisco',
    skills: ['Python', 'scikit-learn', 'pandas', 'FastAPI', 'machine learning'],
    experienceLevel: 'Senior',
    salaryRange: '$130k–$165k',
    jobType: 'Full-time',
    industry: 'AI',
    postedDate: new Date(Date.now() - 86400000),
    description:
      'Design ML pipelines and APIs with FastAPI. Experience with TF-IDF, model evaluation, and productionizing sklearn models preferred.'
  },
  {
    title: 'Backend Engineer',
    company: 'CloudCart',
    location: 'Austin',
    skills: ['Express', 'MongoDB', 'Docker', 'AWS', 'microservices'],
    experienceLevel: 'Mid',
    salaryRange: '$100k–$135k',
    jobType: 'Full-time',
    industry: 'E-commerce',
    postedDate: new Date(Date.now() - 172800000),
    description:
      'Develop Express-based services, integrate MongoDB, and help deploy containerized apps on AWS.'
  },
  {
    title: 'Junior Web Developer',
    company: 'BrightStart',
    location: 'Chicago',
    skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Git'],
    experienceLevel: 'Entry',
    salaryRange: '$55k–$72k',
    jobType: 'Full-time',
    industry: 'Education',
    postedDate: new Date(Date.now() - 259200000),
    description:
      'Assist in building React frontends and REST integrations. Strong Git workflow and eagerness to learn required.'
  },
  {
    title: 'DevOps Engineer',
    company: 'InfraOne',
    location: 'Remote',
    skills: ['Docker', 'Kubernetes', 'CI/CD', 'Linux', 'AWS'],
    experienceLevel: 'Senior',
    salaryRange: '$125k–$155k',
    jobType: 'Full-time',
    industry: 'Technology',
    postedDate: new Date(Date.now() - 345600000),
    description:
      'Own CI/CD pipelines, Kubernetes clusters, and observability. Experience with cloud networking and security best practices.'
  }
];

async function main() {
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
  const n = await Job.countDocuments();
  if (n > 0) {
    console.log(`Database already has ${n} job(s). Skipping seed (delete jobs first to re-seed).`);
    await mongoose.disconnect();
    return;
  }
  await Job.insertMany(demoJobs);
  console.log(`Inserted ${demoJobs.length} demo jobs.`);
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
