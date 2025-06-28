import React, { useState } from 'react';
import { trackWebsiteAnalysis, trackUserEngagement, trackExampleClick, trackError } from '../services/analytics';

const UrlInput = ({ onAnalyze, loading }) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!url.trim()) {
      setError('Please enter a URL');
      trackError('validation_error', 'Empty URL submitted');
      return;
    }

    if (!url.match(/^https?:\/\/.+/)) {
      setError('Please enter a valid URL starting with http:// or https://');
      trackError('validation_error', 'Invalid URL format', url);
      return;
    }

    // Track analysis start
    trackUserEngagement('analysis_started', { url: url.trim() });
    
    const startTime = Date.now();
    
    try {
      await onAnalyze(url.trim());
      
      // Track successful analysis
      const analysisTime = Date.now() - startTime;
      trackWebsiteAnalysis(url.trim(), true, analysisTime);
    } catch (error) {
      // Track failed analysis
      trackWebsiteAnalysis(url.trim(), false);
      trackError('analysis_error', error.message, url.trim());
    }
  };

  const handleExampleClick = (exampleUrl) => {
    setUrl(exampleUrl);
    trackExampleClick(exampleUrl);
  };

  return (
    <div className="max-w-2xl mx-auto">
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-3">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter website URL (e.g., https://example.com)"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />
          <button 
            type="submit" 
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            disabled={loading || !url.trim()}
          >
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>
        
        {error && (
          <div className="text-red-600 text-sm mt-2">{error}</div>
        )}
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500 mb-2">Try these examples:</p>
        <div className="flex gap-2 justify-center">
          <button 
            onClick={() => handleExampleClick('https://stripe.com')}
            className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
            disabled={loading}
          >
            stripe.com
          </button>
          <button 
            onClick={() => handleExampleClick('https://airbnb.com')}
            className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
            disabled={loading}
          >
            airbnb.com
          </button>
        </div>
      </div>
    </div>
  );
};

export default UrlInput;