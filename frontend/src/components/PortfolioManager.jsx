import React, { useState } from 'react';
import { 
  User, 
  FileText, 
  Code2, 
  Briefcase, 
  Layers, 
  Award, 
  GraduationCap, 
  Trophy, 
  BookOpen, 
  Globe2, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  UploadCloud, 
  CheckCircle2, 
  Sparkles,
  ExternalLink,
  X
} from 'lucide-react';
import { api } from '../api';

export default function PortfolioManager({ portfolio, onRefresh, onOpenImportModal }) {
  const [activeCategory, setActiveCategory] = useState('personal');
  const [personalForm, setPersonalForm] = useState(portfolio?.personalInfo || {});
  const [summaryForm, setSummaryForm] = useState(portfolio?.summary || '');
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState(null);

  // New Item Modals
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [newSkill, setNewSkill] = useState({ name: '', category: 'Frontend', proficiency: 'Advanced', yearsOfExperience: 2 });

  const [showExpModal, setShowExpModal] = useState(false);
  const [newExp, setNewExp] = useState({ company: '', role: '', location: '', startDate: '', endDate: '', isCurrent: false, bulletPoints: '', technologies: '' });

  const [showProjModal, setShowProjModal] = useState(false);
  const [newProj, setNewProj] = useState({ title: '', role: 'Lead Developer', category: 'Full Stack', summary: '', bulletPoints: '', technologies: '', metrics: '', githubUrl: '', liveUrl: '' });

  const [showCertModal, setShowCertModal] = useState(false);
  const [newCert, setNewCert] = useState({ name: '', issuer: '', issueDate: '', expiryDate: 'No Expiry', credentialId: '', credentialUrl: '' });

  const [showEduModal, setShowEduModal] = useState(false);
  const [newEdu, setNewEdu] = useState({ institution: '', degree: 'Bachelor of Science', field: '', startDate: '', endDate: '', grade: '', coursework: '' });

  const [showAchModal, setShowAchModal] = useState(false);
  const [newAch, setNewAch] = useState({ title: '', issuer: '', date: '', description: '' });

  const [showPubModal, setShowPubModal] = useState(false);
  const [newPub, setNewPub] = useState({ title: '', publisher: '', date: '', authors: '', link: '', summary: '' });

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Save Personal Info
  const handleSavePersonal = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await api.updatePersonalInfo(personalForm);
      showToast('Personal information updated successfully!');
      onRefresh();
    } catch (err) {
      alert('Error updating personal info: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Save Summary
  const handleSaveSummary = async () => {
    setIsSaving(true);
    try {
      await api.updateSummary(summaryForm);
      showToast('Career summary updated successfully!');
      onRefresh();
    } catch (err) {
      alert('Error updating summary: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Add Skill
  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!newSkill.name.trim()) return;
    try {
      await api.addSkill(newSkill);
      setShowSkillModal(false);
      setNewSkill({ name: '', category: 'Frontend', proficiency: 'Advanced', yearsOfExperience: 2 });
      showToast('Skill added successfully!');
      onRefresh();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteSkill = async (id) => {
    if (!window.confirm('Delete this skill?')) return;
    try {
      await api.deleteSkill(id);
      showToast('Skill removed');
      onRefresh();
    } catch (err) {
      alert(err.message);
    }
  };

  // Add Experience
  const handleAddExp = async (e) => {
    e.preventDefault();
    try {
      const bullets = newExp.bulletPoints.split('\n').map(b => b.trim()).filter(Boolean);
      const techs = newExp.technologies.split(',').map(t => t.trim()).filter(Boolean);
      await api.addExperience({ ...newExp, bulletPoints: bullets, technologies: techs });
      setShowExpModal(false);
      setNewExp({ company: '', role: '', location: '', startDate: '', endDate: '', isCurrent: false, bulletPoints: '', technologies: '' });
      showToast('Experience added successfully!');
      onRefresh();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteExp = async (id) => {
    if (!window.confirm('Delete this experience entry?')) return;
    try {
      await api.deleteExperience(id);
      showToast('Experience entry removed');
      onRefresh();
    } catch (err) {
      alert(err.message);
    }
  };

  // Add Project
  const handleAddProj = async (e) => {
    e.preventDefault();
    try {
      const bullets = newProj.bulletPoints.split('\n').map(b => b.trim()).filter(Boolean);
      const techs = newProj.technologies.split(',').map(t => t.trim()).filter(Boolean);
      await api.addProject({ ...newProj, bulletPoints: bullets, technologies: techs });
      setShowProjModal(false);
      setNewProj({ title: '', role: 'Lead Developer', category: 'Full Stack', summary: '', bulletPoints: '', technologies: '', metrics: '', githubUrl: '', liveUrl: '' });
      showToast('Project created successfully!');
      onRefresh();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteProj = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    try {
      await api.deleteProject(id);
      showToast('Project removed');
      onRefresh();
    } catch (err) {
      alert(err.message);
    }
  };

  // Add Cert
  const handleAddCert = async (e) => {
    e.preventDefault();
    try {
      await api.addCertification(newCert);
      setShowCertModal(false);
      setNewCert({ name: '', issuer: '', issueDate: '', expiryDate: 'No Expiry', credentialId: '', credentialUrl: '' });
      showToast('Certification added!');
      onRefresh();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteCert = async (id) => {
    if (!window.confirm('Delete this certification?')) return;
    try {
      await api.deleteCertification(id);
      showToast('Certification deleted');
      onRefresh();
    } catch (err) {
      alert(err.message);
    }
  };

  // Add Education
  const handleAddEdu = async (e) => {
    e.preventDefault();
    try {
      const courses = newEdu.coursework.split(',').map(c => c.trim()).filter(Boolean);
      await api.addEducation({ ...newEdu, coursework: courses });
      setShowEduModal(false);
      setNewEdu({ institution: '', degree: 'Bachelor of Science', field: '', startDate: '', endDate: '', grade: '', coursework: '' });
      showToast('Education added!');
      onRefresh();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteEdu = async (id) => {
    if (!window.confirm('Delete education?')) return;
    try {
      await api.deleteEducation(id);
      showToast('Education removed');
      onRefresh();
    } catch (err) {
      alert(err.message);
    }
  };

  const categories = [
    { id: 'personal', label: 'Personal & Contact', icon: User, count: null },
    { id: 'summary', label: 'Career Summary', icon: FileText, count: null },
    { id: 'skills', label: 'Skills & Tech', icon: Code2, count: portfolio?.skills?.length },
    { id: 'experience', label: 'Work Experience', icon: Briefcase, count: portfolio?.experience?.length },
    { id: 'projects', label: 'Projects & Systems', icon: Layers, count: portfolio?.projects?.length },
    { id: 'certifications', label: 'Certifications', icon: Award, count: portfolio?.certifications?.length },
    { id: 'education', label: 'Education', icon: GraduationCap, count: portfolio?.education?.length },
    { id: 'achievements', label: 'Achievements', icon: Trophy, count: portfolio?.achievements?.length },
    { id: 'publications', label: 'Publications', icon: BookOpen, count: portfolio?.publications?.length },
    { id: 'languages', label: 'Languages', icon: Globe2, count: portfolio?.languages?.length },
  ];

  return (
    <div style={{ marginTop: '24px' }}>
      {/* Toast Notification */}
      {notification && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: 'rgba(16, 185, 129, 0.95)',
          color: '#FFFFFF',
          padding: '12px 20px',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-card)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          zIndex: 1000,
          fontWeight: 600,
          fontSize: '0.9rem'
        }}>
          <CheckCircle2 size={18} />
          {notification}
        </div>
      )}

      {/* Header with Title and AI Importer Button */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '20px'
      }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', marginBottom: '4px' }}>Portfolio Database Manager</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Central repository of all verified professional qualifications, projects, and career history.
          </p>
        </div>

        <button 
          className="btn btn-primary"
          onClick={onOpenImportModal}
        >
          <Sparkles size={16} />
          AI Bio / Unstructured Text Importer
        </button>
      </div>

      {/* Main Grid: Left Category Sidebar, Right Content */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '260px 1fr',
        gap: '24px',
        alignItems: 'start'
      }}>
        {/* Left Sidebar */}
        <div className="glass-card" style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  background: isActive ? 'rgba(99, 102, 241, 0.18)' : 'transparent',
                  border: isActive ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid transparent',
                  color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  transition: 'all 0.15s ease',
                  textAlign: 'left'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Icon size={17} color={isActive ? '#818cf8' : 'currentColor'} />
                  {cat.label}
                </div>
                {cat.count !== null && (
                  <span style={{
                    fontSize: '0.75rem',
                    padding: '2px 7px',
                    borderRadius: '9999px',
                    background: isActive ? 'rgba(99, 102, 241, 0.35)' : 'rgba(255, 255, 255, 0.06)',
                    color: isActive ? '#FFFFFF' : 'var(--text-muted)'
                  }}>
                    {cat.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right Content Area */}
        <div className="glass-card" style={{ padding: '28px' }}>
          {/* 1. PERSONAL INFO */}
          {activeCategory === 'personal' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.25rem' }}>Personal & Contact Information</h3>
                <button 
                  className="btn btn-primary btn-sm"
                  onClick={handleSavePersonal}
                  disabled={isSaving}
                >
                  <Save size={14} />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>

              <form onSubmit={handleSavePersonal}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input 
                      className="form-input" 
                      value={personalForm.fullName || ''} 
                      onChange={e => setPersonalForm({ ...personalForm, fullName: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input 
                      type="email"
                      className="form-input" 
                      value={personalForm.email || ''} 
                      onChange={e => setPersonalForm({ ...personalForm, email: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input 
                      className="form-input" 
                      value={personalForm.phone || ''} 
                      onChange={e => setPersonalForm({ ...personalForm, phone: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Location / City</label>
                    <input 
                      className="form-input" 
                      value={personalForm.location || ''} 
                      onChange={e => setPersonalForm({ ...personalForm, location: e.target.value })}
                    />
                  </div>

                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">Professional Tagline / Headline</label>
                    <input 
                      className="form-input" 
                      value={personalForm.tagline || ''} 
                      onChange={e => setPersonalForm({ ...personalForm, tagline: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">LinkedIn Profile URL</label>
                    <input 
                      className="form-input" 
                      value={personalForm.linkedin || ''} 
                      onChange={e => setPersonalForm({ ...personalForm, linkedin: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">GitHub Profile URL</label>
                    <input 
                      className="form-input" 
                      value={personalForm.github || ''} 
                      onChange={e => setPersonalForm({ ...personalForm, github: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Portfolio Website URL</label>
                    <input 
                      className="form-input" 
                      value={personalForm.portfolioUrl || ''} 
                      onChange={e => setPersonalForm({ ...personalForm, portfolioUrl: e.target.value })}
                    />
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* 2. CAREER SUMMARY */}
          {activeCategory === 'summary' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.25rem' }}>Master Professional Summary</h3>
                <button 
                  className="btn btn-primary btn-sm"
                  onClick={handleSaveSummary}
                  disabled={isSaving}
                >
                  <Save size={14} />
                  {isSaving ? 'Saving...' : 'Save Summary'}
                </button>
              </div>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                This is your primary career narrative stored in MongoDB. When creating job-specific resumes, Gemini will use this as a source to tailor an ATS-optimized summary matching the JD.
              </p>

              <textarea 
                className="form-textarea" 
                style={{ minHeight: '160px', lineHeight: 1.6 }}
                value={summaryForm}
                onChange={e => setSummaryForm(e.target.value)}
              />
            </div>
          )}

          {/* 3. SKILLS */}
          {activeCategory === 'skills' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem' }}>Technical & Professional Skills</h3>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Total: {portfolio?.skills?.length || 0} skills categorized and proficiency-rated
                  </div>
                </div>
                <button 
                  className="btn btn-primary btn-sm"
                  onClick={() => setShowSkillModal(true)}
                >
                  <Plus size={15} />
                  Add Skill
                </button>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                gap: '12px'
              }}>
                {(portfolio?.skills || []).map((skill) => (
                  <div 
                    key={skill._id}
                    className="glass-panel"
                    style={{
                      padding: '12px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      border: skill.highlight ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid var(--border-subtle)'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                        {skill.name}
                      </div>
                      <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                        <span className="badge badge-indigo" style={{ fontSize: '0.68rem' }}>{skill.category}</span>
                        <span className="badge badge-emerald" style={{ fontSize: '0.68rem' }}>{skill.proficiency}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDeleteSkill(skill._id)}
                      style={{ background: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer', padding: '4px' }}
                      title="Delete skill"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. EXPERIENCE */}
          {activeCategory === 'experience' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.25rem' }}>Work Experience & Internships</h3>
                <button 
                  className="btn btn-primary btn-sm"
                  onClick={() => setShowExpModal(true)}
                >
                  <Plus size={15} />
                  Add Experience
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {(portfolio?.experience || []).map((exp) => (
                  <div key={exp._id} className="glass-panel" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                      <div>
                        <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {exp.role}
                        </div>
                        <div style={{ color: '#818cf8', fontWeight: 600, fontSize: '0.9rem' }}>
                          {exp.company} {exp.location ? `• ${exp.location}` : ''}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                          {exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate} ({exp.type || 'Full-time'})
                        </div>
                      </div>
                      <button 
                        onClick={() => handleDeleteExp(exp._id)}
                        className="btn btn-danger btn-sm"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>

                    {exp.technologies && exp.technologies.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', margin: '12px 0 10px' }}>
                        {exp.technologies.map((t, idx) => (
                          <span key={idx} className="badge badge-indigo" style={{ fontSize: '0.72rem' }}>{t}</span>
                        ))}
                      </div>
                    )}

                    <ul style={{ paddingLeft: '18px', fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginTop: '8px' }}>
                      {(exp.bulletPoints || []).map((bp, idx) => (
                        <li key={idx} style={{ marginBottom: '4px' }}>{bp}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. PROJECTS */}
          {activeCategory === 'projects' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.25rem' }}>Projects & Systems Showcase</h3>
                <button 
                  className="btn btn-primary btn-sm"
                  onClick={() => setShowProjModal(true)}
                >
                  <Plus size={15} />
                  Add Project
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
                {(portfolio?.projects || []).map((p) => (
                  <div key={p._id} className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)' }}>{p.title}</div>
                          <div style={{ fontSize: '0.82rem', color: '#818cf8', fontWeight: 600 }}>{p.role} • {p.category}</div>
                        </div>
                        <button 
                          onClick={() => handleDeleteProj(p._id)}
                          style={{ background: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer', padding: '4px' }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '10px 0', lineHeight: 1.5 }}>
                        {p.summary}
                      </p>

                      {p.metrics && (
                        <div style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: 600, marginBottom: '10px' }}>
                          ⚡ {p.metrics}
                        </div>
                      )}

                      {p.technologies && p.technologies.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '12px' }}>
                          {p.technologies.map((t, idx) => (
                            <span key={idx} className="badge badge-indigo" style={{ fontSize: '0.7rem' }}>{t}</span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)', fontSize: '0.78rem' }}>
                      {p.githubUrl && (
                        <a href={p.githubUrl} target="_blank" rel="noreferrer" style={{ color: '#38bdf8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <ExternalLink size={12} /> GitHub
                        </a>
                      )}
                      {p.liveUrl && (
                        <a href={p.liveUrl} target="_blank" rel="noreferrer" style={{ color: '#34d399', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <ExternalLink size={12} /> Live Demo
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. CERTIFICATIONS */}
          {activeCategory === 'certifications' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.25rem' }}>Certifications & Credentials</h3>
                <button 
                  className="btn btn-primary btn-sm"
                  onClick={() => setShowCertModal(true)}
                >
                  <Plus size={15} />
                  Add Certification
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
                {(portfolio?.certifications || []).map((c) => (
                  <div key={c._id} className="glass-panel" style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{c.name}</div>
                      <button onClick={() => handleDeleteCert(c._id)} style={{ background: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer' }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#818cf8', fontWeight: 600, marginTop: '2px' }}>{c.issuer}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      Issued: {c.issueDate} • Expires: {c.expiryDate}
                    </div>
                    {c.credentialId && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                        ID: {c.credentialId}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. EDUCATION */}
          {activeCategory === 'education' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.25rem' }}>Education Qualifications</h3>
                <button 
                  className="btn btn-primary btn-sm"
                  onClick={() => setShowEduModal(true)}
                >
                  <Plus size={15} />
                  Add Education
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {(portfolio?.education || []).map((ed) => (
                  <div key={ed._id} className="glass-panel" style={{ padding: '18px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>{ed.degree} in {ed.field}</div>
                        <div style={{ color: '#818cf8', fontWeight: 600, fontSize: '0.9rem' }}>{ed.institution} {ed.location ? `• ${ed.location}` : ''}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                          {ed.startDate} – {ed.endDate} {ed.grade ? `• Grade: ${ed.grade}` : ''}
                        </div>
                      </div>
                      <button onClick={() => handleDeleteEdu(ed._id)} className="btn btn-danger btn-sm">
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>

                    {ed.coursework && ed.coursework.length > 0 && (
                      <div style={{ marginTop: '10px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                        <strong>Coursework:</strong> {ed.coursework.join(', ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 8. ACHIEVEMENTS */}
          {activeCategory === 'achievements' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.25rem' }}>Achievements & Awards</h3>
                <button className="btn btn-primary btn-sm" onClick={() => setShowAchModal(true)}>
                  <Plus size={15} /> Add Achievement
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {(portfolio?.achievements || []).map((a) => (
                  <div key={a._id} className="glass-panel" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.98rem' }}>🏆 {a.title}</div>
                      <div style={{ fontSize: '0.82rem', color: '#818cf8' }}>{a.issuer} • {a.date}</div>
                      <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginTop: '6px' }}>{a.description}</p>
                    </div>
                    <button onClick={async () => { await api.deleteAchievement(a._id); onRefresh(); }} style={{ background: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer' }}>
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 9. PUBLICATIONS */}
          {activeCategory === 'publications' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.25rem' }}>Research Papers & Publications</h3>
                <button className="btn btn-primary btn-sm" onClick={() => setShowPubModal(true)}>
                  <Plus size={15} /> Add Publication
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {(portfolio?.publications || []).map((pub) => (
                  <div key={pub._id} className="glass-panel" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.98rem' }}>📄 {pub.title}</div>
                      <div style={{ fontSize: '0.82rem', color: '#818cf8' }}>{pub.publisher} • {pub.date}</div>
                      {pub.authors && pub.authors.length > 0 && (
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                          Authors: {pub.authors.join(', ')}
                        </div>
                      )}
                      <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginTop: '6px' }}>{pub.summary}</p>
                    </div>
                    <button onClick={async () => { await api.deletePublication(pub._id); onRefresh(); }} style={{ background: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer' }}>
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 10. LANGUAGES */}
          {activeCategory === 'languages' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.25rem' }}>Languages & Competencies</h3>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                {(portfolio?.languages || []).map((l, idx) => (
                  <div key={idx} className="glass-panel" style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>{l.language}</div>
                      <span className="badge badge-indigo" style={{ fontSize: '0.72rem' }}>{l.proficiency}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* --- ADD SKILL MODAL --- */}
      {showSkillModal && (
        <div className="modal-overlay" onClick={() => setShowSkillModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '1.25rem' }}>Add New Skill</h3>
              <button onClick={() => setShowSkillModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddSkill}>
              <div className="form-group">
                <label className="form-label">Skill Name *</label>
                <input 
                  required 
                  className="form-input" 
                  placeholder="e.g. Next.js, Docker, PyTorch"
                  value={newSkill.name} 
                  onChange={e => setNewSkill({ ...newSkill, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select 
                  className="form-select"
                  value={newSkill.category}
                  onChange={e => setNewSkill({ ...newSkill, category: e.target.value })}
                >
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="Database">Database</option>
                  <option value="Cloud & DevOps">Cloud & DevOps</option>
                  <option value="AI & ML">AI & ML</option>
                  <option value="Languages">Languages</option>
                  <option value="Tools & Platforms">Tools & Platforms</option>
                  <option value="Soft Skills">Soft Skills</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Proficiency</label>
                <select 
                  className="form-select"
                  value={newSkill.proficiency}
                  onChange={e => setNewSkill({ ...newSkill, proficiency: e.target.value })}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowSkillModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Skill</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- ADD EXPERIENCE MODAL --- */}
      {showExpModal && (
        <div className="modal-overlay" onClick={() => setShowExpModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '1.25rem' }}>Add Work Experience</h3>
              <button onClick={() => setShowExpModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddExp}>
              <div className="form-group">
                <label className="form-label">Company Name *</label>
                <input required className="form-input" value={newExp.company} onChange={e => setNewExp({ ...newExp, company: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Role Title *</label>
                <input required className="form-input" value={newExp.role} onChange={e => setNewExp({ ...newExp, role: e.target.value })} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Start Date *</label>
                  <input required className="form-input" placeholder="e.g. 2022-01" value={newExp.startDate} onChange={e => setNewExp({ ...newExp, startDate: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">End Date (or Present)</label>
                  <input className="form-input" placeholder="e.g. Present" value={newExp.endDate} onChange={e => setNewExp({ ...newExp, endDate: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Technologies Used (comma separated)</label>
                <input className="form-input" placeholder="React, Node.js, AWS, MongoDB" value={newExp.technologies} onChange={e => setNewExp({ ...newExp, technologies: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Bullet Points & Impact Achievements (one per line)</label>
                <textarea className="form-textarea" placeholder="• Architected microservices boosting throughput by 40%&#10;• Led squad of 6 engineers..." value={newExp.bulletPoints} onChange={e => setNewExp({ ...newExp, bulletPoints: e.target.value })} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowExpModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Experience</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- ADD PROJECT MODAL --- */}
      {showProjModal && (
        <div className="modal-overlay" onClick={() => setShowProjModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '1.25rem' }}>Add Project</h3>
              <button onClick={() => setShowProjModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddProj}>
              <div className="form-group">
                <label className="form-label">Project Title *</label>
                <input required className="form-input" value={newProj.title} onChange={e => setNewProj({ ...newProj, title: e.target.value })} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Role</label>
                  <input className="form-input" value={newProj.role} onChange={e => setNewProj({ ...newProj, role: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <input className="form-input" value={newProj.category} onChange={e => setNewProj({ ...newProj, category: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Summary Overview *</label>
                <input required className="form-input" value={newProj.summary} onChange={e => setNewProj({ ...newProj, summary: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Key Metric / Impact</label>
                <input className="form-input" placeholder="e.g. Processed 100K daily requests at sub-50ms" value={newProj.metrics} onChange={e => setNewProj({ ...newProj, metrics: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Technologies (comma separated)</label>
                <input className="form-input" placeholder="React, Node.js, Gemini API, Pinecone" value={newProj.technologies} onChange={e => setNewProj({ ...newProj, technologies: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Bullet Points (one per line)</label>
                <textarea className="form-textarea" value={newProj.bulletPoints} onChange={e => setNewProj({ ...newProj, bulletPoints: e.target.value })} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowProjModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Project</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- ADD CERT MODAL --- */}
      {showCertModal && (
        <div className="modal-overlay" onClick={() => setShowCertModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '1.25rem' }}>Add Certification</h3>
              <button onClick={() => setShowCertModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddCert}>
              <div className="form-group">
                <label className="form-label">Certification Name *</label>
                <input required className="form-input" value={newCert.name} onChange={e => setNewCert({ ...newCert, name: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Issuer *</label>
                <input required className="form-input" placeholder="e.g. AWS, Google Cloud, Meta" value={newCert.issuer} onChange={e => setNewCert({ ...newCert, issuer: e.target.value })} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Issue Date</label>
                  <input className="form-input" placeholder="2023-05" value={newCert.issueDate} onChange={e => setNewCert({ ...newCert, issueDate: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Credential ID</label>
                  <input className="form-input" value={newCert.credentialId} onChange={e => setNewCert({ ...newCert, credentialId: e.target.value })} />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowCertModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- ADD EDU MODAL --- */}
      {showEduModal && (
        <div className="modal-overlay" onClick={() => setShowEduModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '1.25rem' }}>Add Education</h3>
              <button onClick={() => setShowEduModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddEdu}>
              <div className="form-group">
                <label className="form-label">Institution Name *</label>
                <input required className="form-input" value={newEdu.institution} onChange={e => setNewEdu({ ...newEdu, institution: e.target.value })} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Degree *</label>
                  <input required className="form-input" value={newEdu.degree} onChange={e => setNewEdu({ ...newEdu, degree: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Field of Study *</label>
                  <input required className="form-input" value={newEdu.field} onChange={e => setNewEdu({ ...newEdu, field: e.target.value })} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Dates</label>
                  <input className="form-input" placeholder="2016 - 2020" value={newEdu.startDate} onChange={e => setNewEdu({ ...newEdu, startDate: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">GPA / Grade</label>
                  <input className="form-input" placeholder="3.8 / 4.0" value={newEdu.grade} onChange={e => setNewEdu({ ...newEdu, grade: e.target.value })} />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowEduModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
