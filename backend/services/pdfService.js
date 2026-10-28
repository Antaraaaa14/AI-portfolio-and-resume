const PDFDocument = require('pdfkit');

class PDFService {
  /**
   * Generates an ATS-compliant, high-density professional PDF resume
   */
  generateResumePDF(resumeData, res) {
    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 36, bottom: 36, left: 40, right: 40 },
      bufferPages: true
    });

    // Pipe directly to response stream
    doc.pipe(res);

    const primaryColor = '#0F172A'; // Slate 900
    const accentColor = '#2563EB';  // Blue 600
    const textColor = '#334155';    // Slate 700
    const lightText = '#64748B';    // Slate 500

    const info = resumeData.personalInfo || {};

    // --- HEADER ---
    doc.font('Helvetica-Bold').fontSize(20).fillColor(primaryColor)
       .text(info.fullName || 'Candidate Resume', { align: 'center' });

    if (info.tagline) {
      doc.font('Helvetica').fontSize(10).fillColor(accentColor)
         .text(info.tagline, { align: 'center' });
    }

    doc.moveDown(0.2);

    // Contact info line
    const contactParts = [];
    if (info.email) contactParts.push(info.email);
    if (info.phone) contactParts.push(info.phone);
    if (info.location) contactParts.push(info.location);
    if (info.linkedin) contactParts.push('LinkedIn: ' + info.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, ''));
    if (info.github) contactParts.push('GitHub: ' + info.github.replace(/^https?:\/\/(www\.)?github\.com\//, ''));
    if (info.portfolioUrl) contactParts.push(info.portfolioUrl.replace(/^https?:\/\//, ''));

    doc.font('Helvetica').fontSize(8.5).fillColor(lightText)
       .text(contactParts.join('  •  '), { align: 'center' });

    doc.moveDown(0.6);
    this.drawSectionDivider(doc, '#CBD5E1');

    // --- PROFESSIONAL SUMMARY ---
    if (resumeData.summary) {
      this.drawSectionHeader(doc, 'PROFESSIONAL SUMMARY', accentColor);
      doc.font('Helvetica').fontSize(9).fillColor(textColor).lineGap(2)
         .text(resumeData.summary, { align: 'justify' });
      doc.moveDown(0.6);
    }

    // --- TECHNICAL SKILLS ---
    if (resumeData.skills && resumeData.skills.length > 0) {
      this.drawSectionHeader(doc, 'TECHNICAL & PROFESSIONAL SKILLS', accentColor);

      // Group skills by category if available
      const skillsByCategory = {};
      resumeData.skills.forEach(s => {
        const cat = s.category || 'Core Technologies';
        if (!skillsByCategory[cat]) skillsByCategory[cat] = [];
        skillsByCategory[cat].push(s.name);
      });

      doc.font('Helvetica').fontSize(8.5).fillColor(textColor).lineGap(1.5);
      for (const [category, skillList] of Object.entries(skillsByCategory)) {
        doc.font('Helvetica-Bold').text(category + ': ', { continued: true })
           .font('Helvetica').text(skillList.join(', '));
      }
      doc.moveDown(0.6);
    }

    // --- WORK EXPERIENCE ---
    if (resumeData.experience && resumeData.experience.length > 0) {
      this.drawSectionHeader(doc, 'PROFESSIONAL EXPERIENCE', accentColor);

      resumeData.experience.forEach(exp => {
        const dateRange = `${exp.startDate || ''} – ${exp.isCurrent ? 'Present' : (exp.endDate || '')}`;
        
        // Role & Dates
        doc.font('Helvetica-Bold').fontSize(10).fillColor(primaryColor)
           .text(exp.role || '', { continued: true })
           .font('Helvetica-Bold').fontSize(9).fillColor(lightText)
           .text(dateRange, { align: 'right' });

        // Company & Location
        doc.font('Helvetica-Bold').fontSize(9).fillColor(accentColor)
           .text(exp.company || '', { continued: true })
           .font('Helvetica').fontSize(8.5).fillColor(lightText)
           .text(exp.location ? ` | ${exp.location}` : '', { align: 'left' });

        // Technologies badge line
        if (exp.technologies && exp.technologies.length > 0) {
          doc.font('Helvetica-Oblique').fontSize(8).fillColor(lightText)
             .text('Tech: ' + exp.technologies.join(', '));
        }

        doc.moveDown(0.2);

        // Bullet Points
        if (exp.bulletPoints && exp.bulletPoints.length > 0) {
          doc.font('Helvetica').fontSize(8.5).fillColor(textColor).lineGap(1.5);
          exp.bulletPoints.forEach(bp => {
            doc.text(`•  ${bp}`, { indent: 10, align: 'justify' });
          });
        }
        doc.moveDown(0.5);
      });
    }

    // --- FEATURED PROJECTS ---
    if (resumeData.projects && resumeData.projects.length > 0) {
      this.drawSectionHeader(doc, 'FEATURED PROJECTS & SYSTEMS', accentColor);

      resumeData.projects.forEach(proj => {
        doc.font('Helvetica-Bold').fontSize(9.5).fillColor(primaryColor)
           .text(proj.title || '', { continued: true });
        
        if (proj.role) {
          doc.font('Helvetica').fontSize(8.5).fillColor(lightText)
             .text(` | ${proj.role}`, { continued: true });
        }

        if (proj.liveUrl || proj.githubUrl) {
          doc.font('Helvetica').fontSize(8).fillColor(accentColor)
             .text(` (${proj.liveUrl || proj.githubUrl})`, { align: 'right' });
        } else {
          doc.text('');
        }

        if (proj.technologies && proj.technologies.length > 0) {
          doc.font('Helvetica-Oblique').fontSize(8).fillColor(lightText)
             .text('Stack: ' + proj.technologies.join(', '));
        }

        if (proj.metrics) {
          doc.font('Helvetica-Bold').fontSize(8.5).fillColor(textColor)
             .text(`Key Impact: ${proj.metrics}`);
        }

        if (proj.bulletPoints && proj.bulletPoints.length > 0) {
          doc.font('Helvetica').fontSize(8.5).fillColor(textColor).lineGap(1.5);
          proj.bulletPoints.forEach(bp => {
            doc.text(`•  ${bp}`, { indent: 10, align: 'justify' });
          });
        }
        doc.moveDown(0.5);
      });
    }

    // --- EDUCATION ---
    if (resumeData.education && resumeData.education.length > 0) {
      this.drawSectionHeader(doc, 'EDUCATION', accentColor);

      resumeData.education.forEach(ed => {
        const dates = `${ed.startDate || ''} – ${ed.endDate || ''}`;
        doc.font('Helvetica-Bold').fontSize(9.5).fillColor(primaryColor)
           .text(`${ed.degree} in ${ed.field}`, { continued: true })
           .font('Helvetica').fontSize(8.5).fillColor(lightText)
           .text(dates, { align: 'right' });

        doc.font('Helvetica').fontSize(8.5).fillColor(textColor)
           .text(`${ed.institution}${ed.grade ? ` | GPA/Grade: ${ed.grade}` : ''}`);

        if (ed.coursework && ed.coursework.length > 0) {
          doc.font('Helvetica').fontSize(8).fillColor(lightText)
             .text(`Coursework: ${ed.coursework.join(', ')}`);
        }
        doc.moveDown(0.4);
      });
    }

    // --- CERTIFICATIONS ---
    if (resumeData.certifications && resumeData.certifications.length > 0) {
      this.drawSectionHeader(doc, 'CERTIFICATIONS & CREDENTIALS', accentColor);
      resumeData.certifications.forEach(c => {
        doc.font('Helvetica-Bold').fontSize(8.5).fillColor(textColor)
           .text(`•  ${c.name} `, { continued: true })
           .font('Helvetica').fillColor(lightText)
           .text(`— ${c.issuer} (${c.issueDate || 'Verified'}${c.credentialId ? `, ID: ${c.credentialId}` : ''})`);
      });
      doc.moveDown(0.4);
    }

    // --- PUBLICATIONS & ACHIEVEMENTS ---
    if ((resumeData.publications && resumeData.publications.length > 0) || (resumeData.achievements && resumeData.achievements.length > 0)) {
      this.drawSectionHeader(doc, 'PUBLICATIONS & HONORS', accentColor);

      if (resumeData.publications) {
        resumeData.publications.forEach(pub => {
          doc.font('Helvetica-Bold').fontSize(8.5).fillColor(textColor)
             .text(`•  "${pub.title}" `, { continued: true })
             .font('Helvetica').fillColor(lightText)
             .text(`— ${pub.publisher || 'Conference'} (${pub.date || ''})`);
        });
      }

      if (resumeData.achievements) {
        resumeData.achievements.forEach(ach => {
          doc.font('Helvetica-Bold').fontSize(8.5).fillColor(textColor)
             .text(`•  ${ach.title}: `, { continued: true })
             .font('Helvetica').fillColor(lightText)
             .text(ach.description);
        });
      }
      doc.moveDown(0.4);
    }

    doc.end();
  }

  drawSectionHeader(doc, title, color) {
    doc.moveDown(0.3);
    doc.font('Helvetica-Bold').fontSize(10.5).fillColor(color)
       .text(title, { characterSpacing: 1 });
    doc.moveDown(0.15);
    this.drawSectionDivider(doc, '#E2E8F0');
    doc.moveDown(0.3);
  }

  drawSectionDivider(doc, color) {
    const x = doc.page.margins.left;
    const y = doc.y;
    const width = doc.page.width - doc.page.margins.left - doc.page.margins.right;
    doc.strokeColor(color).lineWidth(0.75).moveTo(x, y).lineTo(x + width, y).stroke();
  }
}

module.exports = new PDFService();
