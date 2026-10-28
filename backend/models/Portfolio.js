const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Frontend', 'Backend', 'Database', 'Cloud & DevOps', 'AI & ML', 'Languages', 'Tools & Platforms', 'Soft Skills', 'Other'],
    default: 'Frontend'
  },
  proficiency: { 
    type: String, 
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    default: 'Advanced'
  },
  yearsOfExperience: { type: Number, default: 2 },
  highlight: { type: Boolean, default: false }
});

const ExperienceSchema = new mongoose.Schema({
  company: { type: String, required: true },
  role: { type: String, required: true },
  location: { type: String, default: '' },
  type: { type: String, enum: ['Full-time', 'Part-time', 'Internship', 'Contract', 'Freelance'], default: 'Full-time' },
  startDate: { type: String, required: true },
  endDate: { type: String, default: 'Present' },
  isCurrent: { type: Boolean, default: false },
  bulletPoints: [{ type: String }],
  technologies: [{ type: String }]
});

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  role: { type: String, default: 'Lead Developer' },
  category: { type: String, default: 'Full Stack' },
  summary: { type: String, required: true },
  bulletPoints: [{ type: String }],
  technologies: [{ type: String }],
  metrics: { type: String, default: '' },
  githubUrl: { type: String, default: '' },
  liveUrl: { type: String, default: '' },
  featured: { type: Boolean, default: false }
});

const CertificationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  issuer: { type: String, required: true },
  issueDate: { type: String, default: '' },
  expiryDate: { type: String, default: 'No Expiry' },
  credentialId: { type: String, default: '' },
  credentialUrl: { type: String, default: '' }
});

const EducationSchema = new mongoose.Schema({
  institution: { type: String, required: true },
  degree: { type: String, required: true },
  field: { type: String, required: true },
  location: { type: String, default: '' },
  startDate: { type: String, default: '' },
  endDate: { type: String, default: '' },
  grade: { type: String, default: '' },
  coursework: [{ type: String }]
});

const AchievementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  issuer: { type: String, default: '' },
  date: { type: String, default: '' },
  description: { type: String, required: true }
});

const PublicationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  publisher: { type: String, default: '' },
  date: { type: String, default: '' },
  link: { type: String, default: '' },
  authors: [{ type: String }],
  summary: { type: String, default: '' }
});

const LanguageSchema = new mongoose.Schema({
  language: { type: String, required: true },
  proficiency: { 
    type: String, 
    enum: ['Native', 'Fluent', 'Professional Working', 'Conversational', 'Elementary'],
    default: 'Fluent'
  }
});

const PortfolioSchema = new mongoose.Schema({
  personalInfo: {
    fullName: { type: String, default: 'Alex Rivera' },
    email: { type: String, default: 'alex.rivera@example.com' },
    phone: { type: String, default: '+1 (555) 234-5678' },
    location: { type: String, default: 'San Francisco, CA' },
    linkedin: { type: String, default: 'https://linkedin.com/in/alexrivera-dev' },
    github: { type: String, default: 'https://github.com/alexrivera-tech' },
    portfolioUrl: { type: String, default: 'https://alexrivera.dev' },
    tagline: { type: String, default: 'Senior Software Engineer | Full-Stack & Applied AI Specialist' }
  },
  summary: {
    type: String,
    default: 'Innovative Senior Software Engineer with 5+ years of experience architecting resilient cloud microservices, scalable React web applications, and enterprise LLM-powered systems. Proven track record of boosting system throughput by 45% and reducing infrastructure costs while delivering high-impact products.'
  },
  skills: [SkillSchema],
  experience: [ExperienceSchema],
  projects: [ProjectSchema],
  certifications: [CertificationSchema],
  education: [EducationSchema],
  achievements: [AchievementSchema],
  publications: [PublicationSchema],
  languages: [LanguageSchema],
  googleSheetConfig: {
    sheetUrl: { type: String, default: '' },
    scriptUrl: { type: String, default: '' },
    lastSyncedAt: { type: Date, default: null },
    syncStatus: { type: String, enum: ['idle', 'synced', 'error'], default: 'idle' },
    syncError: { type: String, default: '' }
  },
  customSettings: {
    geminiApiKey: { type: String, default: '' },
    preferredModel: { type: String, default: 'gemini-1.5-flash' }
  }
}, { timestamps: true });

module.exports = mongoose.model('Portfolio', PortfolioSchema);
