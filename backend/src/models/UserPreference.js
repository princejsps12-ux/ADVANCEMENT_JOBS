import mongoose from 'mongoose';

const UserPreferenceSchema = new mongoose.Schema(
  {
    skills: [{ type: String }],
    city: { type: String },
    experienceLevel: { type: String },
    jobType: { type: String },
    salaryRange: { type: String },
    industry: { type: String }
  },
  { timestamps: true }
);

export const UserPreference = mongoose.model(
  'UserPreference',
  UserPreferenceSchema
);

