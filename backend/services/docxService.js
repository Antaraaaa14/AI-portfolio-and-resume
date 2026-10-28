const { Document, Paragraph, TextRun, Packer, HeadingLevel, AlignmentType, UnderlineType } = require('docx');

class DocxService {
  /**
   * Generates a fully editable Microsoft Word (.docx) resume
   */
  async generateResumeDocx(resumeData) {
    const info = resumeData.personalInfo || {};
    const children = [];

    // Header Name
    children.push(new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: info.fullName || 'Candidate Resume',
          bold: true,
          size: 32, // 16pt
          font: 'Calibri'
        })
      ]
    }));

    if (info.tagline) {
      children.push(new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: info.tagline,
            italics: true,
            size: 20,
            font: 'Calibri',
            color: '2563EB'
          })
        ]
      }));
    }

    // Contact info
    const contactParts = [];
    if (info.email) contactParts.push(info.email);
    if (info.phone) contactParts.push(info.phone);
    if (info.location) contactParts.push(info.location);
    if (info.linkedin) contactParts.push('LinkedIn: ' + info.linkedin);
    if (info.github) contactParts.push('GitHub: ' + info.github);
    if (info.portfolioUrl) contactParts.push(info.portfolioUrl);

    children.push(new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: contactParts.join('  |  '),
          size: 18,
          font: 'Calibri',
          color: '64748B'
        })
      ]
    }));

    // Spacing
    children.push(new Paragraph({ text: '' }));

    // Helper for Section Heading
    const addSectionHeading = (title) => {
      children.push(new Paragraph({
        children: [
          new TextRun({
            text: title.toUpperCase(),
            bold: true,
            size: 22,
            font: 'Calibri',
            color: '0F172A'
          })
        ]
      }));
    };

    // Summary
    if (resumeData.summary) {
      addSectionHeading('Professional Summary');
      children.push(new Paragraph({
        children: [
          new TextRun({
            text: resumeData.summary,
            size: 20,
            font: 'Calibri'
          })
        ]
      }));
      children.push(new Paragraph({ text: '' }));
    }

    // Skills
    if (resumeData.skills && resumeData.skills.length > 0) {
      addSectionHeading('Technical Skills');
      const skillsByCategory = {};
      resumeData.skills.forEach(s => {
        const cat = s.category || 'Core Technologies';
        if (!skillsByCategory[cat]) skillsByCategory[cat] = [];
        skillsByCategory[cat].push(s.name);
      });

      for (const [cat, list] of Object.entries(skillsByCategory)) {
        children.push(new Paragraph({
          children: [
            new TextRun({ text: `${cat}: `, bold: true, size: 20, font: 'Calibri' }),
            new TextRun({ text: list.join(', '), size: 20, font: 'Calibri' })
          ]
        }));
      }
      children.push(new Paragraph({ text: '' }));
    }

    // Experience
    if (resumeData.experience && resumeData.experience.length > 0) {
      addSectionHeading('Work Experience');
      resumeData.experience.forEach(exp => {
        const dates = `${exp.startDate || ''} – ${exp.isCurrent ? 'Present' : (exp.endDate || '')}`;
        children.push(new Paragraph({
          children: [
            new TextRun({ text: `${exp.role} `, bold: true, size: 21, font: 'Calibri' }),
            new TextRun({ text: `| ${exp.company} (${exp.location || ''})`, size: 20, font: 'Calibri', color: '2563EB' }),
            new TextRun({ text: `\t${dates}`, bold: true, size: 19, font: 'Calibri', color: '64748B' })
          ]
        }));

        if (exp.technologies && exp.technologies.length > 0) {
          children.push(new Paragraph({
            children: [
              new TextRun({ text: 'Technologies: ', bold: true, size: 18, font: 'Calibri' }),
              new TextRun({ text: exp.technologies.join(', '), italics: true, size: 18, font: 'Calibri' })
            ]
          }));
        }

        if (exp.bulletPoints && exp.bulletPoints.length > 0) {
          exp.bulletPoints.forEach(bp => {
            children.push(new Paragraph({
              bullet: { level: 0 },
              children: [
                new TextRun({ text: bp, size: 20, font: 'Calibri' })
              ]
            }));
          });
        }
        children.push(new Paragraph({ text: '' }));
      });
    }

    // Projects
    if (resumeData.projects && resumeData.projects.length > 0) {
      addSectionHeading('Featured Projects');
      resumeData.projects.forEach(p => {
        children.push(new Paragraph({
          children: [
            new TextRun({ text: p.title, bold: true, size: 21, font: 'Calibri' }),
            p.role ? new TextRun({ text: ` — ${p.role}`, size: 20, font: 'Calibri' }) : new TextRun({ text: '' }),
            p.metrics ? new TextRun({ text: ` [${p.metrics}]`, bold: true, size: 19, color: '059669', font: 'Calibri' }) : new TextRun({ text: '' })
          ]
        }));

        if (p.technologies && p.technologies.length > 0) {
          children.push(new Paragraph({
            children: [
              new TextRun({ text: 'Stack: ', bold: true, size: 18, font: 'Calibri' }),
              new TextRun({ text: p.technologies.join(', '), italics: true, size: 18, font: 'Calibri' })
            ]
          }));
        }

        if (p.bulletPoints && p.bulletPoints.length > 0) {
          p.bulletPoints.forEach(bp => {
            children.push(new Paragraph({
              bullet: { level: 0 },
              children: [
                new TextRun({ text: bp, size: 20, font: 'Calibri' })
              ]
            }));
          });
        }
        children.push(new Paragraph({ text: '' }));
      });
    }

    // Education
    if (resumeData.education && resumeData.education.length > 0) {
      addSectionHeading('Education');
      resumeData.education.forEach(ed => {
        children.push(new Paragraph({
          children: [
            new TextRun({ text: `${ed.degree} in ${ed.field}`, bold: true, size: 20, font: 'Calibri' }),
            new TextRun({ text: ` | ${ed.institution}`, size: 20, font: 'Calibri' }),
            ed.grade ? new TextRun({ text: ` (GPA: ${ed.grade})`, size: 19, font: 'Calibri' }) : new TextRun({ text: '' })
          ]
        }));
      });
      children.push(new Paragraph({ text: '' }));
    }

    // Certifications
    if (resumeData.certifications && resumeData.certifications.length > 0) {
      addSectionHeading('Certifications');
      resumeData.certifications.forEach(c => {
        children.push(new Paragraph({
          bullet: { level: 0 },
          children: [
            new TextRun({ text: `${c.name} `, bold: true, size: 20, font: 'Calibri' }),
            new TextRun({ text: `— ${c.issuer} (${c.issueDate || 'Verified'})`, size: 19, font: 'Calibri' })
          ]
        }));
      });
    }

    const doc = new Document({
      sections: [{
        properties: {
          page: {
            margin: { top: 720, bottom: 720, left: 720, right: 720 } // 0.5 inch margins
          }
        },
        children
      }]
    });

    return await Packer.toBuffer(doc);
  }
}

module.exports = new DocxService();
