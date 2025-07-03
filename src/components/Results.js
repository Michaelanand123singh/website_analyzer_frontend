import React, { useState } from 'react';

const Results = ({ analysis, url }) => {
  const [expandedCategory, setExpandedCategory] = useState(null);

  if (!analysis) return null;

  const getScoreColor = (score) => {
    const numScore = parseInt(score);
    if (numScore >= 8) return 'text-emerald-600';
    if (numScore >= 6) return 'text-amber-600';
    if (numScore >= 4) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score) => {
    const numScore = parseInt(score);
    if (numScore >= 8) return 'bg-emerald-50 border-emerald-200';
    if (numScore >= 6) return 'bg-amber-50 border-amber-200';
    if (numScore >= 4) return 'bg-orange-50 border-orange-200';
    return 'bg-red-50 border-red-200';
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
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-sm p-8 mb-8 border border-blue-100">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Website Analysis Report</h1>
            <div className="flex items-center text-base text-gray-600">
              <span className="font-medium">Analyzed URL: </span>
              <a href={url} target="_blank" rel="noopener noreferrer" 
                 className="text-blue-600 hover:text-blue-800 hover:underline ml-2 truncate max-w-md transition-colors">
                {url}
              </a>
            </div>
          </div>
          <div className="flex flex-col items-center lg:items-end space-y-2">
            <div className="text-sm font-medium text-gray-600 uppercase tracking-wide">Overall Score</div>
            <div className={`text-6xl font-bold ${getScoreColor(analysis.overall_score)}`}>
              {analysis.overall_score}
            </div>
            <div className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full border">
              {analysis.analysis_metadata?.total_parameters_analyzed || 32} parameters analyzed
            </div>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Category Analysis</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {categories.map((category) => (
            <CategoryCard
              key={category.key}
              category={category}
              categoryData={analysis.category_scores?.[category.key] || 'N/A'}
              detailData={analysis.detailed_analysis?.[category.key]}
            />
          ))}
        </div>
      </div>

      {/* Technical Metrics */}
      {analysis.technical_metrics && (
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8 border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Technical Metrics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-100">
              <div className="text-3xl font-bold text-blue-600 mb-2">{analysis.technical_metrics.image_count}</div>
              <div className="text-sm font-medium text-blue-800">Images</div>
            </div>
            <div className="text-center p-4 bg-emerald-50 rounded-xl border border-emerald-100">
              <div className="text-3xl font-bold text-emerald-600 mb-2">{analysis.technical_metrics.link_count}</div>
              <div className="text-sm font-medium text-emerald-800">Links</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-100">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {Math.round(analysis.technical_metrics.page_size / 1000)}K
              </div>
              <div className="text-sm font-medium text-purple-800">Page Size</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-xl border border-orange-100">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {analysis.technical_metrics.is_https ? '✓' : '✗'}
              </div>
              <div className="text-sm font-medium text-orange-800">HTTPS</div>
            </div>
          </div>
        </div>
      )}

      {/* Insights & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {analysis.key_insights && analysis.key_insights.length > 0 && (
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 border border-blue-200">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center mr-4">
                <span className="text-white text-xl">💡</span>
              </div>
              <h3 className="text-2xl font-bold text-blue-900">Key Insights</h3>
            </div>
            <div className="space-y-4">
              {analysis.key_insights.slice(0, 3).map((insight, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 bg-white/70 rounded-xl border border-blue-200">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-blue-900 text-sm leading-relaxed">{insight}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {analysis.priority_actions && analysis.priority_actions.length > 0 && (
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-8 border border-emerald-200">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center mr-4">
                <span className="text-white text-xl">🎯</span>
              </div>
              <h3 className="text-2xl font-bold text-emerald-900">Priority Actions</h3>
            </div>
            <div className="space-y-4">
              {analysis.priority_actions.slice(0, 3).map((action, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 bg-white/70 rounded-xl border border-emerald-200">
                  <div className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {index + 1}
                  </div>
                  <span className="text-emerald-900 text-sm leading-relaxed">{action}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Additional Insights */}
      {(analysis.competitive_advantages || analysis.risk_factors) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {analysis.competitive_advantages && analysis.competitive_advantages.length > 0 && (
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-8 border border-amber-200">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center mr-4">
                  <span className="text-white text-xl">⭐</span>
                </div>
                <h3 className="text-2xl font-bold text-amber-900">Competitive Advantages</h3>
              </div>
              <div className="space-y-3">
                {analysis.competitive_advantages.slice(0, 3).map((advantage, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 bg-white/70 rounded-xl border border-amber-200">
                    <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-amber-900 text-sm leading-relaxed">{advantage}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {analysis.risk_factors && analysis.risk_factors.length > 0 && (
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-8 border border-red-200">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center mr-4">
                  <span className="text-white text-xl">⚠️</span>
                </div>
                <h3 className="text-2xl font-bold text-red-900">Risk Factors</h3>
              </div>
              <div className="space-y-3">
                {analysis.risk_factors.slice(0, 3).map((risk, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 bg-white/70 rounded-xl border border-red-200">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-red-900 text-sm leading-relaxed">{risk}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Results;