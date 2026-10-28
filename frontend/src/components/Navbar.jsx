import React from 'react';
import { 
  Sparkles, 
  Database, 
  FileText, 
  Table, 
  Settings as SettingsIcon, 
  RotateCcw, 
  CheckCircle2, 
  Activity,
  Layers
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  portfolio, 
  health, 
  settings, 
  onResetSample, 
  onOpenSettings 
}) {
  const isDbConnected = health?.database === 'connected';
  const hasGemini = settings?.hasGeminiKey || health?.geminiKeyConfigured;
  const isSheetSynced = portfolio?.googleSheetConfig?.syncStatus === 'synced';

  return (
    <header className="no-print" style={{
      borderBottom: '1px solid var(--border-subtle)',
      background: 'rgba(11, 15, 25, 0.85)',
      backdropFilter: 'blur(16px)',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      <div style={{
        maxWidth: '1440px',
        margin: '0 auto',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'var(--primary-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-glow)'
          }}>
            <Sparkles size={22} color="#FFFFFF" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
                Nexus<span className="gradient-text">Portfolio</span> AI
              </span>
              <span className="badge badge-indigo">v2.4 Pro</span>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              MongoDB Database • Gemini API • Google Sheets Sync
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button 
            className={`nav-tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <Activity size={17} />
            Dashboard
          </button>
          
          <button 
            className={`nav-tab-btn ${activeTab === 'portfolio' ? 'active' : ''}`}
            onClick={() => setActiveTab('portfolio')}
          >
            <Database size={17} />
            Portfolio Database
            {portfolio?.skills?.length ? (
              <span style={{
                background: 'rgba(255, 255, 255, 0.1)',
                padding: '1px 6px',
                borderRadius: '9999px',
                fontSize: '0.72rem'
              }}>
                {portfolio.skills.length}
              </span>
            ) : null}
          </button>

          <button 
            className={`nav-tab-btn ${activeTab === 'resume' ? 'active' : ''}`}
            onClick={() => setActiveTab('resume')}
            style={activeTab === 'resume' ? { borderColor: 'rgba(236, 72, 153, 0.4)' } : {}}
          >
            <FileText size={17} />
            AI Resume Generator
            <span className="badge badge-rose" style={{ padding: '1px 6px', fontSize: '0.68rem' }}>AI</span>
          </button>

          <button 
            className={`nav-tab-btn ${activeTab === 'sheets' ? 'active' : ''}`}
            onClick={() => setActiveTab('sheets')}
          >
            <Table size={17} />
            Google Sheets Sync
            {isSheetSynced && (
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }}></span>
            )}
          </button>
        </nav>

        {/* Status Indicators & Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Live Status Pills */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 12px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.78rem'
          }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              color: isDbConnected ? '#34d399' : '#f87171'
            }}>
              <span style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: isDbConnected ? '#10b981' : '#ef4444',
                boxShadow: isDbConnected ? '0 0 8px #10b981' : 'none'
              }}></span>
              MongoDB
            </span>
            <span style={{ color: 'var(--text-muted)' }}>|</span>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              color: hasGemini ? '#a5b4fc' : '#38bdf8'
            }}>
              <Sparkles size={11} />
              {hasGemini ? 'Gemini 1.5' : 'AI Engine'}
            </span>
          </div>

          <button 
            className="btn btn-secondary btn-sm"
            onClick={onResetSample}
            title="Reload comprehensive demo portfolio"
          >
            <RotateCcw size={14} />
            Reset Data
          </button>

          <button 
            className="btn btn-secondary btn-sm"
            onClick={onOpenSettings}
            title="Settings & API Keys"
          >
            <SettingsIcon size={14} />
            Settings
          </button>
        </div>
      </div>
    </header>
  );
}
