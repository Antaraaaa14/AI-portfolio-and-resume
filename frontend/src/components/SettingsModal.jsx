import React, { useState, useEffect } from 'react';
import { X, Key, Table, Sparkles, CheckCircle2, AlertCircle, Save } from 'lucide-react';
import { api } from '../api';

export default function SettingsModal({ isOpen, onClose, onRefresh }) {
  if (!isOpen) return null;

  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [preferredModel, setPreferredModel] = useState('gemini-1.5-flash');
  const [sheetUrl, setSheetUrl] = useState('');
  const [scriptUrl, setScriptUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    loadCurrentSettings();
  }, [isOpen]);

  const loadCurrentSettings = async () => {
    try {
      const res = await api.getSettings();
      if (res.success && res.data) {
        setPreferredModel(res.data.preferredModel || 'gemini-1.5-flash');
        setSheetUrl(res.data.sheetUrl || '');
        setScriptUrl(res.data.scriptUrl || '');
      }
    } catch (err) {
      console.error('Error loading settings:', err);
    }
  };

  const handleTestGemini = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await api.testGemini(geminiApiKey, preferredModel);
      setTestResult({
        success: res.success,
        message: res.message || 'Gemini Connected Successfully!'
      });
    } catch (err) {
      setTestResult({
        success: false,
        message: err.message
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await api.updateSettings({
        geminiApiKey,
        preferredModel,
        sheetUrl,
        scriptUrl
      });
      alert('Settings saved successfully!');
      onRefresh();
      onClose();
    } catch (err) {
      alert('Error saving settings: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem' }}>System & API Configuration</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Configure your Gemini AI credentials and Google Sheets sync webhooks.
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSave}>
          {/* Gemini API Key Section */}
          <div style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', color: '#818cf8', fontWeight: 700, fontSize: '0.92rem' }}>
              <Key size={16} />
              Google Gemini API Settings
            </div>

            <div className="form-group">
              <label className="form-label">Gemini API Key</label>
              <input 
                type="password"
                className="form-input" 
                placeholder="AIzaSy... (leave blank to use server .env or offline NLP engine)"
                value={geminiApiKey}
                onChange={e => setGeminiApiKey(e.target.value)}
              />
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Keys are never logged or exposed to the client. If omitted, the high-precision offline NLP engine is used seamlessly.
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Preferred Gemini Model</label>
              <select 
                className="form-select"
                value={preferredModel}
                onChange={e => setPreferredModel(e.target.value)}
              >
                <option value="gemini-1.5-flash">Gemini 1.5 Flash (Ultra-fast, Recommended)</option>
                <option value="gemini-2.0-flash">Gemini 2.0 Flash (Next-Gen)</option>
                <option value="gemini-1.5-pro">Gemini 1.5 Pro (Deep Reasoning)</option>
              </select>
            </div>

            <button 
              type="button" 
              className="btn btn-secondary btn-sm"
              onClick={handleTestGemini}
              disabled={isTesting}
            >
              <Sparkles size={14} />
              {isTesting ? 'Testing API...' : 'Test Gemini Connection'}
            </button>

            {testResult && (
              <div style={{
                marginTop: '10px',
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.8rem',
                background: testResult.success ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
                color: testResult.success ? '#34d399' : '#fb7185',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                {testResult.success ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                {testResult.message}
              </div>
            )}
          </div>

          {/* Google Sheets Section */}
          <div style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', color: '#38bdf8', fontWeight: 700, fontSize: '0.92rem' }}>
              <Table size={16} />
              Google Sheets Synchronization
            </div>

            <div className="form-group">
              <label className="form-label">Google Apps Script Web App URL</label>
              <input 
                className="form-input" 
                placeholder="https://script.google.com/macros/s/.../exec"
                value={scriptUrl}
                onChange={e => setScriptUrl(e.target.value)}
              />
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Generated when deploying the provided <code>Code.gs</code> as a Web App with access set to "Anyone".
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Target Google Spreadsheet URL (Optional)</label>
              <input 
                className="form-input" 
                placeholder="https://docs.google.com/spreadsheets/d/.../edit"
                value={sheetUrl}
                onChange={e => setSheetUrl(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={isSaving}>
              <Save size={15} />
              {isSaving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
