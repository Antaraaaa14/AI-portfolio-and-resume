import React, { useState } from 'react';
import { 
  Table, 
  ExternalLink, 
  Download, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Code2, 
  Sparkles,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../api';

export default function GoogleSheetsSync({ portfolio, settings, onRefresh, onOpenSettings }) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [isPulling, setIsPulling] = useState(false);
  const [activeSheetTab, setActiveSheetTab] = useState('Skills');
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState(null);

  const scriptUrl = settings?.scriptUrl || portfolio?.googleSheetConfig?.scriptUrl || '';
  const sheetUrl = settings?.sheetUrl || portfolio?.googleSheetConfig?.sheetUrl || '';
  const lastSynced = portfolio?.googleSheetConfig?.lastSyncedAt;

  // Trigger Google Sheet Webhook Sync
  const handleSyncToSheets = async () => {
    if (!scriptUrl) {
      alert('Please configure your Google Apps Script Web App URL first in Settings.');
      onOpenSettings();
      return;
    }

    setIsSyncing(true);
    try {
      const res = await api.syncGoogleSheets(scriptUrl, sheetUrl);
      if (res.success) {
        setSyncStatusMsg('Successfully synchronized portfolio with Google Sheets!');
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
        onRefresh();
      }
    } catch (err) {
      alert('Sync error: ' + err.message);
    } finally {
      setIsSyncing(false);
    }
  };

  // Pull from Google Sheet
  const handleImportFromSheets = async () => {
    if (!scriptUrl) {
      alert('Please configure your Google Apps Script Web App URL first.');
      onOpenSettings();
      return;
    }

    setIsPulling(true);
    try {
      const res = await api.importGoogleSheets(scriptUrl);
      if (res.success) {
        setSyncStatusMsg('Fetched updated records from Google Sheets!');
        onRefresh();
      }
    } catch (err) {
      alert('Import error: ' + err.message);
    } finally {
      setIsPulling(false);
    }
  };

  // Copy Apps Script code
  const handleCopyScriptCode = () => {
    const code = `function doPost(e) {
  try {
    var rawData = e.postData.contents;
    var parsed = JSON.parse(rawData);
    var portfolioData = parsed.portfolioData;
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    for (var sheetName in portfolioData) {
      if (portfolioData.hasOwnProperty(sheetName)) {
        updateSheet(ss, sheetName, portfolioData[sheetName]);
      }
    }
    return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Synchronized!" })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}

function updateSheet(ss, sheetName, rows) {
  var sheet = ss.getSheetByName(sheetName) || ss.insertSheet(sheetName);
  sheet.clear();
  if (!rows || rows.length === 0) return;
  var headers = Object.keys(rows[0]);
  sheet.appendRow(headers);
  var headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground("#1E293B").setFontColor("#FFFFFF").setFontWeight("bold");
  sheet.setFrozenRows(1);
  var dataMatrix = [];
  for (var i = 0; i < rows.length; i++) {
    var rowValues = [];
    for (var j = 0; j < headers.length; j++) rowValues.push(rows[i][headers[j]] || "");
    dataMatrix.push(rowValues);
  }
  if (dataMatrix.length > 0) sheet.getRange(2, 1, dataMatrix.length, headers.length).setValues(dataMatrix);
  for (var c = 1; c <= headers.length; c++) sheet.autoResizeColumn(c);
}`;

    navigator.clipboard.writeText(code);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2500);
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
            <Table size={22} color="#22d3ee" />
            Google Sheets Synchronization Center
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Export structured database records into 8 multi-tab Google Sheets worksheets or sync directly via Google Apps Script.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <a 
            href={api.getExportXlsxUrl()} 
            className="btn btn-secondary"
            download
          >
            <Download size={16} />
            Download Excel / Sheet (.xlsx)
          </a>

          <button 
            className="btn btn-primary"
            onClick={handleSyncToSheets}
            disabled={isSyncing}
          >
            <RefreshCw size={16} className={isSyncing ? 'animate-spin' : ''} />
            {isSyncing ? 'Synchronizing...' : 'Sync to Google Sheets Webhook'}
          </button>
        </div>
      </div>

      {/* Sync Status Banner */}
      {syncStatusMsg && (
        <div style={{
          marginBottom: '20px',
          padding: '12px 20px',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          color: '#6ee7b7',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.9rem'
        }}>
          <CheckCircle2 size={18} />
          {syncStatusMsg}
        </div>
      )}

      {/* Top 2 Columns: Status & Instructions */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '20px',
        marginBottom: '24px'
      }}>
        {/* Status Card */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={16} color="#818cf8" />
            Sync Status & Endpoints
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.88rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Status:</span>
              <span className={`badge ${scriptUrl ? 'badge-emerald' : 'badge-amber'}`}>
                {scriptUrl ? 'Webhook Configured' : 'Needs Apps Script URL'}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Last Synced:</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                {lastSynced ? new Date(lastSynced).toLocaleString() : 'Never'}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Connected Sheet Link:</span>
              {sheetUrl ? (
                <a href={sheetUrl} target="_blank" rel="noreferrer" style={{ color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
                  Open Google Sheet <ArrowUpRight size={14} />
                </a>
              ) : (
                <span style={{ color: 'var(--text-muted)' }}>Not configured</span>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '4px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Webhook URL:</span>
              <button className="btn btn-secondary btn-sm" onClick={onOpenSettings}>
                Configure in Settings
              </button>
            </div>
          </div>
        </div>

        {/* 1-Click Apps Script Setup Guide */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Code2 size={16} color="#34d399" />
              1-Minute Google Apps Script Setup
            </h3>
            <button 
              className="btn btn-secondary btn-sm"
              onClick={handleCopyScriptCode}
            >
              <Copy size={13} />
              {copyFeedback ? 'Copied Script!' : 'Copy Script Code'}
            </button>
          </div>

          <ol style={{ paddingLeft: '18px', fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            <li>Create or open any Google Spreadsheet in your browser.</li>
            <li>Click <strong>Extensions &gt; Apps Script</strong> in the top menu.</li>
            <li>Click <strong>Copy Script Code</strong> above, paste it into the editor, and click Save.</li>
            <li>Click <strong>Deploy &gt; New deployment</strong>, select <strong>Web app</strong>, set <em>Who has access</em> to <strong>Anyone</strong>, and Deploy.</li>
            <li>Copy the Web App URL (ends with <code>/exec</code>) and paste it into Settings!</li>
          </ol>
        </div>
      </div>

      {/* Relational Table Preview for Google Sheets */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem' }}>Synchronized Relational Sheets Preview</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Data formatted and partitioned across 8 separate sheets for Google Sheets export.
            </p>
          </div>

          {/* Sub-tabs */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {['Skills', 'Experience', 'Projects', 'Certifications', 'Education', 'Personal_Info'].map((t) => (
              <button
                key={t}
                className={`btn btn-sm ${activeSheetTab === t ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setActiveSheetTab(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Tabular Preview */}
        <div style={{ overflowX: 'auto', maxHeight: '350px' }}>
          {activeSheetTab === 'Skills' && (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ background: 'rgba(255, 255, 255, 0.05)', textAlign: 'left', borderBottom: '1px solid var(--border-subtle)' }}>
                  <th style={{ padding: '10px 14px' }}>Skill Name</th>
                  <th style={{ padding: '10px 14px' }}>Category</th>
                  <th style={{ padding: '10px 14px' }}>Proficiency</th>
                  <th style={{ padding: '10px 14px' }}>Years Experience</th>
                </tr>
              </thead>
              <tbody>
                {(portfolio?.skills || []).map((s, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.03)' }}>
                    <td style={{ padding: '10px 14px', fontWeight: 600 }}>{s.name}</td>
                    <td style={{ padding: '10px 14px' }}><span className="badge badge-indigo">{s.category}</span></td>
                    <td style={{ padding: '10px 14px' }}><span className="badge badge-emerald">{s.proficiency}</span></td>
                    <td style={{ padding: '10px 14px' }}>{s.yearsOfExperience} yrs</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeSheetTab === 'Experience' && (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ background: 'rgba(255, 255, 255, 0.05)', textAlign: 'left', borderBottom: '1px solid var(--border-subtle)' }}>
                  <th style={{ padding: '10px 14px' }}>Company</th>
                  <th style={{ padding: '10px 14px' }}>Role</th>
                  <th style={{ padding: '10px 14px' }}>Dates</th>
                  <th style={{ padding: '10px 14px' }}>Technologies</th>
                </tr>
              </thead>
              <tbody>
                {(portfolio?.experience || []).map((e, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.03)' }}>
                    <td style={{ padding: '10px 14px', fontWeight: 600 }}>{e.company}</td>
                    <td style={{ padding: '10px 14px' }}>{e.role}</td>
                    <td style={{ padding: '10px 14px' }}>{e.startDate} – {e.isCurrent ? 'Present' : e.endDate}</td>
                    <td style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>{(e.technologies || []).join(', ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeSheetTab === 'Projects' && (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ background: 'rgba(255, 255, 255, 0.05)', textAlign: 'left', borderBottom: '1px solid var(--border-subtle)' }}>
                  <th style={{ padding: '10px 14px' }}>Project Title</th>
                  <th style={{ padding: '10px 14px' }}>Role & Category</th>
                  <th style={{ padding: '10px 14px' }}>Summary</th>
                  <th style={{ padding: '10px 14px' }}>Impact Metrics</th>
                </tr>
              </thead>
              <tbody>
                {(portfolio?.projects || []).map((p, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.03)' }}>
                    <td style={{ padding: '10px 14px', fontWeight: 600 }}>{p.title}</td>
                    <td style={{ padding: '10px 14px' }}>{p.role} ({p.category})</td>
                    <td style={{ padding: '10px 14px', color: 'var(--text-secondary)' }}>{p.summary}</td>
                    <td style={{ padding: '10px 14px', color: '#34d399', fontWeight: 600 }}>{p.metrics || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeSheetTab === 'Personal_Info' && (
            <div style={{ padding: '14px', fontSize: '0.85rem', lineHeight: 1.8 }}>
              <div><strong>Name:</strong> {portfolio?.personalInfo?.fullName}</div>
              <div><strong>Email:</strong> {portfolio?.personalInfo?.email}</div>
              <div><strong>Phone:</strong> {portfolio?.personalInfo?.phone}</div>
              <div><strong>Location:</strong> {portfolio?.personalInfo?.location}</div>
              <div><strong>LinkedIn:</strong> {portfolio?.personalInfo?.linkedin}</div>
              <div><strong>GitHub:</strong> {portfolio?.personalInfo?.github}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
