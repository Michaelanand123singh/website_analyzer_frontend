import React, { useState } from 'react';
import PDFExportService from '../services/pdfExportService';

const Report = ({ analysis, url }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState(null);

  if (!analysis) return null;

  const exportJSONReport = () => {
    const reportData = {
      url,
      timestamp: new Date().toISOString(),
      analysis,
      metadata: {
        version: '2.0',
        exportType: 'complete',
        parameters_analyzed: analysis.analysis_metadata?.total_parameters_analyzed || 32
      }
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: 'application/json'
    });
    
    const url_download = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url_download;
    a.download = `website-analysis-complete-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url_download);
  };

  const exportPDFReport = async () => {
    setIsExporting(true);
    
    try {
      if (!analysis || !url) {
        throw new Error('Missing analysis data or URL');
      }

      console.log('Starting comprehensive PDF export...', { 
        hasDetailedAnalysis: !!analysis.detailed_analysis,
        hasTechnicalMetrics: !!analysis.technical_metrics,
        hasKeyInsights: !!analysis.key_insights,
        hasPriorityActions: !!analysis.priority_actions,
        analysis, 
        url 
      });
      
      const pdfService = new PDFExportService();
      console.log('PDF Service created');
      
      const doc = pdfService.generateReport(analysis, url);
      console.log('Comprehensive PDF Report generated');
      
      const filename = `nextin-vision-complete-analysis-${new Date().toISOString().split('T')[0]}.pdf`;
      
      pdfService.downloadPDF(filename);
      console.log('PDF download initiated');
      
      console.log('Complete PDF report exported successfully!');
      
    } catch (error) {
      console.error('Detailed error exporting PDF:', {
        message: error.message,
        stack: error.stack,
        name: error.name,
        analysis: analysis,
        url: url
      });
      
      if (error.message.includes('autoTable')) {
        alert('PDF export failed: jsPDF autoTable plugin not properly loaded. Please check your dependencies.');
      } else if (error.message.includes('jsPDF')) {
        alert('PDF export failed: jsPDF library not properly loaded. Please check your dependencies.');
      } else {
        alert(`Error exporting PDF report: ${error.message}. Please check the console for more details.`);
      }
    } finally {
      setIsExporting(false);
    }
  };

  const getScoreColor = (score) => {
    const numScore = parseInt(score);
    if (numScore >= 8) return 'text-green-600';
    if (numScore >= 6) return 'text-yellow-600';
    if (numScore >= 4) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreColorBg = (score) => {
    const numScore = parseInt(score);
    if (numScore >= 8) return 'text-green-600 bg-green-100';
    if (numScore >= 6) return 'text-yellow-600 bg-yellow-100';
    if (numScore >= 4) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreText = (score) => {
    const numScore = parseInt(score);
    if (numScore >= 8) return 'Excellent';
    if (numScore >= 6) return 'Good';
    if (numScore >= 4) return 'Average';
    return 'Poor';
  };

  const categories = [
    { key: 'seo', title: 'SEO', icon: '🔍' },
    { key: 'user_experience', title: 'User Experience', icon: '👤' },
    { key: 'content_quality', title: 'Content Quality', icon: '📝' },
    { key: 'conversion_optimization', title: 'Conversion', icon: '🎯' },
    { key: 'technical_performance', title: 'Technical', icon: '⚙️' },
    { key: 'security_accessibility', title: 'Security & A11y', icon: '🔒' },
    { key: 'mobile_optimization', title: 'Mobile', icon: '📱' },
    { key: 'social_integration', title: 'Social', icon: '📢' }
  ];

  // Count analysis completeness for user feedback
  const getAnalysisCompleteness = () => {
    let sections = 0;
    let totalSections = 8; // Base sections
    
    if (analysis.category_scores) sections++;
    if (analysis.detailed_analysis) sections++;
    if (analysis.technical_metrics) sections++;
    if (analysis.key_insights?.length > 0) sections++;
    if (analysis.priority_actions?.length > 0) sections++;
    if (analysis.competitive_advantages?.length > 0) sections++;
    if (analysis.risk_factors?.length > 0) sections++;
    if (analysis.overall_score) sections++;

    return Math.round((sections / totalSections) * 100);
  };

  const CategoryCard = ({ category, categoryData, detailData }) => (
    <div className="bg-white rounded-lg shadow-md border hover:shadow-lg transition-shadow">
      <div 
        className="p-4 cursor-pointer"
        onClick={() => setExpandedCategory(expandedCategory === category.key ? null : category.key)}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-2xl mr-3">{category.icon}</span>
            <h3 className="text-lg font-semibold text-gray-900">{category.title}</h3>
          </div>
          <div className="flex items-center">
            <span className={`text-2xl font-bold mr-2 ${getScoreColor(categoryData)}`}>
              {categoryData}
            </span>
            <span className="text-gray-400">
              {expandedCategory === category.key ? '▼' : '▶'}
            </span>
          </div>
        </div>
      </div>

      {expandedCategory === category.key && detailData && (
        <div className="px-4 pb-4 border-t bg-gray-50">
          <div className="grid grid-cols-2 gap-3 mt-3 mb-4">
            {Object.entries(detailData)
              .filter(([key, value]) => key !== 'issues' && key !== 'recommendations' && typeof value === 'string')
              .map(([key, value]) => (
                <div key={key} className="flex justify-between text-sm">
                  <span className="text-gray-600 capitalize">
                    {key.replace(/_/g, ' ')}:
                  </span>
                  <span className={`font-medium ${getScoreColor(value)}`}>
                    {value}
                  </span>
                </div>
              ))
            }
          </div>

          {detailData.issues && detailData.issues.length > 0 && (
            <div className="mb-3">
              <h4 className="font-medium text-red-600 mb-1 text-sm">Top Issues:</h4>
              <ul className="text-xs text-gray-600 space-y-1">
                {detailData.issues.slice(0, 2).map((issue, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-red-500 mr-1">•</span>
                    {issue}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {detailData.recommendations && detailData.recommendations.length > 0 && (
            <div>
              <h4 className="font-medium text-green-600 mb-1 text-sm">Key Recommendations:</h4>
              <ul className="text-xs text-gray-600 space-y-1">
                {detailData.recommendations.slice(0, 2).map((rec, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-500 mr-1">•</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header Section with Export Buttons */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6 border">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Comprehensive Analysis Report</h2>
            <p className="text-sm text-gray-500">
              Website: {url.length > 60 ? `${url.substring(0, 60)}...` : url}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Generated: {new Date().toLocaleString()} | 
              Analysis Completeness: {getAnalysisCompleteness()}% | 
              Parameters Analyzed: {analysis.analysis_metadata?.total_parameters_analyzed || 32}
            </p>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={exportJSONReport}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              📄 Export JSON
            </button>
            <button
              onClick={exportPDFReport}
              disabled={isExporting}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm disabled:opacity-50"
            >
              {isExporting ? '⏳ Generating...' : '📋 Export PDF'}
            </button>
          </div>
        </div>

        {/* Overall Score Display */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white mb-3">
            <div className="text-center">
              <div className="text-3xl font-bold">{analysis.overall_score}</div>
              <div className="text-xs opacity-80">/10</div>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Overall Performance Score</h3>
          <p className="text-sm text-gray-600 max-w-2xl mx-auto mt-2">
            This comprehensive analysis evaluates your website across multiple critical dimensions including SEO optimization, 
            user experience, content quality, conversion potential, technical performance, security & accessibility, 
            mobile optimization, and social integration.
          </p>
        </div>
      </div>

      {/* Category Scores Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {categories.map(category => {
          const categoryScore = analysis.category_scores?.[category.key] || 'N/A';
          const detailData = analysis.detailed_analysis?.[category.key];
          
          return (
            <CategoryCard
              key={category.key}
              category={category}
              categoryData={categoryScore}
              detailData={detailData}
            />
          );
        })}
      </div>

      {/* Technical Metrics Section */}
      {analysis.technical_metrics && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 border">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <span className="text-2xl mr-3">⚙️</span>
            Technical Metrics
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-lg font-bold text-blue-600">
                {Math.round(analysis.technical_metrics.page_size / 1000)}KB
              </div>
              <div className="text-xs text-gray-600">Page Size</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-lg font-bold text-purple-600">
                {analysis.technical_metrics.image_count || 'N/A'}
              </div>
              <div className="text-xs text-gray-600">Images</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-lg font-bold text-green-600">
                {analysis.technical_metrics.link_count || 'N/A'}
              </div>
              <div className="text-xs text-gray-600">Links</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className={`text-lg font-bold ${analysis.technical_metrics.is_https ? 'text-green-600' : 'text-red-600'}`}>
                {analysis.technical_metrics.is_https ? '✓' : '✗'}
              </div>
              <div className="text-xs text-gray-600">HTTPS</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-lg font-bold text-yellow-600">
                {analysis.technical_metrics.load_time ? `${analysis.technical_metrics.load_time}ms` : 'N/A'}
              </div>
              <div className="text-xs text-gray-600">Load Time</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-lg font-bold text-indigo-600">
                {analysis.technical_metrics.response_code || 'N/A'}
              </div>
              <div className="text-xs text-gray-600">Status Code</div>
            </div>
          </div>
        </div>
      )}

      {/* Key Insights Section */}
      {analysis.key_insights && analysis.key_insights.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 border">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <span className="text-2xl mr-3">💡</span>
            Key Insights
          </h3>
          <div className="space-y-3">
            {analysis.key_insights.map((insight, index) => (
              <div key={index} className="flex items-start p-3 bg-blue-50 rounded-lg">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                  {index + 1}
                </div>
                <p className="text-gray-700 text-sm flex-1">{insight}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Priority Actions Section */}
      {analysis.priority_actions && analysis.priority_actions.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 border">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <span className="text-2xl mr-3">🎯</span>
            Priority Actions
          </h3>
          <div className="space-y-3">
            {analysis.priority_actions.map((action, index) => (
              <div key={index} className="flex items-start p-3 bg-orange-50 rounded-lg">
                <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                  {index + 1}
                </div>
                <p className="text-gray-700 text-sm flex-1">{action}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Competitive Advantages Section */}
      {analysis.competitive_advantages && analysis.competitive_advantages.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 border">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <span className="text-2xl mr-3">🏆</span>
            Competitive Advantages
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {analysis.competitive_advantages.map((advantage, index) => (
              <div key={index} className="flex items-start p-3 bg-green-50 rounded-lg">
                <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                  ✓
                </div>
                <p className="text-gray-700 text-sm flex-1">{advantage}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Risk Factors Section */}
      {analysis.risk_factors && analysis.risk_factors.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 border">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <span className="text-2xl mr-3">⚠️</span>
            Risk Factors
          </h3>
          <div className="space-y-3">
            {analysis.risk_factors.map((risk, index) => (
              <div key={index} className="flex items-start p-3 bg-red-50 rounded-lg">
                <div className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                  !
                </div>
                <p className="text-gray-700 text-sm flex-1">{risk}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Implementation Timeline Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6 border">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <span className="text-2xl mr-3">📅</span>
          Implementation Timeline
        </h3>
        <div className="space-y-4">
          <div className="p-4 bg-red-50 rounded-lg border-l-4 border-red-400">
            <h4 className="font-semibold text-red-800 mb-2">Immediate (1-2 weeks)</h4>
            <p className="text-red-700 text-sm">Address critical security and technical issues</p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
            <h4 className="font-semibold text-yellow-800 mb-2">Short-term (1-2 months)</h4>
            <p className="text-yellow-700 text-sm">Improve SEO fundamentals and user experience</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
            <h4 className="font-semibold text-blue-800 mb-2">Medium-term (3-6 months)</h4>
            <p className="text-blue-700 text-sm">Enhance content quality and conversion optimization</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
            <h4 className="font-semibold text-green-800 mb-2">Long-term (6+ months)</h4>
            <p className="text-green-700 text-sm">Advanced features and continuous optimization</p>
          </div>
        </div>
        <div className="mt-4 p-3 bg-gray-100 rounded-lg">
          <p className="text-sm text-gray-700 font-medium">
            💡 <strong>Tip:</strong> Focus on high-impact, low-effort improvements first to maximize ROI.
          </p>
        </div>
      </div>

      {/* Analysis Metadata */}
      {analysis.analysis_metadata && (
        <div className="bg-gray-50 rounded-lg p-4 border">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Analysis Metadata</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-gray-600">
            <div>
              <span className="font-medium">Parameters Analyzed:</span> {analysis.analysis_metadata.total_parameters_analyzed || 'N/A'}
            </div>
            <div>
              <span className="font-medium">Analysis Version:</span> 2.0
            </div>
            <div>
              <span className="font-medium">Export Type:</span> Complete
            </div>
            <div>
              <span className="font-medium">Timestamp:</span> {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Report;