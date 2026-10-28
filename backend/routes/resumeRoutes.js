const express = require('express');
const router = express.Router();
const Portfolio = require('../models/Portfolio');
const sampleJDs = require('../sample_data/sampleJDs');
const geminiService = require('../services/geminiService');
const pdfService = require('../services/pdfService');
const docxService = require('../services/docxService');

// 1. Get sample job descriptions
router.get('/sample-jds', (req, res) => {
  res.json({ success: true, data: sampleJDs });
});

// 2. Analyze Job Description
router.post('/analyze-jd', async (req, res) => {
  try {
    const { jobDescription } = req.body;
    if (!jobDescription || jobDescription.trim() === '') {
      return res.status(400).json({ success: false, error: 'Job description text is required' });
    }

    const portfolio = await Portfolio.findOne();
    if (!portfolio) {
      return res.status(404).json({ success: false, error: 'Portfolio not found' });
    }

    const apiKey = req.headers['x-gemini-api-key'] || portfolio.customSettings?.geminiApiKey;
    const model = portfolio.customSettings?.preferredModel || 'gemini-1.5-flash';

    const analysis = await geminiService.analyzeJobDescription(jobDescription, portfolio, apiKey, model);
    res.json({ success: true, data: analysis });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Tailor Summary with Gemini
router.post('/tailor-summary', async (req, res) => {
  try {
    const { jobDescription, selectedItems } = req.body;
    const portfolio = await Portfolio.findOne();
    if (!portfolio) return res.status(404).json({ success: false, error: 'Portfolio not found' });

    const apiKey = req.headers['x-gemini-api-key'] || portfolio.customSettings?.geminiApiKey;
    const model = portfolio.customSettings?.preferredModel || 'gemini-1.5-flash';

    const tailoredSummary = await geminiService.generateTailoredSummary(jobDescription, portfolio, selectedItems, apiKey, model);
    res.json({ success: true, data: { summary: tailoredSummary } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Generate Assembled Resume with Verification
router.post('/generate', async (req, res) => {
  try {
    const {
      jobDescription,
      targetRole,
      selectedSkillIds,
      selectedExperienceIds,
      selectedProjectIds,
      selectedCertIds,
      selectedEducationIds,
      selectedAchievementIds,
      selectedPublicationIds,
      customSummary,
      template
    } = req.body;

    const portfolio = await Portfolio.findOne();
    if (!portfolio) return res.status(404).json({ success: false, error: 'Portfolio not found' });

    // Filter items based on user selection or defaults
    const filteredSkills = portfolio.skills.filter(s => 
      !selectedSkillIds || selectedSkillIds.includes(s._id.toString())
    );

    const filteredExperience = portfolio.experience.filter(e => 
      !selectedExperienceIds || selectedExperienceIds.includes(e._id.toString())
    );

    const filteredProjects = portfolio.projects.filter(p => 
      !selectedProjectIds || selectedProjectIds.includes(p._id.toString())
    );

    const filteredCerts = portfolio.certifications.filter(c => 
      !selectedCertIds || selectedCertIds.includes(c._id.toString())
    );

    const filteredEducation = portfolio.education.filter(ed => 
      !selectedEducationIds || selectedEducationIds.includes(ed._id.toString())
    );

    const filteredAchievements = portfolio.achievements.filter(a => 
      !selectedAchievementIds || selectedAchievementIds.includes(a._id.toString())
    );

    const filteredPublications = portfolio.publications.filter(pub => 
      !selectedPublicationIds || selectedPublicationIds.includes(pub._id.toString())
    );

    const resumeData = {
      personalInfo: {
        ...portfolio.personalInfo.toObject(),
        tagline: targetRole || portfolio.personalInfo.tagline
      },
      summary: customSummary || portfolio.summary,
      skills: filteredSkills,
      experience: filteredExperience,
      projects: filteredProjects,
      certifications: filteredCerts,
      education: filteredEducation,
      achievements: filteredAchievements,
      publications: filteredPublications,
      languages: portfolio.languages,
      template: template || 'modern-tech',
      generatedAt: new Date().toISOString()
    };

    // Run strict anti-hallucination verification
    const verificationReport = geminiService.verifyAntiHallucination(resumeData, portfolio);

    res.json({
      success: true,
      data: {
        resume: resumeData,
        verification: verificationReport
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. Download Vector PDF
router.post('/download-pdf', async (req, res) => {
  try {
    const { resumeData } = req.body;
    if (!resumeData) return res.status(400).json({ success: false, error: 'Resume data required' });

    const safeName = (resumeData.personalInfo?.fullName || 'Resume').replace(/\s+/g, '_');
    const role = (resumeData.personalInfo?.tagline || 'Software_Engineer').split('|')[0].trim().replace(/\s+/g, '_');

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${safeName}_${role}_Resume.pdf"`);

    pdfService.generateResumePDF(resumeData, res);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 6. Download DOCX Word Resume
router.post('/download-docx', async (req, res) => {
  try {
    const { resumeData } = req.body;
    if (!resumeData) return res.status(400).json({ success: false, error: 'Resume data required' });

    const safeName = (resumeData.personalInfo?.fullName || 'Resume').replace(/\s+/g, '_');
    const role = (resumeData.personalInfo?.tagline || 'Software_Engineer').split('|')[0].trim().replace(/\s+/g, '_');

    const buffer = await docxService.generateResumeDocx(resumeData);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename="${safeName}_${role}_Resume.docx"`);
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 7. Verification Endpoint
router.post('/verify', async (req, res) => {
  try {
    const { resumeData } = req.body;
    const portfolio = await Portfolio.findOne();
    if (!portfolio) return res.status(404).json({ success: false, error: 'Portfolio not found' });

    const report = geminiService.verifyAntiHallucination(resumeData, portfolio);
    res.json({ success: true, data: report });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
