const XLSX = require('xlsx');
const axios = require('axios');

class GoogleSheetsService {
  /**
   * Structure portfolio into 8 distinct categorical tables
   */
  prepareSheetsData(portfolio) {
    const personalRows = [{
      'Full Name': portfolio.personalInfo?.fullName || '',
      'Email': portfolio.personalInfo?.email || '',
      'Phone': portfolio.personalInfo?.phone || '',
      'Location': portfolio.personalInfo?.location || '',
      'LinkedIn': portfolio.personalInfo?.linkedin || '',
      'GitHub': portfolio.personalInfo?.github || '',
      'Portfolio URL': portfolio.personalInfo?.portfolioUrl || '',
      'Tagline': portfolio.personalInfo?.tagline || '',
      'Professional Summary': portfolio.summary || ''
    }];

    const skillsRows = (portfolio.skills || []).map(s => ({
      'Skill Name': s.name,
      'Category': s.category,
      'Proficiency': s.proficiency,
      'Years of Experience': s.yearsOfExperience || 0,
      'Highlighted': s.highlight ? 'Yes' : 'No'
    }));

    const experienceRows = (portfolio.experience || []).map(e => ({
      'Company': e.company,
      'Role': e.role,
      'Location': e.location || '',
      'Type': e.type || 'Full-time',
      'Start Date': e.startDate,
      'End Date': e.isCurrent ? 'Present' : e.endDate,
      'Technologies': (e.technologies || []).join(', '),
      'Key Achievements': (e.bulletPoints || []).join(' | ')
    }));

    const projectRows = (portfolio.projects || []).map(p => ({
      'Project Title': p.title,
      'Role': p.role,
      'Category': p.category,
      'Summary': p.summary,
      'Technologies': (p.technologies || []).join(', '),
      'Metrics & Impact': p.metrics || '',
      'Key Deliverables': (p.bulletPoints || []).join(' | '),
      'GitHub URL': p.githubUrl || '',
      'Live URL': p.liveUrl || ''
    }));

    const certRows = (portfolio.certifications || []).map(c => ({
      'Certification Name': c.name,
      'Issuer': c.issuer,
      'Issue Date': c.issueDate,
      'Expiry Date': c.expiryDate || 'No Expiry',
      'Credential ID': c.credentialId || '',
      'Verification URL': c.credentialUrl || ''
    }));

    const educationRows = (portfolio.education || []).map(ed => ({
      'Institution': ed.institution,
      'Degree': ed.degree,
      'Field of Study': ed.field,
      'Location': ed.location || '',
      'Start Date': ed.startDate,
      'End Date': ed.endDate,
      'Grade / GPA': ed.grade || '',
      'Relevant Coursework': (ed.coursework || []).join(', ')
    }));

    const achievementRows = (portfolio.achievements || []).map(a => ({
      'Achievement Title': a.title,
      'Issuer / Organization': a.issuer || '',
      'Date': a.date || '',
      'Description': a.description
    }));

    const publicationRows = (portfolio.publications || []).map(pub => ({
      'Publication Title': pub.title,
      'Publisher / Venue': pub.publisher || '',
      'Date': pub.date || '',
      'Authors': (pub.authors || []).join(', '),
      'Link': pub.link || '',
      'Abstract': pub.summary || ''
    }));

    const languageRows = (portfolio.languages || []).map(l => ({
      'Language': l.language,
      'Proficiency': l.proficiency
    }));

    return {
      'Personal_Info': personalRows,
      'Skills': skillsRows,
      'Experience': experienceRows,
      'Projects': projectRows,
      'Certifications': certRows,
      'Education': educationRows,
      'Achievements': achievementRows,
      'Publications': publicationRows,
      'Languages': languageRows
    };
  }

  /**
   * Generates a multi-sheet Excel (.xlsx) buffer directly compatible with Google Sheets
   */
  generateMultiSheetBuffer(portfolio) {
    const dataMap = this.prepareSheetsData(portfolio);
    const workbook = XLSX.utils.book_new();

    for (const [sheetName, rows] of Object.entries(dataMap)) {
      const worksheet = XLSX.utils.json_to_sheet(rows.length ? rows : [{ 'Note': 'No records entered yet' }]);
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    }

    return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  }

  /**
   * Sync directly with Google Apps Script Web App Webhook
   */
  async syncToGoogleSheet(portfolio, scriptUrl) {
    if (!scriptUrl || !scriptUrl.startsWith('http')) {
      throw new Error('Please configure a valid Google Apps Script Web App URL.');
    }

    const payload = {
      action: 'syncPortfolio',
      timestamp: new Date().toISOString(),
      portfolioData: this.prepareSheetsData(portfolio)
    };

    const response = await axios.post(scriptUrl, payload, {
      timeout: 20000,
      headers: { 'Content-Type': 'application/json' },
      maxRedirects: 5
    });

    return response.data;
  }

  /**
   * Pull records back from Google Sheets Web App
   */
  async importFromGoogleSheet(scriptUrl) {
    if (!scriptUrl || !scriptUrl.startsWith('http')) {
      throw new Error('Please configure a valid Google Apps Script Web App URL.');
    }

    const response = await axios.get(scriptUrl, {
      params: { action: 'fetchPortfolio' },
      timeout: 20000,
      maxRedirects: 5
    });

    return response.data;
  }
}

module.exports = new GoogleSheetsService();
