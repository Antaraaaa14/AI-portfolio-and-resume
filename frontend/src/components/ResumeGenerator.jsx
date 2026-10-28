import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  FileText, 
  Download, 
  Printer, 
  CheckCircle2, 
  AlertCircle, 
  Check, 
  ShieldCheck, 
  RefreshCw, 
  Sliders, 
  ChevronRight,
  TrendingUp,
  Layout,
  Briefcase,
  Layers,
  Award,
  GraduationCap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../api';
import ResumePreview from './ResumePreview';

export default function ResumeGenerator({ portfolio }) {
  const [sampleJDs, setSampleJDs] = useState([]);
  const [selectedJdId, setSelectedJdId] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isTailoringSummary, setIsTailoringSummary] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  // Template State
  const [template, setTemplate] = useState('modern-tech');

  // Selection Matrix
  const [targetRole, setTargetRole] = useState(portfolio?.personalInfo?.tagline || 'Senior Software Engineer');
  const [customSummary, setCustomSummary] = useState(portfolio?.summary || '');
  const [selectedSkillIds, setSelectedSkillIds] = useState([]);
  const [selectedExpIds, setSelectedExpIds] = useState([]);
  const [selectedProjIds, setSelectedProjIds] = useState([]);
  const [selectedCertIds, setSelectedCertIds] = useState([]);
  const [selectedEduIds, setSelectedEduIds] = useState([]);

  // Active Assembled Resume
  const [assembledResume, setAssembledResume] = useState(null);
  const [verification, setVerification] = useState(null);

  // Load sample JDs and initialize default selections
  useEffect(() => {
    loadSampleJDs();
    initDefaultSelections();
  }, [portfolio]);

  const loadSampleJDs = async () => {
    try {
      const res = await api.getSampleJDs();
      if (res.success && res.data.length > 0) {
        setSampleJDs(res.data);
      }
    } catch (err) {
      console.error('Error fetching sample JDs:', err);
    }
  };

  const initDefaultSelections = () => {
    if (!portfolio) return;
    setSelectedSkillIds((portfolio.skills || []).map(s => s._id));
    setSelectedExpIds((portfolio.experience || []).map(e => e._id));
    setSelectedProjIds((portfolio.projects || []).slice(0, 3).map(p => p._id));
    setSelectedCertIds((portfolio.certifications || []).map(c => c._id));
    setSelectedEduIds((portfolio.education || []).map(ed => ed._id));
    setCustomSummary(portfolio.summary || '');
  };

  // 1-Click Load Sample JD
  const handleSelectSampleJD = (jd) => {
    setSelectedJdId(jd.id);
    setJobDescription(jd.description);
    setTargetRole(jd.targetRole || jd.title);
  };

  // Run Gemini JD Analysis
  const handleAnalyzeJD = async () => {
    if (!jobDescription.trim()) {
      alert('Please enter or select a Job Description.');
      return;
    }

    setIsAnalyzing(true);
    try {
      const res = await api.analyzeJD(jobDescription);
      if (res.success) {
        setAnalysis(res.data);
        if (res.data.targetRole) {
          setTargetRole(res.data.targetRole);
        }

        // Auto-select recommended items
        autoSelectMatchingItems(res.data);
      }
    } catch (err) {
      alert('Error analyzing JD: ' + err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Auto-Select top items based on AI recommendations
  const autoSelectMatchingItems = (analysisData) => {
    if (!portfolio) return;

    // Skills: match skills that are in matchedSkills list
    const matchedNames = new Set((analysisData.matchedSkills || []).map(s => s.toLowerCase()));
    const recSkillIds = (portfolio.skills || [])
      .filter(s => matchedNames.has(s.name.toLowerCase()) || s.highlight)
      .map(s => s._id);
    
    // Fallback: at least select top 10 skills
    setSelectedSkillIds(recSkillIds.length >= 6 ? recSkillIds : (portfolio.skills || []).slice(0, 12).map(s => s._id));

    // Projects: select recommended projects
    if (analysisData.recommendedProjects && analysisData.recommendedProjects.length > 0) {
      const topProjIds = analysisData.recommendedProjects
        .filter(p => p.recommended)
        .map(p => p._id);
      setSelectedProjIds(topProjIds.length > 0 ? topProjIds.slice(0, 3) : (portfolio.projects || []).slice(0, 3).map(p => p._id));
    }

    // Experiences
    if (analysisData.recommendedExperiences && analysisData.recommendedExperiences.length > 0) {
      const topExpIds = analysisData.recommendedExperiences
        .filter(e => e.recommended)
        .map(e => e._id);
      setSelectedExpIds(topExpIds.length > 0 ? topExpIds : (portfolio.experience || []).map(e => e._id));
    }

    // Trigger resume regeneration
    triggerRegeneration(recSkillIds);
  };

  // Gemini Tailored Summary Generator
  const handleTailorSummary = async () => {
    if (!jobDescription.trim()) {
      alert('Please enter a target Job Description first.');
      return;
    }

    setIsTailoringSummary(true);
    try {
      const res = await api.tailorSummary(jobDescription, {
        skills: selectedSkillIds,
        experience: selectedExpIds,
        projects: selectedProjIds
      });

      if (res.success && res.data.summary) {
        setCustomSummary(res.data.summary);
      }
    } catch (err) {
      alert('Error tailoring summary: ' + err.message);
    } finally {
      setIsTailoringSummary(false);
    }
  };

  // Regenerate Resume from Current Selections
  const triggerRegeneration = async () => {
    setIsGenerating(true);
    try {
      const payload = {
        jobDescription,
        targetRole,
        selectedSkillIds,
        selectedExperienceIds: selectedExpIds,
        selectedProjectIds: selectedProjIds,
        selectedCertIds,
        selectedEducationIds: selectedEduIds,
        customSummary,
        template
      };

      const res = await api.generateResume(payload);
      if (res.success) {
        setAssembledResume(res.data.resume);
        setVerification(res.data.verification);
      }
    } catch (err) {
      console.error('Error generating resume:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Auto-regenerate whenever selections or template change
  useEffect(() => {
    if (portfolio) {
      triggerRegeneration();
    }
  }, [
    selectedSkillIds, 
    selectedExpIds, 
    selectedProjIds, 
    selectedCertIds, 
    selectedEduIds, 
    customSummary, 
    targetRole, 
    template
  ]);

  // Download PDF
  const handleDownloadPDF = async () => {
    if (!assembledResume) return;
    try {
      await api.downloadPDF(assembledResume);
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.8 } });
    } catch (err) {
      alert('PDF Download Error: ' + err.message);
    }
  };

  // Download DOCX
  const handleDownloadDOCX = async () => {
    if (!assembledResume) return;
    try {
      await api.downloadDOCX(assembledResume);
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.8 } });
    } catch (err) {
      alert('DOCX Download Error: ' + err.message);
    }
  };

  // Toggle helpers
  const toggleSkill = (id) => {
    setSelectedSkillIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };
  const toggleExp = (id) => {
    setSelectedExpIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };
  const toggleProj = (id) => {
    setSelectedProjIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };
  const toggleCert = (id) => {
    setSelectedCertIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  return (
    <div style={{ marginTop: '24px' }}>
      {/* Title Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '20px'
      }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={22} color="#ec4899" />
            AI Dynamic Resume Generator
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Tailor your resume for specific job descriptions using Gemini API matching and verified portfolio data.
          </p>
        </div>

        {/* Action Download Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button 
            className="btn btn-primary"
            onClick={handleDownloadPDF}
            disabled={!assembledResume}
          >
            <Download size={16} />
            Download PDF Resume
          </button>

          <button 
            className="btn btn-secondary"
            onClick={handleDownloadDOCX}
            disabled={!assembledResume}
          >
            <Download size={16} />
            Download DOCX (Word)
          </button>

          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => window.print()}
            title="Print or Save via Browser"
          >
            <Printer size={15} />
            Print
          </button>
        </div>
      </div>

      {/* Main Split-Screen Workspace */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '24px',
        alignItems: 'start'
      }}>
        {/* ================= LEFT PANEL: JD INPUT & CUSTOMIZATION MATRIX ================= */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Step 1: Target JD Input Card */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ fontWeight: 700, fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'var(--primary-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', color: '#fff' }}>1</span>
                Target Job Description
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Paste or choose sample</div>
            </div>

            {/* Quick Sample JD Loaders */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', alignSelf: 'center' }}>Test Sample:</span>
              {sampleJDs.map((jd) => (
                <button
                  key={jd.id}
                  className={`btn btn-sm ${selectedJdId === jd.id ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => handleSelectSampleJD(jd)}
                >
                  {jd.id.includes('fullstack') ? 'Cloud Full-Stack JD' : 'AI / ML Engineer JD'}
                </button>
              ))}
            </div>

            <textarea
              className="form-textarea"
              placeholder="Paste job description here... (e.g. Senior Full-Stack Engineer requiring React, Node.js, AWS, MongoDB...)"
              style={{ minHeight: '130px', fontSize: '0.85rem' }}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px' }}>
              <button
                className="btn btn-primary"
                onClick={handleAnalyzeJD}
                disabled={isAnalyzing || !jobDescription.trim()}
              >
                <Sparkles size={16} />
                {isAnalyzing ? 'Analyzing with Gemini...' : 'Analyze JD with Gemini AI'}
              </button>

              {analysis && (
                <span className="badge badge-emerald">
                  <CheckCircle2 size={12} /> {analysis.matchScore}% Match Score
                </span>
              )}
            </div>
          </div>

          {/* Step 2: Gemini Match Analysis Breakdown */}
          {analysis && (
            <div className="glass-card" style={{ padding: '24px', border: '1px solid rgba(99, 102, 241, 0.35)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div style={{ fontWeight: 700, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <TrendingUp size={18} color="#818cf8" />
                  Gemini Match Intelligence
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '1.4rem', fontWeight: 800 }} className="gradient-text">
                    {analysis.matchScore}%
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Match</span>
                </div>
              </div>

              {/* Summary analysis text */}
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '14px', lineHeight: 1.5 }}>
                {analysis.summaryAnalysis}
              </p>

              {/* Matched vs Missing Skills */}
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#34d399', marginBottom: '6px' }}>
                  ✓ Matched Verified Skills ({analysis.matchedSkills?.length || 0}):
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                  {(analysis.matchedSkills || []).map((s, idx) => (
                    <span key={idx} className="badge badge-emerald" style={{ fontSize: '0.72rem' }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {analysis.missingSkills && analysis.missingSkills.length > 0 && (
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#fbbf24', marginBottom: '6px' }}>
                    ⚡ Skills in JD to Highlight / Gain:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                    {analysis.missingSkills.map((s, idx) => (
                      <span key={idx} className="badge badge-amber" style={{ fontSize: '0.72rem' }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Actionable Tailoring Advice */}
              {analysis.tailoringAdvice && analysis.tailoringAdvice.length > 0 && (
                <div style={{ marginTop: '12px', padding: '12px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#a5b4fc', marginBottom: '6px' }}>
                    💡 Recruiter Tailoring Tips:
                  </div>
                  <ul style={{ paddingLeft: '16px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {analysis.tailoringAdvice.map((tip, idx) => (
                      <li key={idx} style={{ marginBottom: '3px' }}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Interactive Selection Matrix */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ fontWeight: 700, fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'var(--primary-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', color: '#fff' }}>2</span>
                Resume Customization Matrix
              </div>
              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => analysis ? autoSelectMatchingItems(analysis) : initDefaultSelections()}
              >
                <RefreshCw size={13} /> Auto-Select Matching
              </button>
            </div>

            {/* Target Role Tagline */}
            <div className="form-group">
              <label className="form-label">Resume Target Role Header</label>
              <input 
                className="form-input" 
                value={targetRole} 
                onChange={e => setTargetRole(e.target.value)}
              />
            </div>

            {/* Tailored Summary */}
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label className="form-label" style={{ margin: 0 }}>Job-Tailored Professional Summary</label>
                <button 
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.75rem', padding: '3px 8px' }}
                  onClick={handleTailorSummary}
                  disabled={isTailoringSummary}
                >
                  <Sparkles size={12} />
                  {isTailoringSummary ? 'Tailoring...' : 'AI Rewrite for JD'}
                </button>
              </div>
              <textarea 
                className="form-textarea"
                style={{ fontSize: '0.85rem', minHeight: '90px' }}
                value={customSummary}
                onChange={e => setCustomSummary(e.target.value)}
              />
            </div>

            {/* Select Skills Chips */}
            <div style={{ marginBottom: '18px' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                <span>Select Skills to Include ({selectedSkillIds.length} active)</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Click to toggle</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', maxHeight: '160px', overflowY: 'auto', padding: '4px' }}>
                {(portfolio?.skills || []).map((s) => {
                  const isSelected = selectedSkillIds.includes(s._id);
                  const isRecommended = analysis?.matchedSkills?.some(ms => ms.toLowerCase() === s.name.toLowerCase());
                  return (
                    <button
                      key={s._id}
                      onClick={() => toggleSkill(s._id)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '9999px',
                        fontSize: '0.76rem',
                        fontWeight: 600,
                        border: isSelected ? '1px solid #6366f1' : '1px solid var(--border-subtle)',
                        background: isSelected ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                        color: isSelected ? '#FFFFFF' : 'var(--text-muted)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}
                    >
                      {isSelected && <Check size={12} color="#818cf8" />}
                      {s.name}
                      {isRecommended && <span style={{ color: '#34d399', fontSize: '0.68rem' }}>★</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Select Work Experience */}
            <div style={{ marginBottom: '18px' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                Work Experience ({selectedExpIds.length} included)
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {(portfolio?.experience || []).map((exp) => {
                  const isSelected = selectedExpIds.includes(exp._id);
                  return (
                    <div 
                      key={exp._id}
                      onClick={() => toggleExp(exp._id)}
                      style={{
                        padding: '10px 14px',
                        borderRadius: 'var(--radius-md)',
                        background: isSelected ? 'rgba(99, 102, 241, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                        border: isSelected ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid var(--border-subtle)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.88rem', color: isSelected ? '#FFFFFF' : 'var(--text-muted)' }}>
                          {exp.role} at {exp.company}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate}
                        </div>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={isSelected} 
                        onChange={() => {}} 
                        style={{ cursor: 'pointer', accentColor: '#6366f1' }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Select Projects */}
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                Featured Projects ({selectedProjIds.length} included)
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {(portfolio?.projects || []).map((p) => {
                  const isSelected = selectedProjIds.includes(p._id);
                  return (
                    <div 
                      key={p._id}
                      onClick={() => toggleProj(p._id)}
                      style={{
                        padding: '10px 14px',
                        borderRadius: 'var(--radius-md)',
                        background: isSelected ? 'rgba(99, 102, 241, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                        border: isSelected ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid var(--border-subtle)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.88rem', color: isSelected ? '#FFFFFF' : 'var(--text-muted)' }}>
                          {p.title}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {p.technologies?.slice(0, 3).join(', ')}
                        </div>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={isSelected} 
                        onChange={() => {}} 
                        style={{ cursor: 'pointer', accentColor: '#6366f1' }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ================= RIGHT PANEL: LIVE ATS RESUME PREVIEW ================= */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'sticky', top: '70px' }}>
          {/* Preview Controls Bar */}
          <div className="glass-card" style={{ padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layout size={16} color="#818cf8" />
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>ATS Template:</span>
              <select 
                className="form-select"
                style={{ padding: '4px 10px', fontSize: '0.82rem', width: 'auto' }}
                value={template}
                onChange={e => setTemplate(e.target.value)}
              >
                <option value="modern-tech">Tech Modern (Clean Slate)</option>
                <option value="classic-executive">Classic Executive (Serif)</option>
                <option value="minimalist-ats">Minimalist ATS (Single Column)</option>
              </select>
            </div>

            {verification && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={16} color={verification.verified ? '#10b981' : '#f59e0b'} />
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: verification.verified ? '#34d399' : '#fbbf24' }}>
                  {verification.verified ? '100% Anti-Hallucination Verified' : 'Check flagged items'}
                </span>
              </div>
            )}
          </div>

          {/* Live Rendered Paper Component */}
          <div style={{ maxHeight: '82vh', overflowY: 'auto', paddingRight: '4px' }}>
            {assembledResume ? (
              <ResumePreview 
                resumeData={assembledResume} 
                template={template} 
                verification={verification}
              />
            ) : (
              <div className="glass-card" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <FileText size={40} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
                <p>Generating resume preview...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
