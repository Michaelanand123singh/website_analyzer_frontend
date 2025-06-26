import React, { useState } from 'react';
import PDFExportService from '../services/pdfExportService';

const Report = ({ analysis, url }) => {
  const [isExporting, setIsExporting] = useState(false);

  if (!analysis) return null;

  const exportJSONReport = () => {
    const reportData = {
      url,
      timestamp: new Date().toISOString(),
      analysis
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: 'application/json'
    });
    
    const url_download = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url_download;
    a.download = `website-analysis-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url_download);
  };

  const exportPDFReport = async () => {
    setIsExporting(true);
    
    try {
      // Add validation
      if (!analysis || !url) {
        throw new Error('Missing analysis data or URL');
      }

      console.log('Starting PDF export...', { analysis, url });
      
      const pdfService = new PDFExportService();
      console.log('PDF Service created');
      
      const doc = pdfService.generateReport(analysis, url);
      console.log('PDF Report generated');
      
      const filename = `nextin-vision-analysis-${new Date().toISOString().split('T')[0]}.pdf`;
      
      // Use the downloadPDF method from the service
      pdfService.downloadPDF(filename);
      console.log('PDF download initiated');
      
      // Optional: Show success message
      console.log('PDF report exported successfully!');
      
    } catch (error) {
      console.error('Detailed error exporting PDF:', {
        message: error.message,
        stack: error.stack,
        name: error.name,
        analysis: analysis,
        url: url
      });
      
      // More detailed error information
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
    if (score >= 8) return 'text-green-600 bg-green-100';
    if (score >= 6) return 'text-yellow-600 bg-yellow-100';
    if (score >= 4) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreText = (score) => {
    if (score >= 8) return 'Excellent';
    if (score >= 6) return 'Good';
    if (score >= 4) return 'Average';
    return 'Poor';
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6 border">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Detailed Report</h2>
            <p className="text-sm text-gray-500 mt-1">Powered by NEXTIN VISION</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={exportJSONReport}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
            >
              📄 Export JSON
            </button>
            <button
              onClick={exportPDFReport}
              disabled={isExporting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isExporting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Exporting...
                </>
              ) : (
                <>
                  📑 Export PDF
                </>
              )}
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Website Overview */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Website Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600 font-medium">Website URL</p>
                <p className="text-gray-800 break-all">{url}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Analysis Date</p>
                <p className="text-gray-800">{new Date().toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Overall Score</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${getScoreColor(analysis.overall_score)}`}>
                    {analysis.overall_score}/10
                  </span>
                  <span className="text-sm text-gray-600">
                    ({getScoreText(analysis.overall_score)})
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Analysis Breakdown */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Analysis Breakdown</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(analysis).map(([key, value]) => {
                if (key === 'overall_score' || key === 'key_insights' || key === 'priority_actions') return null;
                
                const score = value.score || 0;
                const categoryName = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                
                return (
                  <div key={key} className="bg-white border border-gray-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                    <h4 className="font-medium text-gray-900 mb-2">{categoryName}</h4>
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 rounded text-sm font-semibold ${getScoreColor(score)}`}>
                        {score}/10
                      </span>
                      <span className="text-xs text-gray-500">
                        {getScoreText(score)}
                      </span>
                    </div>
                    {/* Progress bar */}
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          score >= 8 ? 'bg-green-500' : 
                          score >= 6 ? 'bg-yellow-500' : 
                          score >= 4 ? 'bg-orange-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${(score / 10) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Key Insights */}
          {analysis.key_insights && analysis.key_insights.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <ul className="space-y-2">
                  {analysis.key_insights.map((insight, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">•</span>
                      <span className="text-gray-700">{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Priority Actions */}
          {analysis.priority_actions && analysis.priority_actions.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Priority Actions</h3>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <ul className="space-y-2">
                  {analysis.priority_actions.map((action, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-amber-600 font-bold">{index + 1}.</span>
                      <span className="text-gray-700">{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Summary */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Executive Summary</h3>
            <p className="text-gray-700 leading-relaxed">
              This comprehensive analysis evaluates your website across five critical dimensions: 
              SEO optimization, user experience, content quality, conversion potential, and technical performance. 
              The overall score of <strong>{analysis.overall_score}/10</strong> indicates{' '}
              <strong>{getScoreText(analysis.overall_score).toLowerCase()}</strong> performance. 
              Focus on the priority actions above to achieve the maximum impact on your website's 
              effectiveness and business results.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;