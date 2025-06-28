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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
              Website Analyzer
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Get instant insights on SEO, UX, and conversion optimization with AI-powered analysis
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-8 max-w-2xl mx-auto">
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg shadow-sm">
                <div className="flex">
                  <div className="text-red-400 text-xl mr-3">⚠️</div>
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* URL Input */}
          <div className="max-w-2xl mx-auto mb-16">
            <UrlInput onAnalyze={handleAnalyze} loading={loading} />
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "🎯",
                title: "SEO Optimization",
                description: "Analyze search rankings and visibility",
                gradient: "from-blue-500 to-blue-600"
              },
              {
                icon: "💡",
                title: "UX Analysis", 
                description: "Evaluate user experience design",
                gradient: "from-purple-500 to-purple-600"
              },
              {
                icon: "📈",
                title: "Conversion Focus",
                description: "Optimize for better growth rates",
                gradient: "from-green-500 to-green-600"
              }
            ].map((feature, index) => (
              <div key={index} className="group hover:scale-105 transition-all duration-300">
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl border border-gray-100">
                  <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className={`text-xl font-bold mb-3 bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent`}>
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-blue-100 rounded-full opacity-50 -translate-x-16 -translate-y-16"></div>
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-purple-100 rounded-full opacity-50 translate-x-24 translate-y-24"></div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 text-center shadow-2xl max-w-sm mx-4">
            <div className="relative mb-6">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-100 border-t-blue-600 mx-auto"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-blue-600 rounded-full opacity-20 animate-pulse"></div>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Analyzing Website</h3>
            <p className="text-gray-600">This may take up to 60 seconds...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;