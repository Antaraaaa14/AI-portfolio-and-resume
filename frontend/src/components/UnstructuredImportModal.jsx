import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, ArrowRight, UploadCloud, RefreshCw } from 'lucide-react';
import { api } from '../api';

export default function UnstructuredImportModal({ isOpen, onClose, onRefresh }) {
  if (!isOpen) return null;

  const [rawText, setRawText] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [parsedResult, setParsedResult] = useState(null);
  const [isMerging, setIsMerging] = useState(false);

  const sampleBio = `Jordan Lee
Senior Full Stack & AI Engineer based in Seattle, WA.
Email: jordan.lee@example.com | Phone: (206) 555-0199
LinkedIn: linkedin.com/in/jordanlee-dev | GitHub: github.com/jordanlee-tech

Professional Summary:
Passionate senior software engineer with 5+ years building scalable web applications and applied machine learning tools. Expert in React, Node.js, Python, and cloud infrastructure on AWS.

Core Skills:
React, TypeScript, Next.js, Node.js, Express, Python, FastAPI, MongoDB, PostgreSQL, AWS Lambda, Docker, LangChain, Gemini API, Agile Leadership.

Work Experience:
Lead Software Engineer at CloudNova (2022 - Present):
- Built cloud microservices using Node.js and MongoDB serving 500k active users.
- Reduced API response latency by 45% using Redis caching.

Software Engineer at TechFlow Inc (2019 - 2022):
- Developed responsive client dashboard in React & Vite with real-time charting.

Education:
University of Washington, B.S. in Computer Science (2015 - 2019), GPA: 3.82.`;

  const handleParse = async () => {
    if (!rawText.trim()) {
      alert('Please paste some text first.');
      return;
    }

    setIsParsing(true);
    try {
      const res = await api.parseUnstructured(rawText, false);
      if (res.success) {
        setParsedResult(res.data);
      }
    } catch (err) {
      alert('Parsing error: ' + err.message);
    } finally {
      setIsParsing(false);
    }
  };

  const handleMergeToPortfolio = async () => {
    setIsMerging(true);
    try {
      const res = await api.parseUnstructured(rawText, true);
      if (res.success) {
        alert('Parsed data successfully merged into your portfolio database!');
        onRefresh();
        onClose();
      }
    } catch (err) {
      alert('Merge error: ' + err.message);
    } finally {
      setIsMerging(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '750px' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={18} color="#ec4899" />
              AI Unstructured Resume & Bio Importer
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Powered by Google Gemini API to parse free-form text directly into MongoDB schema fields.
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Input box */}
        <div className="form-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <label className="form-label" style={{ margin: 0 }}>Paste Raw Text, Bio or Resume Snippet</label>
            <button 
              type="button" 
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.75rem', padding: '2px 8px' }}
              onClick={() => setRawText(sampleBio)}
            >
              Load Sample Bio
            </button>
          </div>

          <textarea
            className="form-textarea"
            style={{ minHeight: '140px', fontSize: '0.82rem' }}
            placeholder="Paste raw text here..."
            value={rawText}
            onChange={e => setRawText(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <button 
            className="btn btn-primary"
            onClick={handleParse}
            disabled={isParsing || !rawText.trim()}
          >
            <Sparkles size={15} />
            {isParsing ? 'Gemini Parsing...' : 'Parse Unstructured Fields with Gemini'}
          </button>
        </div>

        {/* Parsed Result Preview */}
        {parsedResult && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            marginBottom: '18px',
            maxHeight: '220px',
            overflowY: 'auto'
          }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#34d399', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} />
              Extracted Structured Fields Preview:
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              <div><strong>Name:</strong> {parsedResult.personalInfo?.fullName}</div>
              <div><strong>Email:</strong> {parsedResult.personalInfo?.email}</div>
              <div><strong>Skills Found:</strong> {(parsedResult.skills || []).map(s => s.name).join(', ')}</div>
              <div><strong>Experiences Found:</strong> {(parsedResult.experience || []).length} role(s)</div>
              <div><strong>Education Found:</strong> {(parsedResult.education || []).length} record(s)</div>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button 
            className="btn btn-accent"
            onClick={handleMergeToPortfolio}
            disabled={isMerging || !parsedResult}
          >
            <UploadCloud size={16} />
            {isMerging ? 'Merging...' : 'Merge Extracted Data to Portfolio'}
          </button>
        </div>
      </div>
    </div>
  );
}
