// pdfExportService.js
import jsPDF from 'jspdf';
import 'jspdf-autotable';

class PDFExportService {
  constructor() {
    this.doc = null;
    this.pageWidth = 210; // A4 width in mm
    this.pageHeight = 297; // A4 height in mm
    this.margin = 20;
    this.currentY = 20;
    this.primaryColor = [41, 128, 185]; // Blue color for headers
    this.secondaryColor = [52, 73, 94]; // Dark gray for text
    this.accentColor = [46, 204, 113]; // Green for highlights
  }

  generateReport(analysis, url) {
    this.doc = new jsPDF();
    this.currentY = 20;

    // Check if autoTable is available after import
    if (!this.doc.autoTable) {
      throw new Error('jsPDF autoTable plugin not properly loaded. Please check your dependencies.');
    }

    // Add header with company branding
    this.addHeader();
    
    // Add title and basic info
    this.addTitle(url);
    
    // Add executive summary
    this.addExecutiveSummary(analysis);
    
    // Add overall score visualization
    this.addOverallScore(analysis.overall_score);
    
    // Add new page for detailed analysis
    this.addPage();
    this.addDetailedAnalysis(analysis);
    
    // Add recommendations
    this.addRecommendations(analysis);
    
    // Add footer to all pages
    this.addFooters();
    
    return this.doc;
  }

  addHeader() {
    // Company logo area (you can replace this with actual logo)
    this.doc.setFillColor(...this.primaryColor);
    this.doc.rect(0, 0, this.pageWidth, 25, 'F');
    
    // Company name
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(24);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('NEXTIN VISION', this.margin, 15);
    
    // Tagline
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text('Website Analysis & Digital Solutions', this.margin, 20);
    
    // Report type
    this.doc.setTextColor(...this.secondaryColor);
    this.doc.setFontSize(12);
    this.doc.text('WEBSITE ANALYSIS REPORT', this.pageWidth - this.margin - 60, 15);
    
    this.currentY = 35;
  }

  addTitle(url) {
    // Report title
    this.doc.setTextColor(...this.secondaryColor);
    this.doc.setFontSize(18);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Website Performance Analysis', this.margin, this.currentY);
    this.currentY += 15;
    
    // URL and date
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(`Website: ${url}`, this.margin, this.currentY);
    this.currentY += 8;
    
    const analysisDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    this.doc.text(`Analysis Date: ${analysisDate}`, this.margin, this.currentY);
    this.currentY += 15;
  }

  addExecutiveSummary(analysis) {
    this.addSectionHeader('Executive Summary');
    
    const summaryText = `This comprehensive website analysis evaluates five critical areas: SEO optimization, user experience, content quality, conversion potential, and technical performance. Our analysis provides actionable insights to enhance your website's effectiveness and drive better business results.`;
    
    this.doc.setFontSize(11);
    this.doc.setFont('helvetica', 'normal');
    const splitText = this.doc.splitTextToSize(summaryText, this.pageWidth - 2 * this.margin);
    this.doc.text(splitText, this.margin, this.currentY);
    this.currentY += splitText.length * 5 + 10;
  }

  addOverallScore(overallScore) {
    this.addSectionHeader('Overall Performance Score');
    
    // Score circle
    const centerX = this.pageWidth / 2;
    const centerY = this.currentY + 25;
    const radius = 20;
    
    // Background circle
    this.doc.setFillColor(240, 240, 240);
    this.doc.circle(centerX, centerY, radius, 'F');
    
    // Score circle with color based on score
    let scoreColor;
    if (overallScore >= 8) scoreColor = [46, 204, 113]; // Green
    else if (overallScore >= 6) scoreColor = [241, 196, 15]; // Yellow
    else scoreColor = [231, 76, 60]; // Red
    
    this.doc.setFillColor(...scoreColor);
    this.doc.circle(centerX, centerY, radius - 3, 'F');
    
    // Score text
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(24);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(overallScore.toString(), centerX - 5, centerY + 5);
    
    this.doc.setTextColor(...this.secondaryColor);
    this.doc.setFontSize(12);
    this.doc.text('/10', centerX + 8, centerY + 5);
    
    // Score interpretation
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    let interpretation;
    if (overallScore >= 8) interpretation = 'Excellent Performance';
    else if (overallScore >= 6) interpretation = 'Good Performance';
    else if (overallScore >= 4) interpretation = 'Average Performance';
    else interpretation = 'Needs Improvement';
    
    this.doc.text(interpretation, centerX - 25, centerY + 15);
    
    this.currentY += 60;
  }

  addDetailedAnalysis(analysis) {
    this.addSectionHeader('Detailed Analysis Breakdown');
    
    const analysisData = [];
    const headers = ['Category', 'Score', 'Status', 'Priority'];
    
    Object.entries(analysis).forEach(([key, value]) => {
      if (key === 'overall_score' || key === 'key_insights' || key === 'priority_actions') return;
      
      if (typeof value === 'object' && value.score !== undefined) {
        const score = value.score;
        const status = score >= 7 ? 'Good' : score >= 5 ? 'Average' : 'Poor';
        const priority = score < 5 ? 'High' : score < 7 ? 'Medium' : 'Low';
        
        analysisData.push([
          key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          `${score}/10`,
          status,
          priority
        ]);
      }
    });

    // Use autoTable as a method of the doc object (newer versions)
    this.doc.autoTable({
      head: [headers],
      body: analysisData,
      startY: this.currentY,
      theme: 'striped',
      headStyles: {
        fillColor: this.primaryColor,
        textColor: [255, 255, 255],
        fontSize: 12,
        fontStyle: 'bold'
      },
      bodyStyles: {
        fontSize: 10,
        textColor: this.secondaryColor
      },
      alternateRowStyles: {
        fillColor: [248, 249, 250]
      },
      margin: { left: this.margin, right: this.margin }
    });

    // Get the final Y position after the table
    this.currentY = this.doc.lastAutoTable.finalY + 15;
  }

  addRecommendations(analysis) {
    if (this.currentY > 200) {
      this.addPage();
    }
    
    this.addSectionHeader('Key Recommendations');
    
    // Priority Actions
    if (analysis.priority_actions && analysis.priority_actions.length > 0) {
      this.doc.setFontSize(12);
      this.doc.setFont('helvetica', 'bold');
      this.doc.setTextColor(...this.accentColor);
      this.doc.text('Priority Actions:', this.margin, this.currentY);
      this.currentY += 8;
      
      this.doc.setFontSize(10);
      this.doc.setFont('helvetica', 'normal');
      this.doc.setTextColor(...this.secondaryColor);
      
      analysis.priority_actions.forEach((action, index) => {
        const bulletText = `• ${action}`;
        const splitText = this.doc.splitTextToSize(bulletText, this.pageWidth - 2 * this.margin - 10);
        this.doc.text(splitText, this.margin + 5, this.currentY);
        this.currentY += splitText.length * 4 + 3;
      });
      
      this.currentY += 10;
    }
    
    // Key Insights
    if (analysis.key_insights && analysis.key_insights.length > 0) {
      this.doc.setFontSize(12);
      this.doc.setFont('helvetica', 'bold');
      this.doc.setTextColor(...this.accentColor);
      this.doc.text('Key Insights:', this.margin, this.currentY);
      this.currentY += 8;
      
      this.doc.setFontSize(10);
      this.doc.setFont('helvetica', 'normal');
      this.doc.setTextColor(...this.secondaryColor);
      
      analysis.key_insights.forEach((insight, index) => {
        const bulletText = `• ${insight}`;
        const splitText = this.doc.splitTextToSize(bulletText, this.pageWidth - 2 * this.margin - 10);
        this.doc.text(splitText, this.margin + 5, this.currentY);
        this.currentY += splitText.length * 4 + 3;
      });
    }
  }

  addSectionHeader(title) {
    if (this.currentY > 250) {
      this.addPage();
    }
    
    this.doc.setFillColor(...this.primaryColor);
    this.doc.rect(this.margin, this.currentY - 5, this.pageWidth - 2 * this.margin, 10, 'F');
    
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(title, this.margin + 2, this.currentY + 2);
    
    this.currentY += 15;
  }

  addPage() {
    this.doc.addPage();
    this.currentY = 30;
  }

  addFooters() {
    const pageCount = this.doc.internal.getNumberOfPages();
    
    for (let i = 1; i <= pageCount; i++) {
      this.doc.setPage(i);
      
      // Footer line
      this.doc.setDrawColor(...this.primaryColor);
      this.doc.setLineWidth(0.5);
      this.doc.line(this.margin, this.pageHeight - 25, this.pageWidth - this.margin, this.pageHeight - 25);
      
      // Company info
      this.doc.setFontSize(8);
      this.doc.setTextColor(...this.secondaryColor);
      this.doc.setFont('helvetica', 'normal');
      this.doc.text('NEXTIN VISION - Website Analysis & Digital Solutions', this.margin, this.pageHeight - 15);
      
      // Page number
      this.doc.text(`Page ${i} of ${pageCount}`, this.pageWidth - this.margin - 20, this.pageHeight - 15);
      
      // Generation timestamp
      const timestamp = new Date().toLocaleString();
      this.doc.text(`Generated: ${timestamp}`, this.margin, this.pageHeight - 10);
    }
  }

  downloadPDF(filename) {
    if (this.doc) {
      this.doc.save(filename);
    }
  }

  getPDFBlob() {
    if (this.doc) {
      return this.doc.output('blob');
    }
    return null;
  }
}

export default PDFExportService;