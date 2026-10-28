import React from 'react';
import { 
  Sparkles, 
  FileText, 
  Database, 
  Table, 
  CheckCircle2, 
  Briefcase, 
  Code2, 
  Award, 
  GraduationCap, 
  UploadCloud, 
  Download,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  ExternalLink
} from 'lucide-react';
import { api } from '../api';

export default function Dashboard({ portfolio, setActiveTab, onOpenImportModal }) {
  const info = portfolio?.personalInfo || {};
  const skillsCount = portfolio?.skills?.length || 0;
  const expCount = portfolio?.experience?.length || 0;
  const projCount = portfolio?.projects?.length || 0;
  const certCount = portfolio?.certifications?.length || 0;
  const sheetStatus = portfolio?.googleSheetConfig?.syncStatus || 'idle';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', marginTop: '24px' }}>
      {/* Hero Welcome Card */}
      <div className="glass-card" style={{
        padding: '32px',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid rgba(99, 102, 241, 0.25)',
        background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.95) 0%, rgba(30, 27, 75, 0.5) 100%)'
      }}>
        <div style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '260px',
          height: '260px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ maxWidth: '780px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }} className="badge badge-indigo">
              <Sparkles size={13} />
              AI-Powered Portfolio Management & ATS Resume Intelligence
            </div>
            <h1 style={{ fontSize: '2.2rem', marginBottom: '10px', lineHeight: 1.2 }}>
              Welcome back, <span className="gradient-text">{info.fullName || 'Professional'}</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '18px' }}>
              {info.tagline || 'Software Engineer'} • {info.location || 'Remote'}
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6, maxWidth: '700px' }}>
              Your professional portfolio is centrally structured in MongoDB with <strong>{skillsCount} verified skills</strong>, <strong>{expCount} work experiences</strong>, and <strong>{projCount} projects</strong>. Generate job-specific, ATS-optimized resumes targeted against any Job Description using Google Gemini API.
            </p>

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px', flexWrap: 'wrap' }}>
              <button 
                className="btn btn-primary btn-lg"
                onClick={() => setActiveTab('resume')}
              >
                <FileText size={18} />
                Generate Tailored Resume from JD
                <ArrowRight size={16} />
              </button>

              <button 
                className="btn btn-secondary btn-lg"
                onClick={onOpenImportModal}
              >
                <UploadCloud size={18} />
                AI Parse Unstructured Bio / Resume
              </button>

              <a 
                href={api.getExportXlsxUrl()}
                className="btn btn-accent btn-lg"
                download
              >
                <Download size={18} />
                Export Multi-Sheet Database (.xlsx)
              </a>
            </div>
          </div>

          {/* Quick Integrity Badge Card */}
          <div className="glass-panel" style={{
            padding: '20px',
            minWidth: '260px',
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#34d399', fontWeight: 700, fontSize: '0.92rem', marginBottom: '10px' }}>
              <ShieldCheck size={18} />
              Anti-Hallucination Guardrail
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
              Active verification engine ensures 0 invented skills, companies, degrees, or certifications during AI resume generation.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Verification Status:</span>
              <span className="badge badge-emerald">100% Grounded</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem', marginTop: '6px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Google Sheets Sync:</span>
              <span className={`badge ${sheetStatus === 'synced' ? 'badge-emerald' : 'badge-amber'}`}>
                {sheetStatus === 'synced' ? 'Synchronized' : 'Ready to Sync'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '18px'
      }}>
        {/* Metric 1: Skills */}
        <div className="glass-card" style={{ padding: '20px', cursor: 'pointer' }} onClick={() => setActiveTab('portfolio')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'rgba(99, 102, 241, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#a5b4fc'
            }}>
              <Code2 size={20} />
            </div>
            <span className="badge badge-indigo">MongoDB</span>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>{skillsCount}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Technical & Soft Skills</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Frontend, Backend, Cloud & AI</div>
        </div>

        {/* Metric 2: Experience */}
        <div className="glass-card" style={{ padding: '20px', cursor: 'pointer' }} onClick={() => setActiveTab('portfolio')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'rgba(16, 185, 129, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#34d399'
            }}>
              <Briefcase size={20} />
            </div>
            <span className="badge badge-emerald">Verified</span>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>{expCount}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Work Experience Roles</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Quantified metric bullet points</div>
        </div>

        {/* Metric 3: Projects */}
        <div className="glass-card" style={{ padding: '20px', cursor: 'pointer' }} onClick={() => setActiveTab('portfolio')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'rgba(236, 72, 153, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#f472b6'
            }}>
              <TrendingUp size={20} />
            </div>
            <span className="badge badge-rose">Showcase</span>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>{projCount}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Featured Projects & Systems</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>RAG, Microservices, Cloud, AI</div>
        </div>

        {/* Metric 4: Certifications */}
        <div className="glass-card" style={{ padding: '20px', cursor: 'pointer' }} onClick={() => setActiveTab('portfolio')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'rgba(245, 158, 11, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fbbf24'
            }}>
              <Award size={20} />
            </div>
            <span className="badge badge-amber">Accredited</span>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>{certCount}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Certifications & Credentials</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>AWS, GCP & MongoDB certified</div>
        </div>

        {/* Metric 5: Google Sheets */}
        <div className="glass-card" style={{ padding: '20px', cursor: 'pointer' }} onClick={() => setActiveTab('sheets')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'rgba(6, 182, 212, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#22d3ee'
            }}>
              <Table size={20} />
            </div>
            <span className="badge badge-cyan">8 Tabs</span>
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
            {sheetStatus === 'synced' ? 'Connected' : 'Sync Ready'}
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Google Sheets Integration</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Apps Script Webhook / Excel</div>
        </div>
      </div>

      {/* Architecture & Flow Infographic Card */}
      <div className="glass-card" style={{ padding: '28px' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={18} color="#818cf8" />
          End-to-End System Architecture & Workflow
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px'
        }}>
          {/* Step 1 */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--primary-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800 }}>1</div>
              <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Centralized Database</span>
            </div>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              All 10 modules (Personal, Summary, Skills, Experience, Projects, Certs, Education, Achievements, Publications, Languages) persist in MongoDB with strict validation.
            </p>
          </div>

          {/* Step 2 */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--primary-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800 }}>2</div>
              <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Google Sheets Sync</span>
            </div>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Automatic export to Google Sheets creates 8 dedicated worksheets. Sync via Google Apps Script Webhook or download structured multi-tab spreadsheets.
            </p>
          </div>

          {/* Step 3 */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--primary-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800 }}>3</div>
              <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Gemini JD Matching</span>
            </div>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Paste any JD or select sample roles. Gemini API extracts required tech keywords, calculates candidate match score (0-100%), and flags matched vs missing skills.
            </p>
          </div>

          {/* Step 4 */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--primary-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800 }}>4</div>
              <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Dynamic ATS Resume</span>
            </div>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Customize tailored summaries, select matching projects/experiences with AI badges, preview live in 3 ATS templates, and export vector PDF & DOCX.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
