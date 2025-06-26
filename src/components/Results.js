import React from 'react';

const Results = ({ analysis, url }) => {
  if (!analysis) return null;

  const getScoreColor = (score) => {
    const numScore = parseInt(score);
    if (numScore >= 8) return 'score-excellent';
    if (numScore >= 6) return 'score-good';
    if (numScore >= 4) return 'score-fair';
    return 'score-poor';
  };

  const ScoreCard = ({ title, data }) => (
    <div className="bg-white rounded-lg shadow-md p-6 border">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <span className={`text-2xl font-bold ${getScoreColor(data.score)}`}>
          {data.score}/10
        </span>
      </div>
      
      {data.issues && data.issues.length > 0 && (
        <div className="mb-4">
          <h4 className="font-medium text-red-600 mb-2">Issues:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            {data.issues.slice(0, 3).map((issue, index) => (
              <li key={index} className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                {issue}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {data.recommendations && data.recommendations.length > 0 && (
        <div>
          <h4 className="font-medium text-green-600 mb-2">Recommendations:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            {data.recommendations.slice(0, 2).map((rec, index) => (
              <li key={index} className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8 border">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Analysis Results</h2>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-gray-600">Analyzed URL: </span>
            <a href={url} target="_blank" rel="noopener noreferrer" 
               className="text-blue-600 hover:underline">
              {url}
            </a>
          </div>
          <div className="text-right">
            <span className="text-gray-600">Overall Score: </span>
            <span className={`text-3xl font-bold ${getScoreColor(analysis.overall_score)}`}>
              {analysis.overall_score}/10
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <ScoreCard title="SEO Analysis" data={analysis.seo_analysis} />
        <ScoreCard title="UX Analysis" data={analysis.ux_analysis} />
        <ScoreCard title="Content Analysis" data={analysis.content_analysis} />
        <ScoreCard title="Conversion Analysis" data={analysis.conversion_analysis} />
        <ScoreCard title="Technical Analysis" data={analysis.technical_analysis} />
      </div>

      {analysis.key_insights && analysis.key_insights.length > 0 && (
        <div className="bg-blue-50 rounded-lg p-6 mb-6 border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Key Insights</h3>
          <ul className="space-y-2">
            {analysis.key_insights.map((insight, index) => (
              <li key={index} className="flex items-start text-blue-800">
                <span className="text-blue-500 mr-2">💡</span>
                {insight}
              </li>
            ))}
          </ul>
        </div>
      )}

      {analysis.priority_actions && analysis.priority_actions.length > 0 && (
        <div className="bg-green-50 rounded-lg p-6 border border-green-200">
          <h3 className="text-lg font-semibold text-green-900 mb-3">Priority Actions</h3>
          <ol className="space-y-2">
            {analysis.priority_actions.map((action, index) => (
              <li key={index} className="flex items-start text-green-800">
                <span className="bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                  {index + 1}
                </span>
                {action}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
};

export default Results;