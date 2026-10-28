const express = require('express');
const router = express.Router();
const Portfolio = require('../models/Portfolio');
const initialPortfolio = require('../sample_data/initialPortfolio');
const geminiService = require('../services/geminiService');
const googleSheetsService = require('../services/googleSheetsService');

// Helper to get or create primary portfolio document
async function getOrCreatePortfolio() {
  let portfolio = await Portfolio.findOne();
  if (!portfolio) {
    portfolio = new Portfolio(initialPortfolio);
    await portfolio.save();
  }
  return portfolio;
}

// 1. GET full portfolio
router.get('/', async (req, res) => {
  try {
    const portfolio = await getOrCreatePortfolio();
    res.json({ success: true, data: portfolio });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. PUT Personal Info
router.put('/personal', async (req, res) => {
  try {
    const portfolio = await getOrCreatePortfolio();
    portfolio.personalInfo = { ...portfolio.personalInfo.toObject(), ...req.body };
    await portfolio.save();
    res.json({ success: true, data: portfolio.personalInfo });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. PUT Summary
router.put('/summary', async (req, res) => {
  try {
    const portfolio = await getOrCreatePortfolio();
    portfolio.summary = req.body.summary;
    await portfolio.save();
    res.json({ success: true, data: portfolio.summary });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- SKILLS CRUD ---
router.post('/skills', async (req, res) => {
  try {
    const portfolio = await getOrCreatePortfolio();
    portfolio.skills.push(req.body);
    await portfolio.save();
    res.status(201).json({ success: true, data: portfolio.skills });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.put('/skills/:id', async (req, res) => {
  try {
    const portfolio = await getOrCreatePortfolio();
    const item = portfolio.skills.id(req.params.id);
    if (!item) return res.status(404).json({ success: false, error: 'Skill not found' });
    Object.assign(item, req.body);
    await portfolio.save();
    res.json({ success: true, data: portfolio.skills });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.delete('/skills/:id', async (req, res) => {
  try {
    const portfolio = await getOrCreatePortfolio();
    portfolio.skills.pull({ _id: req.params.id });
    await portfolio.save();
    res.json({ success: true, data: portfolio.skills });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- EXPERIENCE CRUD ---
router.post('/experience', async (req, res) => {
  try {
    const portfolio = await getOrCreatePortfolio();
    portfolio.experience.push(req.body);
    await portfolio.save();
    res.status(201).json({ success: true, data: portfolio.experience });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.put('/experience/:id', async (req, res) => {
  try {
    const portfolio = await getOrCreatePortfolio();
    const item = portfolio.experience.id(req.params.id);
    if (!item) return res.status(404).json({ success: false, error: 'Experience not found' });
    Object.assign(item, req.body);
    await portfolio.save();
    res.json({ success: true, data: portfolio.experience });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.delete('/experience/:id', async (req, res) => {
  try {
    const portfolio = await getOrCreatePortfolio();
    portfolio.experience.pull({ _id: req.params.id });
    await portfolio.save();
    res.json({ success: true, data: portfolio.experience });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- PROJECTS CRUD ---
router.post('/projects', async (req, res) => {
  try {
    const portfolio = await getOrCreatePortfolio();
    portfolio.projects.push(req.body);
    await portfolio.save();
    res.status(201).json({ success: true, data: portfolio.projects });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.put('/projects/:id', async (req, res) => {
  try {
    const portfolio = await getOrCreatePortfolio();
    const item = portfolio.projects.id(req.params.id);
    if (!item) return res.status(404).json({ success: false, error: 'Project not found' });
    Object.assign(item, req.body);
    await portfolio.save();
    res.json({ success: true, data: portfolio.projects });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.delete('/projects/:id', async (req, res) => {
  try {
    const portfolio = await getOrCreatePortfolio();
    portfolio.projects.pull({ _id: req.params.id });
    await portfolio.save();
    res.json({ success: true, data: portfolio.projects });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- CERTIFICATIONS CRUD ---
router.post('/certifications', async (req, res) => {
  try {
    const portfolio = await getOrCreatePortfolio();
    portfolio.certifications.push(req.body);
    await portfolio.save();
    res.status(201).json({ success: true, data: portfolio.certifications });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.put('/certifications/:id', async (req, res) => {
  try {
    const portfolio = await getOrCreatePortfolio();
    const item = portfolio.certifications.id(req.params.id);
    if (!item) return res.status(404).json({ success: false, error: 'Certification not found' });
    Object.assign(item, req.body);
    await portfolio.save();
    res.json({ success: true, data: portfolio.certifications });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.delete('/certifications/:id', async (req, res) => {
  try {
    const portfolio = await getOrCreatePortfolio();
    portfolio.certifications.pull({ _id: req.params.id });
    await portfolio.save();
    res.json({ success: true, data: portfolio.certifications });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- EDUCATION CRUD ---
router.post('/education', async (req, res) => {
  try {
    const portfolio = await getOrCreatePortfolio();
    portfolio.education.push(req.body);
    await portfolio.save();
    res.status(201).json({ success: true, data: portfolio.education });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.put('/education/:id', async (req, res) => {
  try {
    const portfolio = await getOrCreatePortfolio();
    const item = portfolio.education.id(req.params.id);
    if (!item) return res.status(404).json({ success: false, error: 'Education not found' });
    Object.assign(item, req.body);
    await portfolio.save();
    res.json({ success: true, data: portfolio.education });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.delete('/education/:id', async (req, res) => {
  try {
    const portfolio = await getOrCreatePortfolio();
    portfolio.education.pull({ _id: req.params.id });
    await portfolio.save();
    res.json({ success: true, data: portfolio.education });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- ACHIEVEMENTS CRUD ---
router.post('/achievements', async (req, res) => {
  try {
    const portfolio = await getOrCreatePortfolio();
    portfolio.achievements.push(req.body);
    await portfolio.save();
    res.status(201).json({ success: true, data: portfolio.achievements });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.delete('/achievements/:id', async (req, res) => {
  try {
    const portfolio = await getOrCreatePortfolio();
    portfolio.achievements.pull({ _id: req.params.id });
    await portfolio.save();
    res.json({ success: true, data: portfolio.achievements });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- PUBLICATIONS CRUD ---
router.post('/publications', async (req, res) => {
  try {
    const portfolio = await getOrCreatePortfolio();
    portfolio.publications.push(req.body);
    await portfolio.save();
    res.status(201).json({ success: true, data: portfolio.publications });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.delete('/publications/:id', async (req, res) => {
  try {
    const portfolio = await getOrCreatePortfolio();
    portfolio.publications.pull({ _id: req.params.id });
    await portfolio.save();
    res.json({ success: true, data: portfolio.publications });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- LANGUAGES CRUD ---
router.post('/languages', async (req, res) => {
  try {
    const portfolio = await getOrCreatePortfolio();
    portfolio.languages.push(req.body);
    await portfolio.save();
    res.status(201).json({ success: true, data: portfolio.languages });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.delete('/languages/:id', async (req, res) => {
  try {
    const portfolio = await getOrCreatePortfolio();
    portfolio.languages.pull({ _id: req.params.id });
    await portfolio.save();
    res.json({ success: true, data: portfolio.languages });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- RESET TO SAMPLE DATA ---
router.post('/reset-sample', async (req, res) => {
  try {
    await Portfolio.deleteMany({});
    const portfolio = new Portfolio(initialPortfolio);
    await portfolio.save();
    res.json({ success: true, message: 'Portfolio reset to comprehensive sample profile', data: portfolio });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- AI PARSE UNSTRUCTURED TEXT ---
router.post('/ai/parse-unstructured', async (req, res) => {
  try {
    const { rawText, shouldMerge } = req.body;
    if (!rawText || rawText.trim() === '') {
      return res.status(400).json({ success: false, error: 'Raw text is required' });
    }

    const portfolio = await getOrCreatePortfolio();
    const apiKey = req.headers['x-gemini-api-key'] || portfolio.customSettings?.geminiApiKey;
    const model = portfolio.customSettings?.preferredModel || 'gemini-1.5-flash';

    const parsedData = await geminiService.parseUnstructuredPortfolio(rawText, apiKey, model);

    if (shouldMerge) {
      if (parsedData.personalInfo) portfolio.personalInfo = { ...portfolio.personalInfo.toObject(), ...parsedData.personalInfo };
      if (parsedData.summary) portfolio.summary = parsedData.summary;
      if (parsedData.skills && parsedData.skills.length > 0) portfolio.skills.push(...parsedData.skills);
      if (parsedData.experience && parsedData.experience.length > 0) portfolio.experience.push(...parsedData.experience);
      if (parsedData.projects && parsedData.projects.length > 0) portfolio.projects.push(...parsedData.projects);
      if (parsedData.certifications && parsedData.certifications.length > 0) portfolio.certifications.push(...parsedData.certifications);
      if (parsedData.education && parsedData.education.length > 0) portfolio.education.push(...parsedData.education);
      await portfolio.save();
      return res.json({ success: true, message: 'Parsed and merged into portfolio', data: portfolio });
    }

    res.json({ success: true, data: parsedData });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- GOOGLE SHEETS EXPORT XLSX ---
router.get('/sheets/export-xlsx', async (req, res) => {
  try {
    const portfolio = await getOrCreatePortfolio();
    const buffer = googleSheetsService.generateMultiSheetBuffer(portfolio);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="Portfolio_Database_${(portfolio.personalInfo.fullName || 'User').replace(/\s+/g, '_')}.xlsx"`);
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- GOOGLE SHEETS WEBHOOK SYNC ---
router.post('/sheets/sync', async (req, res) => {
  try {
    const { scriptUrl, sheetUrl } = req.body;
    const portfolio = await getOrCreatePortfolio();

    const targetUrl = scriptUrl || portfolio.googleSheetConfig?.scriptUrl;
    if (!targetUrl) {
      return res.status(400).json({ success: false, error: 'Google Apps Script Web App URL is required' });
    }

    portfolio.googleSheetConfig.scriptUrl = targetUrl;
    if (sheetUrl) portfolio.googleSheetConfig.sheetUrl = sheetUrl;

    const syncResult = await googleSheetsService.syncToGoogleSheet(portfolio, targetUrl);

    portfolio.googleSheetConfig.lastSyncedAt = new Date();
    portfolio.googleSheetConfig.syncStatus = 'synced';
    portfolio.googleSheetConfig.syncError = '';
    await portfolio.save();

    res.json({ success: true, message: 'Google Sheets synchronization successful!', result: syncResult, lastSyncedAt: portfolio.googleSheetConfig.lastSyncedAt });
  } catch (err) {
    const portfolio = await getOrCreatePortfolio();
    portfolio.googleSheetConfig.syncStatus = 'error';
    portfolio.googleSheetConfig.syncError = err.message;
    await portfolio.save();
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- GOOGLE SHEETS IMPORT ---
router.post('/sheets/import', async (req, res) => {
  try {
    const { scriptUrl } = req.body;
    const portfolio = await getOrCreatePortfolio();
    const targetUrl = scriptUrl || portfolio.googleSheetConfig?.scriptUrl;
    if (!targetUrl) return res.status(400).json({ success: false, error: 'Script URL required' });

    const fetched = await googleSheetsService.importFromGoogleSheet(targetUrl);
    res.json({ success: true, data: fetched });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
