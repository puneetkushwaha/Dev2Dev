import { jsPDF } from 'jspdf';

/**
 * Generates a professional, futuristic certification PDF using jsPDF.
 * Inspired by high-tech/cyberpunk aesthetics.
 * 
 * @param {Object} userData - User profile data (name, etc.)
 * @param {Object} examData - Exam results (examName, score, date, etc.)
 * @param {string} type - Type of certificate: 'EXAM', 'DOMAIN', 'TUTORIAL'
 */
export const generateCertificate = (userData, examData, type = 'EXAM') => {
    // Create new PDF in Landscape orientation
    const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
    });

    const width = doc.internal.pageSize.getWidth();
    const height = doc.internal.pageSize.getHeight();

    // --- Background Layer ---
    doc.setFillColor(5, 7, 17); // Deep Navy/Black (#050711)
    doc.rect(0, 0, width, height, 'F');

    // --- Tech Accent Graphics (Circuit Lines) ---
    doc.setDrawColor(64, 123, 255); // Electric Blue (#407BFF)
    doc.setLineWidth(0.5);

    // Corner Accents (Circuit-style)
    const margin = 15;
    const accentSize = 25;

    // Top Left
    doc.line(margin, margin, margin + accentSize, margin);
    doc.line(margin, margin, margin, margin + accentSize);
    doc.line(margin + 5, margin + 5, margin + accentSize - 5, margin + 5);

    // Top Right
    doc.line(width - margin, margin, width - margin - accentSize, margin);
    doc.line(width - margin, margin, width - margin, margin + accentSize);
    doc.line(width - margin - 5, margin + 5, width - margin - accentSize + 5, margin + 5);

    // Bottom Left
    doc.line(margin, height - margin, margin + accentSize, height - margin);
    doc.line(margin, height - margin, margin, height - margin - accentSize);
    doc.line(margin + 5, height - margin - 5, margin + accentSize - 5, height - margin - 5);

    // Bottom Right
    doc.line(width - margin, height - margin, width - margin - accentSize, height - margin);
    doc.line(width - margin, height - margin, width - margin, height - margin - accentSize);
    doc.line(width - margin - 5, height - margin - 5, width - margin - accentSize + 5, height - margin - 5);

    // --- Main Content ---

    // Header: CERTIFICATE
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(50);
    doc.text('CERTIFICATE', width / 2, 50, { align: 'center' });

    // Subheader: Dynamic based on type
    doc.setTextColor(64, 123, 255);
    doc.setFontSize(18);
    const subheader = type === 'DOMAIN' ? 'OF DOMAIN MASTERY & EXCELLENCE' :
        (type === 'TUTORIAL' ? 'OF PROFESSIONAL PROFICIENCY' : 'OF ACHIEVEMENT & TECHNICAL EXCELLENCE');
    doc.text(subheader, width / 2, 65, { align: 'center' });

    // Decorative Bar
    doc.setDrawColor(64, 123, 255);
    doc.setLineWidth(1.5);
    doc.line(width / 2 - 40, 72, width / 2 + 40, 72);

    // This is to certify that
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(14);
    doc.text('This is to officially certify that', width / 2, 90, { align: 'center' });

    // Recipient Name
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(42);
    doc.text(userData.name.toUpperCase(), width / 2, 110, { align: 'center' });

    // Description text
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(14);

    let description = '';
    if (type === 'DOMAIN') {
        description = `has successfully completed the comprehensive ${examData.examName} track. By mastering all core modules and technical assessments, the candidate has demonstrated the specialized expertise required for professional excellence in this domain.`;
    } else if (type === 'TUTORIAL') {
        description = `has successfully completed the ${examData.examName} professional series. This certification recognizes the candidate's commitment to continuous learning and their mastery of the specialized technical concepts covered in this curriculum.`;
    } else {
        description = `has successfully demonstrated exceptional proficiency in the ${examData.examName} assessment on the DevElevate platform. By achieving a score of ${examData.score}/${examData.totalMarks}, the candidate has met the rigorous technical standards of modern industry paradigms.`;
    }

    // Split text to fit width
    const splitDesc = doc.splitTextToSize(description, 180);
    doc.text(splitDesc, width / 2, 125, { align: 'center' });

    // --- Footer Details ---

    // Date
    const date = new Date(examData.dateRun || Date.now()).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    doc.setFontSize(12);
    doc.text('DATE OF ISSUANCE', 60, 165, { align: 'center' });
    doc.setTextColor(64, 123, 255);
    doc.setFont('helvetica', 'bold');
    doc.text(date, 60, 175, { align: 'center' });

    // Verification ID (UUID style)
    const certId = `DEV-${Math.random().toString(36).substr(2, 9).toUpperCase()}-${new Date().getFullYear()}`;
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'normal');
    doc.text('CERTIFICATE ID', width / 2, 165, { align: 'center' });
    doc.setTextColor(64, 123, 255);
    doc.setFont('helvetica', 'bold');
    doc.text(certId, width / 2, 175, { align: 'center' });

    // Signature
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'normal');
    doc.text('AUTHORIZED BY', width - 60, 165, { align: 'center' });
    doc.setTextColor(64, 123, 255);
    doc.setFont('helvetica', 'bold');
    doc.text('DEVELEVATE AI ENGINE', width - 60, 175, { align: 'center' });

    // --- Bottom Geometric Decoration ---
    doc.setDrawColor(64, 123, 255);
    doc.setLineWidth(0.5);
    doc.circle(width / 2, height - 20, 8);
    doc.setFontSize(10);
    doc.setTextColor(64, 123, 255);
    doc.text('01', width / 2, height - 19, { align: 'center' });

    // Save PDF
    doc.save(`${userData.name.replace(/\s/g, '_')}_${examData.examName.replace(/\s/g, '_')}_Certificate.pdf`);
};

/**
 * All tutorials are certificate-eligible — the gate is now enforced by
 * completing all lessons, not by a title whitelist.
 */
export const isEligibleForCertificate = (title) => {
    return !!title;
};
