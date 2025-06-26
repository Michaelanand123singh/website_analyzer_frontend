import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UrlInput from '../components/UrlInput';
import { apiService } from '../services/api';

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAnalyze = async (url) => {
    setLoading(true);
    setError('');

    try {
      const response = await apiService.analyzeWebsite(url);
      
      if (response.success) {
        navigate('/analysis', { 
          state: { 
            analysis: response.analysis, 
            url: url 
          } 
        });
      } else {
        setError(response.error || 'Analysis failed');
      }
    } catch (error) {
      console.error('Analysis error:', error);
      setError(error.response?.data?.error || 'Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">❌ {error}</p>
          </div>
        )}

        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-700">Analyzing website... This may take up to 60 seconds.</p>
            </div>
          </div>
        )}

        <UrlInput onAnalyze={handleAnalyze} loading={loading} />

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">SEO Optimization</h3>
            <p className="text-gray-600">Analyze search engine optimization and visibility</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">💡</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">UX Analysis</h3>
            <p className="text-gray-600">Evaluate user experience and interface design</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">📈</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Conversion Focus</h3>
            <p className="text-gray-600">Optimize for better conversion rates and growth</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;