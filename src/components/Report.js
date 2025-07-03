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
    if (numScore >= 8) return 'text-emerald-600';
    if (numScore >= 6) return 'text-amber-600';
    if (numScore >= 4) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreColorBg = (score) => {
    const numScore = parseInt(score);
    if (numScore >= 8) return 'text-emerald-600 bg-emerald-50';
    if (numScore >= 6) return 'text-amber-600 bg-amber-50';
    if (numScore >= 4) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const getScoreBgColor = (score) => {
    const numScore = parseInt(score);
    if (numScore >= 8) return 'bg-emerald-50 border-emerald-200';
    if (numScore >= 6) return 'bg-amber-50 border-amber-200';
    if (numScore >= 4) return 'bg-orange-50 border-orange-200';
    return 'bg-red-50 border-red-200';
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all duration-200 overflow-hidden">
      <div 
        className="p-6 cursor-pointer"
        onClick={() => setExpandedCategory(expandedCategory === category.key ? null : category.key)}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-12 h-12 bg-gray-50 rounded-lg">
              <span className="text-2xl">{category.icon}</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{category.title}</h3>
              <p className="text-sm text-gray-500">Click to expand details</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className={`px-4 py-2 rounded-lg border-2 ${getScoreBgColor(categoryData)}`}>
              <span className={`text-2xl font-bold ${getScoreColor(categoryData)}`}>
                {categoryData}
              </span>
            </div>
            <div className="text-gray-400 text-xl">
              {expandedCategory === category.key ? '▼' : '▶'}
            </div>
          </div>
        </div>
      </div>

      {expandedCategory === category.key && detailData && (
        <div className="px-6 pb-6 border-t border-gray-100 bg-gray-50/50">
          <div className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {Object.entries(detailData)
                .filter(([key, value]) => key !== 'issues' && key !== 'recommendations' && typeof value === 'string')
                .map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center py-2 px-3 bg-white rounded-lg border border-gray-100">
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {key.replace(/_/g, ' ')}
                    </span>
                    <span className={`text-sm font-semibold ${getScoreColor(value)}`}>
                      {value}
                    </span>
                  </div>
                ))
              }
            </div>

            {detailData.issues && detailData.issues.length > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold text-red-700 mb-3 text-sm uppercase tracking-wide">Top Issues</h4>
                <div className="space-y-2">
                  {detailData.issues.slice(0, 2).map((issue, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg border border-red-100">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm text-red-800 leading-relaxed">{issue}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {detailData.recommendations && detailData.recommendations.length > 0 && (
              <div>
                <h4 className="font-semibold text-emerald-700 mb-3 text-sm uppercase tracking-wide">Key Recommendations</h4>
                <div className="space-y-2">
                  {detailData.recommendations.slice(0, 2).map((rec, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm text-emerald-800 leading-relaxed">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header Section with Export Buttons */}
      <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-2xl shadow-sm p-8 mb-8 border border-gray-200">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-6 lg:space-y-0 mb-8">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Comprehensive Analysis Report</h1>
            <div className="space-y-2">
              <div className="flex items-center text-base text-gray-600">
                <span className="font-medium">Website:</span>
                <span className="ml-2 text-gray-800 break-all">
                  {url.length > 60 ? `${url.substring(0, 60)}...` : url}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span>Generated: {new Date().toLocaleString()}</span>
                </span>
                <span className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>Completeness: {getAnalysisCompleteness()}%</span>
                </span>
                <span className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  <span>Parameters: {analysis.analysis_metadata?.total_parameters_analyzed || 32}</span>
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={exportJSONReport}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg text-sm font-medium flex items-center space-x-2"
            >
              <span>📄</span>
              <span>Export JSON</span>
            </button>
            <button
              onClick={exportPDFReport}
              disabled={isExporting}
              className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-md hover:shadow-lg text-sm font-medium disabled:opacity-50 flex items-center space-x-2"
            >
              <span>{isExporting ? '⏳' : '📋'}</span>
              <span>{isExporting ? 'Generating...' : 'Export PDF'}</span>
            </button>
          </div>
        </div>

        {/* Overall Score Display */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-32 h-32 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-600 text-white mb-6 shadow-lg">
            <div className="text-center">
              <div className="text-4xl font-bold">{analysis.overall_score}</div>
              <div className="text-sm opacity-90">/10</div>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Overall Performance Score</h2>
          <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">
            This comprehensive analysis evaluates your website across multiple critical dimensions including SEO optimization, 
            user experience, content quality, conversion potential, technical performance, security & accessibility, 
            mobile optimization, and social integration.
          </p>
        </div>
      </div>

      {/* Category Scores Grid */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Category Performance</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
      </div>

      {/* Technical Metrics Section */}
      {analysis.technical_metrics && (
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8 border border-gray-100">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mr-4">
              <span className="text-2xl">⚙️</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Technical Metrics</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-100">
              <div className="text-2xl font-bold text-blue-600 mb-2">
                {Math.round(analysis.technical_metrics.page_size / 1000)}KB
              </div>
              <div className="text-sm font-medium text-blue-800">Page Size</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-100">
              <div className="text-2xl font-bold text-purple-600 mb-2">
                {analysis.technical_metrics.image_count || 'N/A'}
              </div>
              <div className="text-sm font-medium text-purple-800">Images</div>
            </div>
            <div className="text-center p-4 bg-emerald-50 rounded-xl border border-emerald-100">
              <div className="text-2xl font-bold text-emerald-600 mb-2">
                {analysis.technical_metrics.link_count || 'N/A'}
              </div>
              <div className="text-sm font-medium text-emerald-800">Links</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div className={`text-2xl font-bold mb-2 ${analysis.technical_metrics.is_https ? 'text-emerald-600' : 'text-red-600'}`}>
                {analysis.technical_metrics.is_https ? '✓' : '✗'}
              </div>
              <div className="text-sm font-medium text-gray-700">HTTPS</div>
            </div>
            <div className="text-center p-4 bg-amber-50 rounded-xl border border-amber-100">
              <div className="text-2xl font-bold text-amber-600 mb-2">
                {analysis.technical_metrics.load_time ? `${analysis.technical_metrics.load_time}ms` : 'N/A'}
              </div>
              <div className="text-sm font-medium text-amber-800">Load Time</div>
            </div>
            <div className="text-center p-4 bg-indigo-50 rounded-xl border border-indigo-100">
              <div className="text-2xl font-bold text-indigo-600 mb-2">
                {analysis.technical_metrics.response_code || 'N/A'}
              </div>
              <div className="text-sm font-medium text-indigo-800">Status Code</div>
            </div>
          </div>
        </div>
      )}

      {/* Key Insights Section */}
      {analysis.key_insights && analysis.key_insights.length > 0 && (
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 mb-8 border border-blue-200">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mr-4">
              <span className="text-white text-2xl">💡</span>
            </div>
            <h3 className="text-2xl font-bold text-blue-900">Key Insights</h3>
          </div>
          <div className="space-y-4">
            {analysis.key_insights.map((insight, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 bg-white/70 rounded-xl border border-blue-200">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {index + 1}
                </div>
                <p className="text-blue-900 leading-relaxed flex-1">{insight}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Priority Actions Section */}
      {analysis.priority_actions && analysis.priority_actions.length > 0 && (
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-8 mb-8 border border-orange-200">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mr-4">
              <span className="text-white text-2xl">🎯</span>
            </div>
            <h3 className="text-2xl font-bold text-orange-900">Priority Actions</h3>
          </div>
          <div className="space-y-4">
            {analysis.priority_actions.map((action, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 bg-white/70 rounded-xl border border-orange-200">
                <div className="w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {index + 1}
                </div>
                <p className="text-orange-900 leading-relaxed flex-1">{action}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Competitive Advantages Section */}
      {analysis.competitive_advantages && analysis.competitive_advantages.length > 0 && (
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-8 mb-8 border border-emerald-200">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center mr-4">
              <span className="text-white text-2xl">🏆</span>
            </div>
            <h3 className="text-2xl font-bold text-emerald-900">Competitive Advantages</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analysis.competitive_advantages.map((advantage, index) => (
              <div key={index} className="flex items-start space-x-3 p-4 bg-white/70 rounded-xl border border-emerald-200">
                <div className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  ✓
                </div>
                <p className="text-emerald-900 leading-relaxed flex-1">{advantage}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Risk Factors Section */}
      {analysis.risk_factors && analysis.risk_factors.length > 0 && (
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-8 mb-8 border border-red-200">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center mr-4">
              <span className="text-white text-2xl">⚠️</span>
            </div>
            <h3 className="text-2xl font-bold text-red-900">Risk Factors</h3>
          </div>
          <div className="space-y-4">
            {analysis.risk_factors.map((risk, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 bg-white/70 rounded-xl border border-red-200">
                <div className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  !
                </div>
                <p className="text-red-900 leading-relaxed flex-1">{risk}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Implementation Timeline Section */}
      <div className="bg-white rounded-2xl shadow-sm p-8 mb-8 border border-gray-100">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mr-4">
            <span className="text-2xl">📅</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">Implementation Timeline</h3>
        </div>
        <div className="space-y-6">
          <div className="p-6 bg-gradient-to-r from-red-50 to-red-100 rounded-xl border border-red-200">
            <div className="flex items-center mb-3">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
              <h4 className="text-lg font-bold text-red-800">Immediate (1-2 weeks)</h4>
            </div>
            <p className="text-red-700 leading-relaxed">Address critical security and technical issues that could impact site functionality or user safety.</p>
          </div>
          <div className="p-6 bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl border border-amber-200">
            <div className="flex items-center mb-3">
              <div className="w-3 h-3 bg-amber-500 rounded-full mr-3"></div>
              <h4 className="text-lg font-bold text-amber-800">Short-term (1-2 months)</h4>
            </div>
            <p className="text-amber-700 leading-relaxed">Improve SEO fundamentals and user experience to increase visibility and engagement.</p>
          </div>
          <div className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
            <div className="flex items-center mb-3">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
              <h4 className="text-lg font-bold text-blue-800">Medium-term (3-6 months)</h4>
            </div>
            <p className="text-blue-700 leading-relaxed">Enhance content quality and conversion optimization to drive better business results.</p>
          </div>
          <div className="p-6 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200">
            <div className="flex items-center mb-3">
              <div className="w-3 h-3 bg-emerald-500 rounded-full mr-3"></div>
              <h4 className="text-lg font-bold text-emerald-800">Long-term (6+ months)</h4>
            </div>
            <p className="text-emerald-700 leading-relaxed">Implement advanced features and establish continuous optimization processes.</p>
          </div>
        </div>
        <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm">💡</span>
            </div>
            <div>
              <p className="text-gray-800 font-semibold mb-1">Pro Tip</p>
              <p className="text-gray-700 text-sm leading-relaxed">Focus on high-impact, low-effort improvements first to maximize return on investment and build momentum.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Metadata */}
      {analysis.analysis_metadata && (
        <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-2xl p-6 border border-gray-200">
          <h4 className="text-lg font-bold text-gray-800 mb-4">Analysis Metadata</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white rounded-xl border border-gray-100">
              <div className="text-xl font-bold text-blue-600 mb-2">
                {analysis.analysis_metadata.total_parameters_analyzed || 'N/A'}
              </div>
              <div className="text-sm font-medium text-gray-700">Parameters Analyzed</div>
            </div>
            <div className="text-center p-4 bg-white rounded-xl border border-gray-100">
              <div className="text-xl font-bold text-purple-600 mb-2">2.0</div>
              <div className="text-sm font-medium text-gray-700">Analysis Version</div>
            </div>
            <div className="text-center p-4 bg-white rounded-xl border border-gray-100">
              <div className="text-xl font-bold text-emerald-600 mb-2">Complete</div>
              <div className="text-sm font-medium text-gray-700">Export Type</div>
            </div>
            <div className="text-center p-4 bg-white rounded-xl border border-gray-100">
              <div className="text-xl font-bold text-orange-600 mb-2">
                {new Date().toLocaleDateString()}
              </div>
              <div className="text-sm font-medium text-gray-700">Report Date</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Report;