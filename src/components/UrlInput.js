import React, { useState } from 'react';

const UrlInput = ({ onAnalyze, loading }) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    if (!url.match(/^https?:\/\/.+/)) {
      setError('Please enter a valid URL starting with http:// or https://');
      return;
    }

    onAnalyze(url.trim());
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          AI Website Analyzer
        </h1>
        <p className="text-xl text-gray-600">
          Get comprehensive analysis for conversion optimization and business growth
        </p>
      </div>
      
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
            onClick={() => setUrl('https://stripe.com')}
            className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
            disabled={loading}
          >
            stripe.com
          </button>
          <button 
            onClick={() => setUrl('https://airbnb.com')}
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