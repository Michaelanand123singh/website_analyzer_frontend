import jsPDF from 'jspdf';
import 'jspdf-autotable';

class PDFExportService {
  constructor() {
    this.doc = null;
    this.pageWidth = 210;
    this.pageHeight = 297;
    this.margin = 20;
    this.currentY = 20;

    this.colors = {
      primary: [41, 128, 185],
      secondary: [52, 73, 94],
      accent: [46, 204, 113],
    };
  }

  generateReport(analysis, url) {
    try {
      console.log('Initializing PDF document...');
      this.doc = new jsPDF();
      
      // Check if autoTable is available
      if (!this.doc.autoTable) {
        throw new Error('jsPDF autoTable plugin not loaded properly');
      }
      
      console.log('PDF document initialized successfully');
      this.currentY = 20;

      // Add content step by step with error handling
      console.log('Adding header...');
      this.addHeader();
      
      console.log('Adding title...');
      this.addTitle(url);
      
      console.log('Adding executive summary...');
      this.addSection('Executive Summary', this.getSummaryText());
      
      console.log('Adding score...');
      this.addScore(analysis.overall_score);
      
      console.log('Adding new page...');
      this.addPage();
      
      console.log('Adding analysis table...');
      this.addTable(analysis);
      
      console.log('Adding recommendations...');
      this.addRecommendations(analysis);
      
      console.log('Adding footers...');
      this.addFooters();

      console.log('PDF generation completed successfully');
      return this.doc;
      
    } catch (error) {
      console.error('Error in generateReport:', error);
      throw error;
    }
  }

  addHeader() {
    try {
      this.doc.setFillColor(...this.colors.primary);
      this.doc.rect(0, 0, this.pageWidth, 25, 'F');

      this.doc.setFont('helvetica', 'bold');
      this.doc.setFontSize(24);
      this.doc.setTextColor(255, 255, 255);
      this.doc.text('NEXTIN VISION', this.margin, 15);

      this.doc.setFontSize(10);
      this.doc.setFont('helvetica', 'normal');
      this.doc.text('Website Analysis & Digital Solutions', this.margin, 20);

      this.doc.setFontSize(12);
      this.doc.setTextColor(...this.colors.secondary);
      this.doc.text('WEBSITE ANALYSIS REPORT', this.pageWidth - 90, 15);

      this.currentY = 35;
    } catch (error) {
      console.error('Error adding header:', error);
      throw error;
    }
  }

  addTitle(url) {
    try {
      this.setFont(18, 'bold', this.colors.secondary);
      this.doc.text('Website Performance Analysis', this.margin, this.currentY);
      this.currentY += 10;

      this.setFont(12);
      // Truncate URL if too long
      const displayUrl = url.length > 60 ? url.substring(0, 60) + '...' : url;
      this.doc.text(`Website: ${displayUrl}`, this.margin, this.currentY);
      this.currentY += 7;
      this.doc.text(`Analysis Date: ${new Date().toLocaleDateString()}`, this.margin, this.currentY);
      this.currentY += 15;
    } catch (error) {
      console.error('Error adding title:', error);
      throw error;
    }
  }

  getSummaryText() {
    return `This comprehensive report analyzes key performance areas including SEO optimization, user experience, content quality, conversion potential, technical performance, security, accessibility, mobile optimization, and social integration. The analysis provides actionable insights and recommendations to improve website performance and drive business growth.`;
  }

  addSection(title, text) {
    try {
      if (this.currentY > 250) this.addPage();
      
      this.setFont(14, 'bold', [255, 255, 255]);
      this.doc.setFillColor(...this.colors.primary);
      this.doc.rect(this.margin, this.currentY - 5, this.pageWidth - 2 * this.margin, 10, 'F');
      this.doc.text(title, this.margin + 2, this.currentY + 2);
      this.currentY += 15;

      if (text && text.trim()) {
        this.setFont(11, 'normal', this.colors.secondary);
        const wrappedText = this.doc.splitTextToSize(text, this.pageWidth - 2 * this.margin);
        this.doc.text(wrappedText, this.margin, this.currentY);
        this.currentY += wrappedText.length * 5 + 10;
      }
    } catch (error) {
      console.error('Error adding section:', error);
      throw error;
    }
  }

  addScore(score) {
    try {
      this.addSection('Overall Performance Score', '');

      const centerX = this.pageWidth / 2;
      const centerY = this.currentY + 25;
      const radius = 20;

      // Ensure score is a number
      const numScore = typeof score === 'string' ? parseFloat(score) : score;
      if (isNaN(numScore)) {
        console.warn('Invalid score value:', score);
        return;
      }

      const color = numScore >= 8 ? [46, 204, 113] : numScore >= 6 ? [241, 196, 15] : [231, 76, 60];
      
      // Draw outer circle
      this.doc.setFillColor(240, 240, 240);
      this.doc.circle(centerX, centerY, radius, 'F');
      
      // Draw inner circle
      this.doc.setFillColor(...color);
      this.doc.circle(centerX, centerY, radius - 3, 'F');

      // Add score text
      this.setFont(24, 'bold', [255, 255, 255]);
      const scoreText = numScore.toString();
      const scoreWidth = this.doc.getTextWidth(scoreText);
      this.doc.text(scoreText, centerX - scoreWidth/2, centerY + 5);
      
      this.setFont(12, 'normal', this.colors.secondary);
      this.doc.text('/10', centerX + scoreWidth/2 + 2, centerY + 5);

      // Add performance label
      const label = numScore >= 8 ? 'Excellent' : numScore >= 6 ? 'Good' : numScore >= 4 ? 'Average' : 'Needs Improvement';
      this.setFont(10);
      const labelWidth = this.doc.getTextWidth(label);
      this.doc.text(label, centerX - labelWidth/2, centerY + 15);

      this.currentY += 60;
    } catch (error) {
      console.error('Error adding score:', error);
      throw error;
    }
  }

  addTable(analysis) {
    try {
      const headers = [['Category', 'Score', 'Status', 'Priority']];
      const rows = [];

      // Handle both old and new analysis structures
      if (analysis.category_scores) {
        // New structure with category_scores
        Object.entries(analysis.category_scores).forEach(([key, score]) => {
          const numScore = typeof score === 'string' ? parseFloat(score) : score;
          if (isNaN(numScore)) return;
          
          const status = numScore >= 7 ? 'Good' : numScore >= 5 ? 'Average' : 'Poor';
          const priority = numScore < 5 ? 'High' : numScore < 7 ? 'Medium' : 'Low';
          const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

          rows.push([label, `${numScore}/10`, status, priority]);
        });
      } else {
        // Old structure - direct analysis object
        Object.entries(analysis).forEach(([key, val]) => {
          if (['overall_score', 'key_insights', 'priority_actions', 'analysis_metadata', 'technical_metrics', 'competitive_advantages', 'risk_factors'].includes(key)) return;
          
          let score;
          if (val && typeof val === 'object') {
            score = val.score;
          } else if (typeof val === 'number' || typeof val === 'string') {
            score = val;
          }
          
          if (score !== undefined) {
            const numScore = typeof score === 'string' ? parseFloat(score) : score;
            if (isNaN(numScore)) return;
            
            const status = numScore >= 7 ? 'Good' : numScore >= 5 ? 'Average' : 'Poor';
            const priority = numScore < 5 ? 'High' : numScore < 7 ? 'Medium' : 'Low';
            const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

            rows.push([label, `${numScore}/10`, status, priority]);
          }
        });
      }

      if (rows.length === 0) {
        console.warn('No data available for table generation');
        this.addSection('Analysis Data', 'No detailed analysis data available.');
        return;
      }

      this.doc.autoTable({
        head: headers,
        body: rows,
        startY: this.currentY,
        theme: 'striped',
        headStyles: { 
          fillColor: this.colors.primary, 
          textColor: [255, 255, 255],
          fontSize: 12,
          fontStyle: 'bold'
        },
        bodyStyles: { 
          textColor: this.colors.secondary,
          fontSize: 10
        },
        alternateRowStyles: { fillColor: [248, 249, 250] },
        margin: { left: this.margin, right: this.margin },
        columnStyles: {
          0: { cellWidth: 60 },
          1: { cellWidth: 30, halign: 'center' },
          2: { cellWidth: 30, halign: 'center' },
          3: { cellWidth: 30, halign: 'center' }
        }
      });

      this.currentY = this.doc.lastAutoTable.finalY + 15;
    } catch (error) {
      console.error('Error adding table:', error);
      throw error;
    }
  }

  addRecommendations(analysis) {
    try {
      this.addSection('Key Recommendations', '');

      const addList = (label, items) => {
        if (!items || !Array.isArray(items) || items.length === 0) return;
        
        if (this.currentY > 240) this.addPage();
        
        this.setFont(12, 'bold', this.colors.accent);
        this.doc.text(`${label}:`, this.margin, this.currentY);
        this.currentY += 8;
        
        this.setFont(10, 'normal', this.colors.secondary);
        items.slice(0, 5).forEach(item => { // Limit to 5 items
          if (this.currentY > 270) this.addPage();
          
          const lines = this.doc.splitTextToSize(`• ${item}`, this.pageWidth - 2 * this.margin - 10);
          this.doc.text(lines, this.margin + 5, this.currentY);
          this.currentY += lines.length * 4 + 3;
        });
        this.currentY += 8;
      };

      addList('Priority Actions', analysis.priority_actions);
      addList('Key Insights', analysis.key_insights);
      
      if (analysis.competitive_advantages) {
        addList('Competitive Advantages', analysis.competitive_advantages);
      }
      
      if (analysis.risk_factors) {
        addList('Risk Factors', analysis.risk_factors);
      }
    } catch (error) {
      console.error('Error adding recommendations:', error);
      throw error;
    }
  }

  addFooters() {
    try {
      const pageCount = this.doc.internal.getNumberOfPages();
      const footerY = this.pageHeight - 15;
      
      for (let i = 1; i <= pageCount; i++) {
        this.doc.setPage(i);
        this.setFont(8, 'normal', this.colors.secondary);
        this.doc.setDrawColor(...this.colors.primary);
        this.doc.line(this.margin, this.pageHeight - 25, this.pageWidth - this.margin, this.pageHeight - 25);
        this.doc.text('NEXTIN VISION - Website Analysis & Digital Solutions', this.margin, footerY);
        this.doc.text(`Page ${i} of ${pageCount}`, this.pageWidth - this.margin - 25, footerY);
        this.doc.text(`Generated: ${new Date().toLocaleString()}`, this.margin, footerY + 6);
      }
    } catch (error) {
      console.error('Error adding footers:', error);
      throw error;
    }
  }

  addPage() {
    try {
      this.doc.addPage();
      this.currentY = 30;
    } catch (error) {
      console.error('Error adding page:', error);
      throw error;
    }
  }

  setFont(size = 10, style = 'normal', color = this.colors.secondary) {
    try {
      this.doc.setFontSize(size);
      this.doc.setFont('helvetica', style);
      this.doc.setTextColor(...color);
    } catch (error) {
      console.error('Error setting font:', error);
      throw error;
    }
  }

  downloadPDF(filename) {
    try {
      if (!this.doc) {
        throw new Error('PDF document not generated');
      }
      console.log('Attempting to download PDF...');
      this.doc.save(filename);
      console.log('PDF download initiated successfully');
    } catch (error) {
      console.error('Error downloading PDF:', error);
      throw error;
    }
  }

  getPDFBlob() {
    try {
      return this.doc?.output('blob') || null;
    } catch (error) {
      console.error('Error getting PDF blob:', error);
      return null;
    }
  }
}

export default PDFExportService;