const express = require('express');
const router = express.Router();
const Portfolio = require('../models/Portfolio');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// GET settings
router.get('/', async (req, res) => {
  try {
    let portfolio = await Portfolio.findOne();
    if (!portfolio) {
      return res.json({
        success: true,
        data: {
          hasGeminiKey: !!process.env.GEMINI_API_KEY,
          preferredModel: 'gemini-1.5-flash',
          sheetUrl: '',
          scriptUrl: ''
        }
      });
    }

    const key = portfolio.customSettings?.geminiApiKey || process.env.GEMINI_API_KEY || '';
    const maskedKey = key ? `${key.substring(0, 4)}...${key.substring(key.length - 4)}` : '';

    res.json({
      success: true,
      data: {
        hasGeminiKey: !!key,
        maskedKey,
        preferredModel: portfolio.customSettings?.preferredModel || 'gemini-1.5-flash',
        sheetUrl: portfolio.googleSheetConfig?.sheetUrl || '',
        scriptUrl: portfolio.googleSheetConfig?.scriptUrl || '',
        lastSyncedAt: portfolio.googleSheetConfig?.lastSyncedAt,
        syncStatus: portfolio.googleSheetConfig?.syncStatus
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST update settings
router.post('/', async (req, res) => {
  try {
    const { geminiApiKey, preferredModel, sheetUrl, scriptUrl } = req.body;
    let portfolio = await Portfolio.findOne();
    if (!portfolio) {
      const initialPortfolio = require('../sample_data/initialPortfolio');
      portfolio = new Portfolio(initialPortfolio);
    }

    if (!portfolio.customSettings) portfolio.customSettings = {};
    if (geminiApiKey !== undefined) portfolio.customSettings.geminiApiKey = geminiApiKey.trim();
    if (preferredModel) portfolio.customSettings.preferredModel = preferredModel;

    if (!portfolio.googleSheetConfig) portfolio.googleSheetConfig = {};
    if (sheetUrl !== undefined) portfolio.googleSheetConfig.sheetUrl = sheetUrl.trim();
    if (scriptUrl !== undefined) portfolio.googleSheetConfig.scriptUrl = scriptUrl.trim();

    await portfolio.save();

    res.json({
      success: true,
      message: 'Settings updated successfully',
      data: {
        hasGeminiKey: !!(portfolio.customSettings.geminiApiKey || process.env.GEMINI_API_KEY),
        preferredModel: portfolio.customSettings.preferredModel,
        sheetUrl: portfolio.googleSheetConfig.sheetUrl,
        scriptUrl: portfolio.googleSheetConfig.scriptUrl
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST test Gemini key
router.post('/test-gemini', async (req, res) => {
  try {
    const { apiKey, model } = req.body;
    const portfolio = await Portfolio.findOne();
    const key = apiKey || portfolio?.customSettings?.geminiApiKey || process.env.GEMINI_API_KEY;

    if (!key) {
      return res.status(400).json({ success: false, error: 'No Gemini API key supplied or found' });
    }

    const genAI = new GoogleGenerativeAI(key.trim());
    const targetModel = genAI.getGenerativeModel({ model: model || 'gemini-1.5-flash' });
    const result = await targetModel.generateContent('Say "Gemini API Connected Successfully!" in 5 words.');
    const text = result.response.text();

    res.json({ success: true, message: text.trim() });
  } catch (err) {
    res.status(400).json({ success: false, error: `Gemini API test failed: ${err.message}` });
  }
});

module.exports = router;
