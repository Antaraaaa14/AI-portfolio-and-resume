const API_BASE = 'http://localhost:5001/api';

export const api = {
  // Health
  getHealth: async () => {
    const res = await fetch(`${API_BASE}/health`);
    return res.json();
  },

  // Portfolio
  getPortfolio: async () => {
    const res = await fetch(`${API_BASE}/portfolio`);
    return res.json();
  },

  updatePersonalInfo: async (data) => {
    const res = await fetch(`${API_BASE}/portfolio/personal`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  updateSummary: async (summary) => {
    const res = await fetch(`${API_BASE}/portfolio/summary`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ summary })
    });
    return res.json();
  },

  // Skills
  addSkill: async (skill) => {
    const res = await fetch(`${API_BASE}/portfolio/skills`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(skill)
    });
    return res.json();
  },
  deleteSkill: async (id) => {
    const res = await fetch(`${API_BASE}/portfolio/skills/${id}`, { method: 'DELETE' });
    return res.json();
  },

  // Experience
  addExperience: async (exp) => {
    const res = await fetch(`${API_BASE}/portfolio/experience`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(exp)
    });
    return res.json();
  },
  deleteExperience: async (id) => {
    const res = await fetch(`${API_BASE}/portfolio/experience/${id}`, { method: 'DELETE' });
    return res.json();
  },

  // Projects
  addProject: async (proj) => {
    const res = await fetch(`${API_BASE}/portfolio/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(proj)
    });
    return res.json();
  },
  deleteProject: async (id) => {
    const res = await fetch(`${API_BASE}/portfolio/projects/${id}`, { method: 'DELETE' });
    return res.json();
  },

  // Certifications
  addCertification: async (cert) => {
    const res = await fetch(`${API_BASE}/portfolio/certifications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cert)
    });
    return res.json();
  },
  deleteCertification: async (id) => {
    const res = await fetch(`${API_BASE}/portfolio/certifications/${id}`, { method: 'DELETE' });
    return res.json();
  },

  // Education
  addEducation: async (edu) => {
    const res = await fetch(`${API_BASE}/portfolio/education`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(edu)
    });
    return res.json();
  },
  deleteEducation: async (id) => {
    const res = await fetch(`${API_BASE}/portfolio/education/${id}`, { method: 'DELETE' });
    return res.json();
  },

  // Achievements
  addAchievement: async (item) => {
    const res = await fetch(`${API_BASE}/portfolio/achievements`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    });
    return res.json();
  },
  deleteAchievement: async (id) => {
    const res = await fetch(`${API_BASE}/portfolio/achievements/${id}`, { method: 'DELETE' });
    return res.json();
  },

  // Publications
  addPublication: async (pub) => {
    const res = await fetch(`${API_BASE}/portfolio/publications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pub)
    });
    return res.json();
  },
  deletePublication: async (id) => {
    const res = await fetch(`${API_BASE}/portfolio/publications/${id}`, { method: 'DELETE' });
    return res.json();
  },

  // Languages
  addLanguage: async (lang) => {
    const res = await fetch(`${API_BASE}/portfolio/languages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lang)
    });
    return res.json();
  },
  deleteLanguage: async (id) => {
    const res = await fetch(`${API_BASE}/portfolio/languages/${id}`, { method: 'DELETE' });
    return res.json();
  },

  // Reset Sample
  resetSampleData: async () => {
    const res = await fetch(`${API_BASE}/portfolio/reset-sample`, { method: 'POST' });
    return res.json();
  },

  // AI Unstructured Parser
  parseUnstructured: async (rawText, shouldMerge = false) => {
    const res = await fetch(`${API_BASE}/portfolio/ai/parse-unstructured`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rawText, shouldMerge })
    });
    return res.json();
  },

  // Google Sheets
  getExportXlsxUrl: () => `${API_BASE}/portfolio/sheets/export-xlsx`,
  
  syncGoogleSheets: async (scriptUrl, sheetUrl) => {
    const res = await fetch(`${API_BASE}/portfolio/sheets/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scriptUrl, sheetUrl })
    });
    return res.json();
  },

  importGoogleSheets: async (scriptUrl) => {
    const res = await fetch(`${API_BASE}/portfolio/sheets/import`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scriptUrl })
    });
    return res.json();
  },

  // Resume Engine
  getSampleJDs: async () => {
    const res = await fetch(`${API_BASE}/resume/sample-jds`);
    return res.json();
  },

  analyzeJD: async (jobDescription) => {
    const res = await fetch(`${API_BASE}/resume/analyze-jd`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobDescription })
    });
    return res.json();
  },

  tailorSummary: async (jobDescription, selectedItems) => {
    const res = await fetch(`${API_BASE}/resume/tailor-summary`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobDescription, selectedItems })
    });
    return res.json();
  },

  generateResume: async (payload) => {
    const res = await fetch(`${API_BASE}/resume/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  downloadPDF: async (resumeData) => {
    const res = await fetch(`${API_BASE}/resume/download-pdf`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resumeData })
    });
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const name = (resumeData.personalInfo?.fullName || 'Resume').replace(/\s+/g, '_');
    a.download = `${name}_Customized_Resume.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  },

  downloadDOCX: async (resumeData) => {
    const res = await fetch(`${API_BASE}/resume/download-docx`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resumeData })
    });
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const name = (resumeData.personalInfo?.fullName || 'Resume').replace(/\s+/g, '_');
    a.download = `${name}_Customized_Resume.docx`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  },

  verifyResume: async (resumeData) => {
    const res = await fetch(`${API_BASE}/resume/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resumeData })
    });
    return res.json();
  },

  // Settings
  getSettings: async () => {
    const res = await fetch(`${API_BASE}/settings`);
    return res.json();
  },

  updateSettings: async (settings) => {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    return res.json();
  },

  testGemini: async (apiKey, model) => {
    const res = await fetch(`${API_BASE}/settings/test-gemini`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey, model })
    });
    return res.json();
  }
};
