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
    this.margin = 25; // Increased margin for premium feel
    this.contentWidth = this.pageWidth - (this.margin * 2);
    this.colors = {
      primary: [41, 128, 185], // More professional blue
      secondary: [44, 62, 80], // Darker text color
      accent: [26, 188, 156], // Refined teal
      success: [39, 174, 96], // Professional green
      warning: [230, 126, 34], // Warm orange
      danger: [192, 57, 43], // Deep red
      light: [248, 249, 250], // Subtle gray
      lightGray: [236, 240, 241], // Border color
      darkGray: [127, 140, 141] // Muted text
    };
    this.fonts = {
      heading: { size: 16, style: 'bold' },
      subheading: { size: 14, style: 'bold' },
      body: { size: 10, style: 'normal' },
      small: { size: 8, style: 'normal' },
      caption: { size: 7, style: 'normal' }
    };
  }

  generateReport(analysis, url) {
    try {
      this.doc = new jsPDF();
      this.currentY = 20;

      // Generate all sections with improved spacing
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
    // Premium gradient-like header with subtle design
    this.doc.setFillColor(...this.colors.primary);
    this.doc.rect(0, 0, this.pageWidth, 30, 'F');
    
    // Add subtle line accent
    this.doc.setFillColor(...this.colors.accent);
    this.doc.rect(0, 27, this.pageWidth, 3, 'F');
    
    // Main title with better typography
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(24);
    this.doc.setTextColor(255, 255, 255);
    this.doc.text('NEXTIN VISION', this.margin, 18);
    
    // Subtitle with improved spacing
    this.doc.setFontSize(11);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text('Comprehensive Website Analysis Report', this.margin, 24);
    
    this.currentY = 45; // More space after header
  }

  addTitle(url) {
    // Section with better visual hierarchy
    this.setFont(this.fonts.heading.size, this.fonts.heading.style, this.colors.secondary);
    this.doc.text('Website Performance Analysis', this.margin, this.currentY);
    this.currentY += 12; // Increased spacing
    
    // Add subtle separator line
    this.doc.setDrawColor(...this.colors.lightGray);
    this.doc.setLineWidth(0.5);
    this.doc.line(this.margin, this.currentY, this.pageWidth - this.margin, this.currentY);
    this.currentY += 8;
    
    // URL with better formatting
    this.setFont(this.fonts.body.size, 'normal', this.colors.darkGray);
    const displayUrl = url.length > 65 ? url.substring(0, 65) + '...' : url;
    this.doc.text(`Website: ${displayUrl}`, this.margin, this.currentY);
    this.currentY += 6;
    
    // Date with consistent formatting
    this.doc.text(`Generated: ${new Date().toLocaleString()}`, this.margin, this.currentY);
    this.currentY += 20; // More breathing room
  }

  addExecutiveSummary(analysis) {
    this.addSection('Executive Summary', '');
    
    const summaryText = `This comprehensive analysis evaluates your website across multiple critical dimensions including SEO optimization, user experience, content quality, conversion potential, technical performance, security & accessibility, mobile optimization, and social integration. The analysis covers ${analysis.analysis_metadata?.total_parameters_analyzed || 32} parameters to provide actionable insights for improvement.`;
    
    // Improved text formatting with better line height
    this.setFont(this.fonts.body.size, 'normal', this.colors.secondary);
    const lines = this.doc.splitTextToSize(summaryText, this.contentWidth);
    this.doc.text(lines, this.margin, this.currentY);
    this.currentY += lines.length * 5 + 15; // Better line spacing
  }

  addOverallScore(score) {
    const numScore = parseFloat(score) || 0;
    const centerX = this.pageWidth / 2;
    const centerY = this.currentY + 25;
    
    // Larger, more prominent score circle
    const color = numScore >= 8 ? this.colors.success : numScore >= 6 ? this.colors.warning : this.colors.danger;
    
    // Add subtle shadow effect
    this.doc.setFillColor(200, 200, 200);
    this.doc.circle(centerX + 1, centerY + 1, 20, 'F');
    
    // Main score circle
    this.doc.setFillColor(...color);
    this.doc.circle(centerX, centerY, 20, 'F');
    
    // Score text with better typography
    this.setFont(24, 'bold', [255, 255, 255]);
    const scoreText = numScore.toFixed(1);
    const textWidth = this.doc.getTextWidth(scoreText);
    this.doc.text(scoreText, centerX - (textWidth / 2), centerY + 4);
    
    // "/10" with refined positioning
    this.setFont(10, 'normal', [255, 255, 255]);
    this.doc.text('/10', centerX + 12, centerY + 4);
    
    // Label with premium typography
    this.setFont(this.fonts.subheading.size, 'bold', this.colors.secondary);
    const labelText = 'Overall Score';
    const labelWidth = this.doc.getTextWidth(labelText);
    this.doc.text(labelText, centerX - (labelWidth / 2), centerY + 35);
    
    this.currentY += 70; // Increased space after score
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
    if (this.currentY > 240) this.addPage();

    // Premium category header with better design
    this.doc.setFillColor(...this.colors.primary);
    this.doc.rect(this.margin, this.currentY - 2, this.contentWidth, 14, 'F');
    
    // Add subtle accent line
    this.doc.setFillColor(...this.colors.accent);
    this.doc.rect(this.margin, this.currentY - 2, 4, 14, 'F');
    
    this.setFont(this.fonts.subheading.size, 'bold', [255, 255, 255]);
    this.doc.text(`${categoryTitle}`, this.margin + 8, this.currentY + 7);
    
    // Score badge with better positioning
    const scoreText = `${score}/10`;
    const badgeWidth = this.doc.getTextWidth(scoreText) + 8;
    this.doc.setFillColor(...this.colors.accent);
    this.doc.rect(this.pageWidth - this.margin - badgeWidth, this.currentY - 2, badgeWidth, 14, 'F');
    this.setFont(this.fonts.body.size, 'bold', [255, 255, 255]);
    this.doc.text(scoreText, this.pageWidth - this.margin - badgeWidth + 4, this.currentY + 7);
    
    this.currentY += 20; // Increased spacing after header

    // Sub-scores with improved layout
    if (categoryData && typeof categoryData === 'object') {
      const subScores = Object.entries(categoryData).filter(([key, value]) => 
        !['issues', 'recommendations'].includes(key) && typeof value === 'string' && !isNaN(parseFloat(value))
      );

      if (subScores.length > 0) {
        this.setFont(this.fonts.body.size, 'bold', this.colors.secondary);
        this.doc.text('Sub-category Scores:', this.margin, this.currentY);
        this.currentY += 8;

        subScores.forEach(([key, value]) => {
          const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
          this.setFont(this.fonts.small.size, 'normal', this.colors.darkGray);
          this.doc.text(`• ${label}:`, this.margin + 8, this.currentY);
          
          // Score with color coding
          const numValue = parseFloat(value);
          const scoreColor = numValue >= 7 ? this.colors.success : numValue >= 5 ? this.colors.warning : this.colors.danger;
          this.setFont(this.fonts.small.size, 'bold', scoreColor);
          this.doc.text(`${value}/10`, this.margin + 80, this.currentY);
          this.currentY += 5;
        });
        this.currentY += 8;
      }

      // Issues with premium styling
      if (categoryData.issues && categoryData.issues.length > 0) {
        this.setFont(this.fonts.body.size, 'bold', this.colors.danger);
        this.doc.text('⚠ Issues Identified:', this.margin, this.currentY);
        this.currentY += 8;

        categoryData.issues.forEach(issue => {
          if (this.currentY > 260) this.addPage();
          this.setFont(this.fonts.small.size, 'normal', this.colors.secondary);
          const lines = this.doc.splitTextToSize(`• ${issue}`, this.contentWidth - 15);
          this.doc.text(lines, this.margin + 8, this.currentY);
          this.currentY += lines.length * 4 + 3;
        });
        this.currentY += 8;
      }

      // Recommendations with premium styling
      if (categoryData.recommendations && categoryData.recommendations.length > 0) {
        this.setFont(this.fonts.body.size, 'bold', this.colors.success);
        this.doc.text('✓ Recommendations:', this.margin, this.currentY);
        this.currentY += 8;

        categoryData.recommendations.forEach(rec => {
          if (this.currentY > 260) this.addPage();
          this.setFont(this.fonts.small.size, 'normal', this.colors.secondary);
          const lines = this.doc.splitTextToSize(`• ${rec}`, this.contentWidth - 15);
          this.doc.text(lines, this.margin + 8, this.currentY);
          this.currentY += lines.length * 4 + 3;
        });
        this.currentY += 8;
      }
    }

    this.currentY += 12; // More space between categories
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

    this.addSection('Key Insights', '💡');
    this.addBulletList(analysis.key_insights, this.colors.primary);
  }

  addPriorityActions(analysis) {
    if (!analysis.priority_actions || analysis.priority_actions.length === 0) return;

    this.addSection('Priority Actions', '🎯');
    this.addNumberedList(analysis.priority_actions, this.colors.accent);
  }

  addCompetitiveAdvantages(analysis) {
    if (!analysis.competitive_advantages || analysis.competitive_advantages.length === 0) return;

    this.addSection('Competitive Advantages', '🏆');
    this.addBulletList(analysis.competitive_advantages, this.colors.success);
  }

  addRiskFactors(analysis) {
    if (!analysis.risk_factors || analysis.risk_factors.length === 0) return;

    this.addSection('Risk Factors', '⚠️');
    this.addBulletList(analysis.risk_factors, this.colors.danger);
  }

  addRecommendationsSummary(analysis) {
    this.addSection('Implementation Timeline', '📅');
    
    const timelineText = `Based on the analysis, we recommend implementing changes in the following order:

1. Immediate (1-2 weeks): Address critical security and technical issues
2. Short-term (1-2 months): Improve SEO fundamentals and user experience
3. Medium-term (3-6 months): Enhance content quality and conversion optimization
4. Long-term (6+ months): Advanced features and continuous optimization

Focus on high-impact, low-effort improvements first to maximize ROI.`;

    this.setFont(this.fonts.body.size, 'normal', this.colors.secondary);
    const lines = this.doc.splitTextToSize(timelineText.trim(), this.contentWidth);
    this.doc.text(lines, this.margin, this.currentY);
    this.currentY += lines.length * 4 + 15;
  }

  addBulletList(items, color = this.colors.secondary) {
    this.setFont(this.fonts.body.size, 'normal', color);
    items.forEach(item => {
      if (this.currentY > 260) this.addPage();
      const lines = this.doc.splitTextToSize(`• ${item}`, this.contentWidth - 10);
      this.doc.text(lines, this.margin + 5, this.currentY);
      this.currentY += lines.length * 4 + 4; // Better line spacing
    });
    this.currentY += 10;
  }

  addNumberedList(items, color = this.colors.secondary) {
    this.setFont(this.fonts.body.size, 'normal', color);
    items.forEach((item, index) => {
      if (this.currentY > 260) this.addPage();
      const lines = this.doc.splitTextToSize(`${index + 1}. ${item}`, this.contentWidth - 15);
      this.doc.text(lines, this.margin + 5, this.currentY);
      this.currentY += lines.length * 4 + 4; // Better line spacing
    });
    this.currentY += 10;
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
            fontSize: 11,
            fontStyle: 'bold',
            halign: 'left',
            cellPadding: 5
          },
          bodyStyles: {
            fontSize: 10,
            cellPadding: 5,
            lineColor: this.colors.lightGray,
            lineWidth: 0.5
          },
          alternateRowStyles: {
            fillColor: this.colors.light
          },
          margin: { left: this.margin, right: this.margin },
          styles: {
            cellPadding: 5,
            fontSize: 10,
            lineColor: this.colors.lightGray,
            lineWidth: 0.5
          }
        });
        this.currentY = this.doc.lastAutoTable.finalY + 20;
      } catch (error) {
        console.warn('AutoTable failed, using fallback:', error);
        this.addFallbackTable(headers, rows);
      }
    } else {
      this.addFallbackTable(headers, rows);
    }
  }

  addFallbackTable(headers, rows) {
    const cellHeight = 8; // Increased cell height
    const colWidth = this.contentWidth / headers.length;

    // Header with premium styling
    this.doc.setFillColor(...this.colors.primary);
    this.doc.rect(this.margin, this.currentY, this.contentWidth, cellHeight, 'F');
    this.setFont(11, 'bold', [255, 255, 255]);
    
    headers.forEach((header, index) => {
      this.doc.text(header, this.margin + (index * colWidth) + 4, this.currentY + 5.5);
    });
    this.currentY += cellHeight;

    // Rows with better styling
    this.setFont(this.fonts.body.size, 'normal', this.colors.secondary);
    rows.forEach((row, rowIndex) => {
      if (this.currentY > 260) this.addPage();
      
      const bgColor = rowIndex % 2 === 0 ? this.colors.light : [255, 255, 255];
      this.doc.setFillColor(...bgColor);
      this.doc.rect(this.margin, this.currentY, this.contentWidth, cellHeight, 'F');
      
      // Add subtle border
      this.doc.setDrawColor(...this.colors.lightGray);
      this.doc.setLineWidth(0.2);
      this.doc.rect(this.margin, this.currentY, this.contentWidth, cellHeight, 'S');
      
      row.forEach((cell, colIndex) => {
        // Enhanced color coding for scores
        if (colIndex === 1 && cell.includes('/10')) {
          const score = parseFloat(cell);
          const scoreColor = score >= 7 ? this.colors.success : score >= 5 ? this.colors.warning : this.colors.danger;
          this.setFont(this.fonts.body.size, 'bold', scoreColor);
        } else {
          this.setFont(this.fonts.body.size, 'normal', this.colors.secondary);
        }
        
        const cellText = cell.length > 23 ? cell.substring(0, 23) + '...' : cell;
        this.doc.text(cellText, this.margin + (colIndex * colWidth) + 4, this.currentY + 5.5);
      });
      
      this.currentY += cellHeight;
    });
    
    this.currentY += 15; // More space after table
  }

  addSection(title, icon) {
    if (this.currentY > 240) this.addPage();
    
    // Premium section header
    this.doc.setFillColor(...this.colors.primary);
    this.doc.rect(this.margin, this.currentY - 3, this.contentWidth, 12, 'F');
    
    // Add accent line
    this.doc.setFillColor(...this.colors.accent);
    this.doc.rect(this.margin, this.currentY - 3, 3, 12, 'F');
    
    this.setFont(this.fonts.subheading.size, 'bold', [255, 255, 255]);
    const titleText = icon ? `${icon} ${title}` : title;
    this.doc.text(titleText, this.margin + 6, this.currentY + 5);
    this.currentY += 18; // Increased spacing after section header
  }

  addFooters() {
    const pageCount = this.doc.internal.getNumberOfPages();
    
    for (let i = 1; i <= pageCount; i++) {
      this.doc.setPage(i);
      
      // Premium footer design
      this.doc.setDrawColor(...this.colors.lightGray);
      this.doc.setLineWidth(0.5);
      this.doc.line(this.margin, 275, this.pageWidth - this.margin, 275);
      
      // Footer content with better typography
      this.setFont(this.fonts.small.size, 'normal', this.colors.darkGray);
      this.doc.text('NEXTIN VISION - Comprehensive Website Analysis', this.margin, 285);
      
      this.setFont(this.fonts.small.size, 'bold', this.colors.primary);
      this.doc.text(`Page ${i} of ${pageCount}`, this.pageWidth - 35, 285);
      
      this.setFont(this.fonts.small.size, 'normal', this.colors.darkGray);
      const dateText = new Date().toLocaleDateString();
      const dateWidth = this.doc.getTextWidth(dateText);
      this.doc.text(dateText, (this.pageWidth - dateWidth) / 2, 285);
    }
  }

  addPage() {
    this.doc.addPage();
    this.currentY = 40; // Consistent top margin
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