import React from 'react';
import { ShieldCheck, Mail, Phone, MapPin, Globe, ExternalLink } from 'lucide-react';

export default function ResumePreview({ resumeData, template = 'modern-tech', verification }) {
  if (!resumeData) return null;

  const info = resumeData.personalInfo || {};
  const isExecutive = template === 'classic-executive';
  const isMinimalist = template === 'minimalist-ats';

  const fontFam = isExecutive ? '"Georgia", "Times New Roman", serif' : 'var(--font-body)';

  return (
    <div 
      className="resume-paper"
      style={{
        background: '#FFFFFF',
        color: '#1E293B',
        padding: '36px 40px',
        borderRadius: '12px',
        boxShadow: '0 15px 40px -10px rgba(0, 0, 0, 0.4)',
        minHeight: '842px',
        fontFamily: fontFam,
        fontSize: '9pt',
        lineHeight: 1.5,
        position: 'relative'
      }}
    >
      {/* Anti-Hallucination Grounded Watermark / Stamp */}
      {verification && verification.verified && (
        <div style={{
          position: 'absolute',
          top: '16px',
          right: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          padding: '4px 10px',
          borderRadius: '9999px',
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          color: '#059669',
          fontSize: '7.5pt',
          fontWeight: 700
        }}>
          <ShieldCheck size={12} color="#059669" />
          100% Verified Grounded
        </div>
      )}

      {/* HEADER SECTION */}
      <div style={{
        textAlign: isMinimalist ? 'left' : 'center',
        borderBottom: isExecutive ? '2px solid #0F172A' : '1px solid #E2E8F0',
        paddingBottom: '14px',
        marginBottom: '16px'
      }}>
        <h1 style={{
          fontSize: isExecutive ? '20pt' : '22pt',
          fontWeight: 800,
          color: '#0F172A',
          letterSpacing: '-0.02em',
          marginBottom: '2px',
          fontFamily: fontFam
        }}>
          {info.fullName || 'Candidate Name'}
        </h1>

        {info.tagline && (
          <div style={{
            fontSize: '9.5pt',
            fontWeight: 600,
            color: isExecutive ? '#334155' : '#2563EB',
            marginBottom: '8px'
          }}>
            {info.tagline}
          </div>
        )}

        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: isMinimalist ? 'flex-start' : 'center',
          gap: '12px',
          fontSize: '8pt',
          color: '#475569'
        }}>
          {info.email && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
              <Mail size={10} /> {info.email}
            </span>
          )}
          {info.phone && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
              <Phone size={10} /> {info.phone}
            </span>
          )}
          {info.location && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
              <MapPin size={10} /> {info.location}
            </span>
          )}
          {info.linkedin && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
              <ExternalLink size={10} /> {info.linkedin.replace(/^https?:\/\/(www\.)?/, '')}
            </span>
          )}
          {info.github && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
              <ExternalLink size={10} /> {info.github.replace(/^https?:\/\/(www\.)?/, '')}
            </span>
          )}
          {info.portfolioUrl && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
              <Globe size={10} /> {info.portfolioUrl.replace(/^https?:\/\/(www\.)?/, '')}
            </span>
          )}
        </div>
      </div>

      {/* PROFESSIONAL SUMMARY */}
      {resumeData.summary && (
        <div style={{ marginBottom: '12px' }}>
          <div style={{
            fontSize: '9.5pt',
            fontWeight: 700,
            color: isExecutive ? '#0F172A' : '#1E293B',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            borderBottom: isExecutive ? '1px solid #334155' : '1px solid #CBD5E1',
            paddingBottom: '3px',
            marginBottom: '6px'
          }}>
            Professional Summary
          </div>
          <p style={{ textAlign: 'justify', color: '#334155', fontSize: '8.5pt', lineHeight: 1.55 }}>
            {resumeData.summary}
          </p>
        </div>
      )}

      {/* TECHNICAL SKILLS */}
      {resumeData.skills && resumeData.skills.length > 0 && (
        <div style={{ marginBottom: '12px' }}>
          <div style={{
            fontSize: '9.5pt',
            fontWeight: 700,
            color: isExecutive ? '#0F172A' : '#1E293B',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            borderBottom: isExecutive ? '1px solid #334155' : '1px solid #CBD5E1',
            paddingBottom: '3px',
            marginBottom: '6px',
            marginTop: '10px'
          }}>
            Core Technical & Domain Skills
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '8.5pt' }}>
            {(() => {
              const grouped = {};
              resumeData.skills.forEach(s => {
                const cat = s.category || 'Technologies';
                if (!grouped[cat]) grouped[cat] = [];
                grouped[cat].push(s.name);
              });
              return Object.entries(grouped).map(([cat, list]) => (
                <div key={cat} style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                  <span style={{ fontWeight: 700, minWidth: '130px', color: '#1E293B' }}>{cat}:</span>
                  <span style={{ color: '#334155' }}>{list.join('  •  ')}</span>
                </div>
              ));
            })()}
          </div>
        </div>
      )}

      {/* WORK EXPERIENCE */}
      {resumeData.experience && resumeData.experience.length > 0 && (
        <div style={{ marginBottom: '12px' }}>
          <div style={{
            fontSize: '9.5pt',
            fontWeight: 700,
            color: isExecutive ? '#0F172A' : '#1E293B',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            borderBottom: isExecutive ? '1px solid #334155' : '1px solid #CBD5E1',
            paddingBottom: '3px',
            marginBottom: '8px',
            marginTop: '12px'
          }}>
            Work Experience
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {resumeData.experience.map((exp, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <div>
                    <span style={{ fontWeight: 700, fontSize: '9.5pt', color: '#0F172A' }}>{exp.role}</span>
                    <span style={{ color: isExecutive ? '#475569' : '#2563EB', fontWeight: 600, fontSize: '9pt' }}> | {exp.company}</span>
                    {exp.location && <span style={{ color: '#64748B', fontSize: '8pt' }}> ({exp.location})</span>}
                  </div>
                  <span style={{ fontSize: '8pt', fontWeight: 600, color: '#475569' }}>
                    {exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate}
                  </span>
                </div>

                {exp.technologies && exp.technologies.length > 0 && (
                  <div style={{ fontSize: '7.8pt', color: '#64748B', fontStyle: 'italic', marginBottom: '3px' }}>
                    Tech Stack: {exp.technologies.join(', ')}
                  </div>
                )}

                {exp.bulletPoints && exp.bulletPoints.length > 0 && (
                  <ul style={{ paddingLeft: '16px', margin: '3px 0 0', fontSize: '8.2pt', color: '#334155' }}>
                    {exp.bulletPoints.map((bp, bIdx) => (
                      <li key={bIdx} style={{ marginBottom: '2px', textAlign: 'justify' }}>{bp}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FEATURED PROJECTS */}
      {resumeData.projects && resumeData.projects.length > 0 && (
        <div style={{ marginBottom: '12px' }}>
          <div style={{
            fontSize: '9.5pt',
            fontWeight: 700,
            color: isExecutive ? '#0F172A' : '#1E293B',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            borderBottom: isExecutive ? '1px solid #334155' : '1px solid #CBD5E1',
            paddingBottom: '3px',
            marginBottom: '8px',
            marginTop: '12px'
          }}>
            Selected Technical Projects & Systems
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
            {resumeData.projects.map((proj, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <div>
                    <span style={{ fontWeight: 700, fontSize: '9pt', color: '#0F172A' }}>{proj.title}</span>
                    {proj.role && <span style={{ color: '#475569', fontSize: '8pt' }}> — {proj.role}</span>}
                  </div>
                  {proj.metrics && (
                    <span style={{ fontSize: '8pt', color: '#059669', fontWeight: 700 }}>
                      ⚡ {proj.metrics}
                    </span>
                  )}
                </div>

                {proj.technologies && proj.technologies.length > 0 && (
                  <div style={{ fontSize: '7.8pt', color: '#64748B', fontStyle: 'italic', marginBottom: '2px' }}>
                    Technologies: {proj.technologies.join(', ')}
                  </div>
                )}

                {proj.bulletPoints && proj.bulletPoints.length > 0 && (
                  <ul style={{ paddingLeft: '16px', margin: '2px 0 0', fontSize: '8.2pt', color: '#334155' }}>
                    {proj.bulletPoints.map((bp, bIdx) => (
                      <li key={bIdx} style={{ marginBottom: '2px' }}>{bp}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* EDUCATION */}
      {resumeData.education && resumeData.education.length > 0 && (
        <div style={{ marginBottom: '10px' }}>
          <div style={{
            fontSize: '9.5pt',
            fontWeight: 700,
            color: isExecutive ? '#0F172A' : '#1E293B',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            borderBottom: isExecutive ? '1px solid #334155' : '1px solid #CBD5E1',
            paddingBottom: '3px',
            marginBottom: '6px',
            marginTop: '10px'
          }}>
            Education
          </div>

          {resumeData.education.map((ed, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontSize: '8.5pt' }}>
              <div>
                <span style={{ fontWeight: 700 }}>{ed.degree} in {ed.field}</span>
                <span style={{ color: '#475569' }}> — {ed.institution}</span>
                {ed.grade && <span style={{ color: '#059669', fontWeight: 600 }}> (GPA: {ed.grade})</span>}
              </div>
              <span style={{ color: '#64748B', fontSize: '8pt' }}>{ed.startDate} – {ed.endDate}</span>
            </div>
          ))}
        </div>
      )}

      {/* CERTIFICATIONS */}
      {resumeData.certifications && resumeData.certifications.length > 0 && (
        <div style={{ marginBottom: '10px' }}>
          <div style={{
            fontSize: '9.5pt',
            fontWeight: 700,
            color: isExecutive ? '#0F172A' : '#1E293B',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            borderBottom: isExecutive ? '1px solid #334155' : '1px solid #CBD5E1',
            paddingBottom: '3px',
            marginBottom: '6px',
            marginTop: '10px'
          }}>
            Certifications & Credentials
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 16px', fontSize: '8.2pt' }}>
            {resumeData.certifications.map((c, idx) => (
              <div key={idx}>
                <strong>{c.name}</strong> <span style={{ color: '#64748B' }}>({c.issuer}, {c.issueDate || 'Verified'})</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
