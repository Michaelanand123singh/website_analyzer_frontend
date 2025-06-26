import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Results from '../components/Results';
import Report from '../components/Report';

const Analysis = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('results');

  const { analysis, url } = location.state || {};

  if (!analysis || !url) {
    return (
      <div className="py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Analysis Data</h2>
          <p className="text-gray-600 mb-6">
            Please go back to the home page to analyze a website.
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Start New Analysis
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveView('results')}
              className={`px-4 py-2 rounded-lg font-medium ${
                activeView === 'results'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              📊 Results
            </button>
            <button
              onClick={() => setActiveView('report')}
              className={`px-4 py-2 rounded-lg font-medium ${
                activeView === 'report'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              📋 Report
            </button>
          </div>
          
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            🔍 New Analysis
          </button>
        </div>

        {activeView === 'results' && <Results analysis={analysis} url={url} />}
        {activeView === 'report' && <Report analysis={analysis} url={url} />}
      </div>
    </div>
  );
};

export default Analysis;