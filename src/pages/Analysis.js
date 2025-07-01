import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Results from '../components/Results';
import Report from '../components/Report';
import { trackViewSwitch, trackUserEngagement } from '../services/analytics';

const Analysis = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('results');

  const { analysis, url } = location.state || {};

  // Extract domain name for SEO purposes
  const getDomainName = (url) => {
    try {
      const domain = new URL(url).hostname.replace('www.', '');
      return domain;
    } catch {
      return 'website';
    }
  };

  const domainName = url ? getDomainName(url) : '';

  useEffect(() => {
    // Track when user lands on analysis page
    if (analysis && url) {
      trackUserEngagement('analysis_page_viewed', { url, activeView });
    }
  }, [analysis, url, activeView]);

  const handleViewSwitch = (newView) => {
    // Track view switching
    trackViewSwitch(activeView, newView, url);
    setActiveView(newView);
  };

  const handleNewAnalysis = () => {
    // Track new analysis button click
    trackUserEngagement('new_analysis_clicked', { from_url: url });
    navigate('/');
  };

  // SEO meta data based on analysis results
  const getMetaTitle = () => {
    if (!domainName) return 'Website Analysis Results | AnalyzeSites';
    return `${domainName} Analysis Results - SEO Audit & Performance Report | AnalyzeSites`;
  };

  const getMetaDescription = () => {
    if (!domainName) return 'View detailed website analysis results including SEO audit, performance metrics, and optimization recommendations.';
    return `Complete SEO audit and performance analysis results for ${domainName}. View detailed insights, optimization recommendations, and actionable improvements.`;
  };

  if (!analysis || !url) {
    return (
      <>
        <Helmet>
          <title>No Analysis Data - Start New Website Analysis | AnalyzeSites</title>
          <meta name="description" content="Start a new website analysis with our free AI-powered tool. Get comprehensive SEO audits and performance insights." />
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        
        <div className="py-12">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="text-6xl mb-4" aria-hidden="true">🔍</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">No Analysis Data Available</h1>
            <p className="text-gray-600 mb-6">
              Please return to the home page to start analyzing a website with our free AI-powered tool.
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Go to home page to start new analysis"
            >
              Start New Analysis
            </button>
          </div>
        </div>
      </>
    );
  }

  // Generate structured data for analysis results
  const analysisStructuredData = {
    "@context": "https://schema.org",
    "@type": "AnalysisNewsArticle",
    "headline": `Website Analysis Results for ${domainName}`,
    "description": `Comprehensive SEO audit and performance analysis results for ${domainName}`,
    "url": `https://www.analyzesites.com/analysis`,
    "datePublished": new Date().toISOString(),
    "author": {
      "@type": "Organization",
      "name": "AnalyzeSites",
      "url": "https://www.analyzesites.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "AnalyzeSites",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.analyzesites.com/logo.png"
      }
    },
    "mainEntity": {
      "@type": "WebSite",
      "name": domainName,
      "url": url
    }
  };

  return (
    <>
      <Helmet>
        <title>{getMetaTitle()}</title>
        <meta name="description" content={getMetaDescription()} />
        <meta name="keywords" content={`${domainName} analysis, SEO audit ${domainName}, website performance ${domainName}, ${domainName} optimization`} />
        <link rel="canonical" href="https://www.analyzesites.com/analysis" />
        
        {/* Open Graph */}
        <meta property="og:title" content={getMetaTitle()} />
        <meta property="og:description" content={getMetaDescription()} />
        <meta property="og:url" content="https://www.analyzesites.com/analysis" />
        <meta property="og:type" content="article" />
        
        {/* Twitter Card */}
        <meta name="twitter:title" content={getMetaTitle()} />
        <meta name="twitter:description" content={getMetaDescription()} />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(analysisStructuredData)}
        </script>
        
        {/* Prevent indexing of specific analysis results for privacy */}
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <header className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Analysis Results for {domainName}
                </h1>
                <p className="text-gray-600">
                  Comprehensive SEO audit and performance analysis powered by AI
                </p>
              </div>
              
              <button
                onClick={handleNewAnalysis}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 inline-flex items-center gap-2"
                aria-label="Start a new website analysis"
              >
                <span aria-hidden="true">🔍</span>
                New Analysis
              </button>
            </div>
          </header>

          {/* Navigation Tabs */}
          <nav className="mb-8" role="tablist" aria-label="Analysis view options">
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => handleViewSwitch('results')}
                className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  activeView === 'results'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
                role="tab"
                aria-selected={activeView === 'results'}
                aria-controls="results-panel"
                id="results-tab"
              >
                <span aria-hidden="true">📊</span>
                <span className="ml-2">Analysis Results</span>
              </button>
              <button
                onClick={() => handleViewSwitch('report')}
                className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  activeView === 'report'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
                role="tab"
                aria-selected={activeView === 'report'}
                aria-controls="report-panel"
                id="report-tab"
              >
                <span aria-hidden="true">📋</span>
                <span className="ml-2">Detailed Report</span>
              </button>
            </div>
          </nav>

          {/* Content Panels */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {activeView === 'results' && (
              <section
                role="tabpanel"
                id="results-panel"
                aria-labelledby="results-tab"
                className="p-6"
              >
                <h2 className="sr-only">Website Analysis Results for {domainName}</h2>
                <Results analysis={analysis} url={url} />
              </section>
            )}
            
            {activeView === 'report' && (
              <section
                role="tabpanel"
                id="report-panel"
                aria-labelledby="report-tab"
                className="p-6"
              >
                <h2 className="sr-only">Detailed Analysis Report for {domainName}</h2>
                <Report analysis={analysis} url={url} />
              </section>
            )}
          </div>

          {/* Additional Actions */}
          <footer className="mt-8 text-center">
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Need Help Implementing These Recommendations?
              </h3>
              <p className="text-gray-600 mb-4">
                Get professional assistance from NEXTIN VISION to optimize your website performance
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="https://nextinvision.com/contact"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  aria-label="Contact NEXTIN VISION for professional help"
                >
                  Get Professional Help
                </a>
                <button
                  onClick={handleNewAnalysis}
                  className="px-6 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  aria-label="Analyze another website"
                >
                  Analyze Another Site
                </button>
              </div>
            </div>
          </footer>
        </div>
      </main>
    </>
  );
};

export default Analysis;