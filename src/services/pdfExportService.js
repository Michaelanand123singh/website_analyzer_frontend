import jsPDF from 'jspdf';
import { trackPDFExport, trackError } from './analytics';

// Import autoTable plugin with error handling
let autoTableAvailable = false;
try {
  require('jspdf-autotable');
  autoTableAvailable = true;
} catch (error) {
  console.warn('jspdf-autotable not available, using fallback table generation');
}

class PDFExportService {
  constructor() {
    this.doc = null;
    this.currentY = 20;
    this.colors = {
      primary: [41, 128, 185],
      secondary: [52, 73, 94],
      accent: [46, 204, 113]
    };
  }

  generateReport(analysis, url) {
    try {
      this.doc = new jsPDF();
      this.currentY = 20;

      this.addHeader();
      this.addTitle(url);
      this.addSection('Executive Summary', 
        'Comprehensive analysis of SEO, UX, content quality, performance, and technical aspects with actionable recommendations.');
      this.addScore(analysis.overall_score);
      this.addPage();
      this.addTable(analysis);
      this.addRecommendations(analysis);
      this.addFooters();

      // Track successful PDF generation
      this.trackPDFExport(url);

      return this.doc;
    } catch (error) {
      // Track PDF generation error
      this.trackError('pdf_generation_error', error.message, url);
      throw error;
    }
  }

  addHeader() {
    this.doc.setFillColor(...this.colors.primary);
    this.doc.rect(0, 0, 210, 25, 'F');
    
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(20);
    this.doc.setTextColor(255, 255, 255);
    this.doc.text('NEXTIN VISION', 20, 15);
    
    this.doc.setFontSize(10);
    this.doc.text('Website Analysis Report', 20, 20);
    
    this.currentY = 35;
  }

  addTitle(url) {
    this.setFont(16, 'bold');
    this.doc.text('Website Performance Analysis', 20, this.currentY);
    this.currentY += 8;
    
    this.setFont(10);
    const displayUrl = url.length > 60 ? url.substring(0, 60) + '...' : url;
    this.doc.text(`Website: ${displayUrl}`, 20, this.currentY);
    this.currentY += 5;
    this.doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, this.currentY);
    this.currentY += 15;
  }

  addSection(title, text) {
    if (this.currentY > 250) this.addPage();
    
    this.doc.setFillColor(...this.colors.primary);
    this.doc.rect(20, this.currentY - 5, 170, 8, 'F');
    this.setFont(12, 'bold', [255, 255, 255]);
    this.doc.text(title, 22, this.currentY);
    this.currentY += 12;

    if (text) {
      this.setFont(10);
      const lines = this.doc.splitTextToSize(text, 170);
      this.doc.text(lines, 20, this.currentY);
      this.currentY += lines.length * 4 + 8;
    }
  }

  addScore(score) {
    const numScore = parseFloat(score) || 0;
    const centerX = 105;
    const centerY = this.currentY + 20;
    
    const color = numScore >= 8 ? [46, 204, 113] : numScore >= 6 ? [241, 196, 15] : [231, 76, 60];
    
    this.doc.setFillColor(...color);
    this.doc.circle(centerX, centerY, 15, 'F');
    
    this.setFont(20, 'bold', [255, 255, 255]);
    this.doc.text(numScore.toString(), centerX - 5, centerY + 3);
    
    this.setFont(8);
    this.doc.text('/10', centerX + 8, centerY + 3);
    
    this.currentY += 50;
  }

  addTable(analysis) {
    const rows = [];
    const scores = analysis.category_scores || analysis;
    
    Object.entries(scores).forEach(([key, score]) => {
      if (['overall_score', 'key_insights', 'priority_actions'].includes(key)) return;
      
      const numScore = parseFloat(score.score || score) || 0;
      const status = numScore >= 7 ? 'Good' : numScore >= 5 ? 'Average' : 'Poor';
      const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      
      rows.push([label, `${numScore}/10`, status]);
    });

    if (autoTableAvailable && this.doc.autoTable) {
      // Use autoTable if available
      try {
        this.doc.autoTable({
          head: [['Category', 'Score', 'Status']],
          body: rows,
          startY: this.currentY,
          theme: 'striped',
          headStyles: { fillColor: this.colors.primary, textColor: [255, 255, 255] },
          margin: { left: 20, right: 20 }
        });
        this.currentY = this.doc.lastAutoTable.finalY + 15;
      } catch (error) {
        console.warn('AutoTable failed, using fallback:', error);
        this.addFallbackTable(rows);
      }
    } else {
      // Fallback table generation
      this.addFallbackTable(rows);
    }
  }

  addFallbackTable(rows) {
    // Manual table generation as fallback
    this.addSection('Analysis Results', '');
    
    // Header
    this.doc.setFillColor(...this.colors.primary);
    this.doc.rect(20, this.currentY, 170, 8, 'F');
    this.setFont(10, 'bold', [255, 255, 255]);
    this.doc.text('Category', 25, this.currentY + 5);
    this.doc.text('Score', 100, this.currentY + 5);
    this.doc.text('Status', 140, this.currentY + 5);
    this.currentY += 10;

    // Rows
    this.setFont(9, 'normal');
    rows.forEach((row, index) => {
      if (this.currentY > 270) this.addPage();
      
      const bgColor = index % 2 === 0 ? [249, 249, 249] : [255, 255, 255];
      this.doc.setFillColor(...bgColor);
      this.doc.rect(20, this.currentY - 2, 170, 6, 'F');
      
      this.doc.text(row[0], 25, this.currentY + 2);
      this.doc.text(row[1], 100, this.currentY + 2);
      
      // Color code status
      const statusColor = row[2] === 'Good' ? [46, 204, 113] : 
                         row[2] === 'Average' ? [241, 196, 15] : [231, 76, 60];
      this.setFont(9, 'bold', statusColor);
      this.doc.text(row[2], 140, this.currentY + 2);
      this.setFont(9, 'normal');
      
      this.currentY += 6;
    });
    
    this.currentY += 10;
  }

  addRecommendations(analysis) {
    this.addSection('Key Recommendations', '');
    
    const addList = (title, items) => {
      if (!items?.length) return;
      
      this.setFont(11, 'bold', this.colors.accent);
      this.doc.text(`${title}:`, 20, this.currentY);
      this.currentY += 6;
      
      this.setFont(9);
      items.slice(0, 4).forEach(item => {
        if (this.currentY > 270) this.addPage();
        const lines = this.doc.splitTextToSize(`• ${item}`, 165);
        this.doc.text(lines, 25, this.currentY);
        this.currentY += lines.length * 3 + 2;
      });
      this.currentY += 5;
    };

    addList('Priority Actions', analysis.priority_actions);
    addList('Key Insights', analysis.key_insights);
  }

  addFooters() {
    const pageCount = this.doc.internal.getNumberOfPages();
    
    for (let i = 1; i <= pageCount; i++) {
      this.doc.setPage(i);
      this.setFont(8);
      this.doc.line(20, 282, 190, 282);
      this.doc.text('NEXTIN VISION', 20, 290);
      this.doc.text(`Page ${i}/${pageCount}`, 170, 290);
    }
  }

  addPage() {
    this.doc.addPage();
    this.currentY = 30;
  }

  setFont(size = 10, style = 'normal', color = this.colors.secondary) {
    this.doc.setFontSize(size);
    this.doc.setFont('helvetica', style);
    this.doc.setTextColor(...color);
  }

  downloadPDF(filename) {
    try {
      this.doc.save(filename);
    } catch (error) {
      this.trackError('pdf_download_error', error.message);
      throw error;
    }
  }

  getPDFBlob() {
    try {
      return this.doc?.output('blob') || null;
    } catch (error) {
      this.trackError('pdf_blob_error', error.message);
      return null;
    }
  }

  // Analytics tracking methods with error handling
  trackPDFExport(url) {
    try {
      trackPDFExport(url);
    } catch (error) {
      // Silently handle analytics errors - don't break PDF generation
      console.log('Analytics tracking failed:', error.message);
    }
  }

  trackError(errorType, errorMessage, url = null) {
    try {
      trackError(errorType, errorMessage, url);
    } catch (error) {
      // Silently handle analytics errors - don't break PDF generation
      console.log('Analytics tracking failed:', error.message);
    }
  }
}

export default PDFExportService;