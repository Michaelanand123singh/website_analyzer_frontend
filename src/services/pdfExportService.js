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
    this.pageWidth = 210;
    this.pageHeight = 297;
    this.margin = 20;
    this.contentWidth = this.pageWidth - (this.margin * 2);
    this.colors = {
      primary: [243, 156, 18],
      secondary: [52, 73, 94],
      accent: [46, 204, 113],
      success: [46, 204, 113],
      warning: [241, 196, 15],
      danger: [231, 76, 60],
      light: [249, 249, 249]
    };
  }

  generateReport(analysis, url) {
    try {
      this.doc = new jsPDF();
      this.currentY = 20;

      // Generate all sections
      this.addHeader();
      this.addTitle(url);
      this.addExecutiveSummary(analysis);
      this.addOverallScore(analysis.overall_score);
      this.addPage();
      
      this.addCategoryScoresTable(analysis);
      this.addDetailedCategoryAnalysis(analysis);
      this.addTechnicalMetrics(analysis);
      this.addKeyInsights(analysis);
      this.addPriorityActions(analysis);
      this.addCompetitiveAdvantages(analysis);
      this.addRiskFactors(analysis);
      this.addRecommendationsSummary(analysis);
      
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
    this.doc.rect(0, 0, this.pageWidth, 25, 'F');
    
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(20);
    this.doc.setTextColor(255, 255, 255);
    this.doc.text('NEXTIN VISION', this.margin, 15);
    
    this.doc.setFontSize(10);
    this.doc.text('Comprehensive Website Analysis Report', this.margin, 20);
    
    this.currentY = 35;
  }

  addTitle(url) {
    this.setFont(16, 'bold');
    this.doc.text('Website Performance Analysis', this.margin, this.currentY);
    this.currentY += 8;
    
    this.setFont(10);
    const displayUrl = url.length > 70 ? url.substring(0, 70) + '...' : url;
    this.doc.text(`Website: ${displayUrl}`, this.margin, this.currentY);
    this.currentY += 5;
    this.doc.text(`Generated: ${new Date().toLocaleString()}`, this.margin, this.currentY);
    this.currentY += 15;
  }

  addExecutiveSummary(analysis) {
    this.addSection('Executive Summary', '');
    
    const summaryText = `This comprehensive analysis evaluates your website across multiple critical dimensions including SEO optimization, user experience, content quality, conversion potential, technical performance, security & accessibility, mobile optimization, and social integration. The analysis covers ${analysis.analysis_metadata?.total_parameters_analyzed || 32} parameters to provide actionable insights for improvement.`;
    
    this.setFont(10);
    const lines = this.doc.splitTextToSize(summaryText, this.contentWidth);
    this.doc.text(lines, this.margin, this.currentY);
    this.currentY += lines.length * 4 + 10;
  }

  addOverallScore(score) {
    const numScore = parseFloat(score) || 0;
    const centerX = this.pageWidth / 2;
    const centerY = this.currentY + 20;
    
    const color = numScore >= 8 ? this.colors.success : numScore >= 6 ? this.colors.warning : this.colors.danger;
    
    this.doc.setFillColor(...color);
    this.doc.circle(centerX, centerY, 15, 'F');
    
    this.setFont(20, 'bold', [255, 255, 255]);
    this.doc.text(numScore.toString(), centerX - 5, centerY + 3);
    
    this.setFont(8, 'normal', [255, 255, 255]);
    this.doc.text('/10', centerX + 8, centerY + 3);
    
    this.setFont(10, 'bold');
    this.doc.text('Overall Score', centerX - 15, centerY + 25);
    
    this.currentY += 50;
  }

  addCategoryScoresTable(analysis) {
    this.addSection('Category Scores Overview', '');
    
    const categories = [
      { key: 'seo', title: 'SEO Optimization' },
      { key: 'user_experience', title: 'User Experience' },
      { key: 'content_quality', title: 'Content Quality' },
      { key: 'conversion_optimization', title: 'Conversion Optimization' },
      { key: 'technical_performance', title: 'Technical Performance' },
      { key: 'security_accessibility', title: 'Security & Accessibility' },
      { key: 'mobile_optimization', title: 'Mobile Optimization' },
      { key: 'social_integration', title: 'Social Integration' }
    ];

    const rows = categories.map(category => {
      const score = analysis.category_scores?.[category.key] || 'N/A';
      const numScore = parseFloat(score) || 0;
      const status = numScore >= 7 ? 'Excellent' : numScore >= 5 ? 'Good' : numScore >= 3 ? 'Average' : 'Poor';
      return [category.title, `${score}/10`, status];
    });

    this.createTable(['Category', 'Score', 'Status'], rows);
  }

  addDetailedCategoryAnalysis(analysis) {
    if (!analysis.detailed_analysis) return;

    this.addSection('Detailed Category Analysis', '');

    const categories = [
      { key: 'seo', title: 'SEO Optimization', icon: '🔍' },
      { key: 'user_experience', title: 'User Experience', icon: '👤' },
      { key: 'content_quality', title: 'Content Quality', icon: '📝' },
      { key: 'conversion_optimization', title: 'Conversion Optimization', icon: '🎯' },
      { key: 'technical_performance', title: 'Technical Performance', icon: '⚙️' },
      { key: 'security_accessibility', title: 'Security & Accessibility', icon: '🔒' },
      { key: 'mobile_optimization', title: 'Mobile Optimization', icon: '📱' },
      { key: 'social_integration', title: 'Social Integration', icon: '📢' }
    ];

    categories.forEach(category => {
      const categoryData = analysis.detailed_analysis[category.key];
      if (categoryData) {
        this.addCategoryDetail(category.title, categoryData, analysis.category_scores?.[category.key]);
      }
    });
  }

  addCategoryDetail(categoryTitle, categoryData, score) {
    if (this.currentY > 250) this.addPage();

    // Category header
    this.doc.setFillColor(...this.colors.accent);
    this.doc.rect(this.margin, this.currentY - 3, this.contentWidth, 10, 'F');
    this.setFont(11, 'bold', [255, 255, 255]);
    this.doc.text(`${categoryTitle} (${score}/10)`, this.margin + 2, this.currentY + 3);
    this.currentY += 12;

    // Sub-scores
    if (categoryData && typeof categoryData === 'object') {
      const subScores = Object.entries(categoryData).filter(([key, value]) => 
        !['issues', 'recommendations'].includes(key) && typeof value === 'string' && !isNaN(parseFloat(value))
      );

      if (subScores.length > 0) {
        this.setFont(9, 'bold');
        this.doc.text('Sub-category Scores:', this.margin, this.currentY);
        this.currentY += 5;

        subScores.forEach(([key, value]) => {
          const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
          this.setFont(8);
          this.doc.text(`• ${label}: ${value}/10`, this.margin + 5, this.currentY);
          this.currentY += 4;
        });
        this.currentY += 3;
      }

      // Issues
      if (categoryData.issues && categoryData.issues.length > 0) {
        this.setFont(9, 'bold', this.colors.danger);
        this.doc.text('Issues Identified:', this.margin, this.currentY);
        this.currentY += 5;

        categoryData.issues.forEach(issue => {
          if (this.currentY > 270) this.addPage();
          this.setFont(8);
          const lines = this.doc.splitTextToSize(`• ${issue}`, this.contentWidth - 10);
          this.doc.text(lines, this.margin + 5, this.currentY);
          this.currentY += lines.length * 3 + 1;
        });
        this.currentY += 3;
      }

      // Recommendations
      if (categoryData.recommendations && categoryData.recommendations.length > 0) {
        this.setFont(9, 'bold', this.colors.success);
        this.doc.text('Recommendations:', this.margin, this.currentY);
        this.currentY += 5;

        categoryData.recommendations.forEach(rec => {
          if (this.currentY > 270) this.addPage();
          this.setFont(8);
          const lines = this.doc.splitTextToSize(`• ${rec}`, this.contentWidth - 10);
          this.doc.text(lines, this.margin + 5, this.currentY);
          this.currentY += lines.length * 3 + 1;
        });
        this.currentY += 3;
      }
    }

    this.currentY += 5;
  }

  addTechnicalMetrics(analysis) {
    if (!analysis.technical_metrics) return;

    this.addSection('Technical Metrics', '');

    const metrics = [
      ['Page Size', `${Math.round(analysis.technical_metrics.page_size / 1000)}KB`],
      ['Images Count', analysis.technical_metrics.image_count?.toString() || 'N/A'],
      ['Links Count', analysis.technical_metrics.link_count?.toString() || 'N/A'],
      ['HTTPS Status', analysis.technical_metrics.is_https ? '✓ Enabled' : '✗ Disabled'],
      ['Load Time', analysis.technical_metrics.load_time ? `${analysis.technical_metrics.load_time}ms` : 'N/A'],
      ['Response Code', analysis.technical_metrics.response_code?.toString() || 'N/A']
    ];

    this.createTable(['Metric', 'Value'], metrics);
  }

  addKeyInsights(analysis) {
    if (!analysis.key_insights || analysis.key_insights.length === 0) return;

    this.addSection('Key Insights', '');
    this.addBulletList(analysis.key_insights, this.colors.primary);
  }

  addPriorityActions(analysis) {
    if (!analysis.priority_actions || analysis.priority_actions.length === 0) return;

    this.addSection('Priority Actions', '');
    this.addNumberedList(analysis.priority_actions, this.colors.accent);
  }

  addCompetitiveAdvantages(analysis) {
    if (!analysis.competitive_advantages || analysis.competitive_advantages.length === 0) return;

    this.addSection('Competitive Advantages', '');
    this.addBulletList(analysis.competitive_advantages, this.colors.success);
  }

  addRiskFactors(analysis) {
    if (!analysis.risk_factors || analysis.risk_factors.length === 0) return;

    this.addSection('Risk Factors', '');
    this.addBulletList(analysis.risk_factors, this.colors.danger);
  }

  addRecommendationsSummary(analysis) {
    this.addSection('Implementation Timeline', '');
    
    const timelineText = `
Based on the analysis, we recommend implementing changes in the following order:

1. Immediate (1-2 weeks): Address critical security and technical issues
2. Short-term (1-2 months): Improve SEO fundamentals and user experience
3. Medium-term (3-6 months): Enhance content quality and conversion optimization
4. Long-term (6+ months): Advanced features and continuous optimization

Focus on high-impact, low-effort improvements first to maximize ROI.`;

    this.setFont(9);
    const lines = this.doc.splitTextToSize(timelineText.trim(), this.contentWidth);
    this.doc.text(lines, this.margin, this.currentY);
    this.currentY += lines.length * 3 + 10;
  }

  addBulletList(items, color = this.colors.secondary) {
    this.setFont(9, 'normal', color);
    items.forEach(item => {
      if (this.currentY > 270) this.addPage();
      const lines = this.doc.splitTextToSize(`• ${item}`, this.contentWidth - 5);
      this.doc.text(lines, this.margin + 5, this.currentY);
      this.currentY += lines.length * 3 + 2;
    });
    this.currentY += 5;
  }

  addNumberedList(items, color = this.colors.secondary) {
    this.setFont(9, 'normal', color);
    items.forEach((item, index) => {
      if (this.currentY > 270) this.addPage();
      const lines = this.doc.splitTextToSize(`${index + 1}. ${item}`, this.contentWidth - 10);
      this.doc.text(lines, this.margin + 5, this.currentY);
      this.currentY += lines.length * 3 + 2;
    });
    this.currentY += 5;
  }

  createTable(headers, rows) {
    if (autoTableAvailable && this.doc.autoTable) {
      try {
        this.doc.autoTable({
          head: [headers],
          body: rows,
          startY: this.currentY,
          theme: 'striped',
          headStyles: { 
            fillColor: this.colors.primary, 
            textColor: [255, 255, 255],
            fontSize: 10,
            fontStyle: 'bold'
          },
          bodyStyles: {
            fontSize: 9
          },
          margin: { left: this.margin, right: this.margin },
          styles: {
            cellPadding: 3,
            fontSize: 9
          }
        });
        this.currentY = this.doc.lastAutoTable.finalY + 15;
      } catch (error) {
        console.warn('AutoTable failed, using fallback:', error);
        this.addFallbackTable(headers, rows);
      }
    } else {
      this.addFallbackTable(headers, rows);
    }
  }

  addFallbackTable(headers, rows) {
    const cellHeight = 6;
    const colWidth = this.contentWidth / headers.length;

    // Header
    this.doc.setFillColor(...this.colors.primary);
    this.doc.rect(this.margin, this.currentY, this.contentWidth, cellHeight, 'F');
    this.setFont(9, 'bold', [255, 255, 255]);
    
    headers.forEach((header, index) => {
      this.doc.text(header, this.margin + (index * colWidth) + 2, this.currentY + 4);
    });
    this.currentY += cellHeight;

    // Rows
    this.setFont(8, 'normal');
    rows.forEach((row, rowIndex) => {
      if (this.currentY > 270) this.addPage();
      
      const bgColor = rowIndex % 2 === 0 ? this.colors.light : [255, 255, 255];
      this.doc.setFillColor(...bgColor);
      this.doc.rect(this.margin, this.currentY, this.contentWidth, cellHeight, 'F');
      
      row.forEach((cell, colIndex) => {
        // Color code for scores
        if (colIndex === 1 && cell.includes('/10')) {
          const score = parseFloat(cell);
          const scoreColor = score >= 7 ? this.colors.success : score >= 5 ? this.colors.warning : this.colors.danger;
          this.setFont(8, 'bold', scoreColor);
        } else {
          this.setFont(8, 'normal');
        }
        
        const cellText = cell.length > 25 ? cell.substring(0, 25) + '...' : cell;
        this.doc.text(cellText, this.margin + (colIndex * colWidth) + 2, this.currentY + 4);
      });
      
      this.currentY += cellHeight;
    });
    
    this.currentY += 10;
  }

  addSection(title, text) {
    if (this.currentY > 250) this.addPage();
    
    this.doc.setFillColor(...this.colors.primary);
    this.doc.rect(this.margin, this.currentY - 5, this.contentWidth, 8, 'F');
    this.setFont(12, 'bold', [255, 255, 255]);
    this.doc.text(title, this.margin + 2, this.currentY);
    this.currentY += 12;

    if (text) {
      this.setFont(10);
      const lines = this.doc.splitTextToSize(text, this.contentWidth);
      this.doc.text(lines, this.margin, this.currentY);
      this.currentY += lines.length * 4 + 8;
    }
  }

  addFooters() {
    const pageCount = this.doc.internal.getNumberOfPages();
    
    for (let i = 1; i <= pageCount; i++) {
      this.doc.setPage(i);
      this.setFont(8);
      this.doc.line(this.margin, 282, this.pageWidth - this.margin, 282);
      this.doc.text('NEXTIN VISION - Comprehensive Website Analysis', this.margin, 290);
      this.doc.text(`Page ${i}/${pageCount}`, this.pageWidth - 30, 290);
      this.doc.text(new Date().toLocaleDateString(), this.pageWidth / 2 - 15, 290);
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
      console.log('Analytics tracking failed:', error.message);
    }
  }

  trackError(errorType, errorMessage, url = null) {
    try {
      trackError(errorType, errorMessage, url);
    } catch (error) {
      console.log('Analytics tracking failed:', error.message);
    }
  }
}

export default PDFExportService;