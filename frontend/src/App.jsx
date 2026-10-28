import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import PortfolioManager from './components/PortfolioManager';
import ResumeGenerator from './components/ResumeGenerator';
import GoogleSheetsSync from './components/GoogleSheetsSync';
import UnstructuredImportModal from './components/UnstructuredImportModal';
import SettingsModal from './components/SettingsModal';
import { api } from './api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [portfolio, setPortfolio] = useState(null);
  const [health, setHealth] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showImportModal, setShowImportModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [hRes, pRes, sRes] = await Promise.all([
        api.getHealth(),
        api.getPortfolio(),
        api.getSettings()
      ]);

      setHealth(hRes);
      if (pRes.success) setPortfolio(pRes.data);
      if (sRes.success) setSettings(sRes.data);
    } catch (err) {
      console.error('Failed to load initial data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      const [pRes, sRes] = await Promise.all([
        api.getPortfolio(),
        api.getSettings()
      ]);
      if (pRes.success) setPortfolio(pRes.data);
      if (sRes.success) setSettings(sRes.data);
    } catch (err) {
      console.error('Refresh error:', err);
    }
  };

  const handleResetSample = async () => {
    if (!window.confirm('Reset portfolio to the comprehensive demo profile (Alex Rivera - Senior Software & AI Engineer)?')) {
      return;
    }
    try {
      const res = await api.resetSampleData();
      if (res.success) {
        setPortfolio(res.data);
        alert('Portfolio reset successfully to comprehensive sample data!');
      }
    } catch (err) {
      alert('Reset error: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-main)',
        color: 'var(--text-primary)',
        fontFamily: 'var(--font-heading)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '3px solid rgba(99, 102, 241, 0.2)',
            borderTopColor: '#6366f1',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 16px'
          }} />
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Connecting to NexusPortfolio Database...</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '6px' }}>MongoDB • Gemini API</p>
        </div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        portfolio={portfolio}
        health={health}
        settings={settings}
        onResetSample={handleResetSample}
        onOpenSettings={() => setShowSettingsModal(true)}
      />

      {/* Main Container */}
      <main className="app-container" style={{ flex: 1 }}>
        {activeTab === 'dashboard' && (
          <Dashboard
            portfolio={portfolio}
            setActiveTab={setActiveTab}
            onOpenImportModal={() => setShowImportModal(true)}
          />
        )}

        {activeTab === 'portfolio' && (
          <PortfolioManager
            portfolio={portfolio}
            onRefresh={handleRefresh}
            onOpenImportModal={() => setShowImportModal(true)}
          />
        )}

        {activeTab === 'resume' && (
          <ResumeGenerator
            portfolio={portfolio}
          />
        )}

        {activeTab === 'sheets' && (
          <GoogleSheetsSync
            portfolio={portfolio}
            settings={settings}
            onRefresh={handleRefresh}
            onOpenSettings={() => setShowSettingsModal(true)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="no-print" style={{
        borderTop: '1px solid var(--border-subtle)',
        padding: '24px',
        textAlign: 'center',
        fontSize: '0.82rem',
        color: 'var(--text-muted)',
        background: 'rgba(11, 15, 25, 0.9)'
      }}>
        NexusPortfolio AI • Built with React, Node.js, Express, MongoDB & Google Gemini API • Strict Anti-Hallucination Verified
      </footer>

      {/* Modals */}
      <UnstructuredImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onRefresh={handleRefresh}
      />

      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        onRefresh={handleRefresh}
      />
    </div>
  );
}
