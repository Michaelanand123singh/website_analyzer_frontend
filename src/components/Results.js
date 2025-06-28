import React, { useState } from 'react';

const Results = ({ analysis, url }) => {
  const [expandedCategory, setExpandedCategory] = useState(null);

  if (!analysis) return null;

  const getScoreColor = (score) => {
    const numScore = parseInt(score);
    if (numScore >= 8) return 'text-green-600';
    if (numScore >= 6) return 'text-yellow-600';
    if (numScore >= 4) return 'text-orange-600';
    return 'text-red-600';
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
    <div className="max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6 border">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Website Analysis Report</h2>
            <div className="flex items-center text-sm text-gray-600">
              <span>URL: </span>
              <a href={url} target="_blank" rel="noopener noreferrer" 
                 className="text-blue-600 hover:underline ml-1 truncate max-w-md">
                {url}
              </a>
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-1">Overall Score</div>
            <div className={`text-4xl font-bold ${getScoreColor(analysis.overall_score)}`}>
              {analysis.overall_score}
            </div>
            <div className="text-sm text-gray-500">
              {analysis.analysis_metadata?.total_parameters_analyzed || 32} parameters analyzed
            </div>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
        {categories.map((category) => (
          <CategoryCard
            key={category.key}
            category={category}
            categoryData={analysis.category_scores?.[category.key] || 'N/A'}
            detailData={analysis.detailed_analysis?.[category.key]}
          />
        ))}
      </div>

      {/* Quick Stats */}
      {analysis.technical_metrics && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6 border">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Technical Metrics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="font-bold text-blue-600">{analysis.technical_metrics.image_count}</div>
              <div className="text-gray-600">Images</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-green-600">{analysis.technical_metrics.link_count}</div>
              <div className="text-gray-600">Links</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-purple-600">
                {Math.round(analysis.technical_metrics.page_size / 1000)}K
              </div>
              <div className="text-gray-600">Page Size</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-orange-600">
                {analysis.technical_metrics.is_https ? '✓' : '✗'}
              </div>
              <div className="text-gray-600">HTTPS</div>
            </div>
          </div>
        </div>
      )}

      {/* Insights & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {analysis.key_insights && analysis.key_insights.length > 0 && (
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">💡 Key Insights</h3>
            <ul className="space-y-2 text-sm">
              {analysis.key_insights.slice(0, 3).map((insight, index) => (
                <li key={index} className="text-blue-800 flex items-start">
                  <span className="mr-2">•</span>
                  {insight}
                </li>
              ))}
            </ul>
          </div>
        )}

        {analysis.priority_actions && analysis.priority_actions.length > 0 && (
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <h3 className="text-lg font-semibold text-green-900 mb-3">🎯 Priority Actions</h3>
            <ol className="space-y-2 text-sm">
              {analysis.priority_actions.slice(0, 3).map((action, index) => (
                <li key={index} className="text-green-800 flex items-start">
                  <span className="bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5 flex-shrink-0">
                    {index + 1}
                  </span>
                  {action}
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>

      {/* Additional Insights */}
      {(analysis.competitive_advantages || analysis.risk_factors) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {analysis.competitive_advantages && analysis.competitive_advantages.length > 0 && (
            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
              <h3 className="text-lg font-semibold text-yellow-900 mb-3">⭐ Competitive Advantages</h3>
              <ul className="space-y-1 text-sm">
                {analysis.competitive_advantages.slice(0, 3).map((advantage, index) => (
                  <li key={index} className="text-yellow-800">• {advantage}</li>
                ))}
              </ul>
            </div>
          )}

          {analysis.risk_factors && analysis.risk_factors.length > 0 && (
            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
              <h3 className="text-lg font-semibold text-red-900 mb-3">⚠️ Risk Factors</h3>
              <ul className="space-y-1 text-sm">
                {analysis.risk_factors.slice(0, 3).map((risk, index) => (
                  <li key={index} className="text-red-800">• {risk}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Results;