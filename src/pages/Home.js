import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
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
        // Create SEO-friendly URL for analysis results
        const urlSlug = url.replace(/^https?:\/\//, '').replace(/[^a-zA-Z0-9]/g, '-');
        navigate(`/analysis/${urlSlug}`, { 
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
    <>
      {/* SEO Meta Tags using React Helmet */}
      <Helmet>
        <title>Free AI Website Analyzer - SEO Audit & Performance Tool | AnalyzeSites</title>
        <meta name="description" content="Analyze any website for FREE with our AI-powered tool. Get instant SEO audits, performance insights, accessibility checks, and conversion optimization recommendations." />
        <link rel="canonical" href="https://www.analyzesites.com/" />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content="Free AI Website Analyzer - Instant SEO Audit & Performance Check" />
        <meta property="og:description" content="Analyze any website instantly with our FREE AI-powered tool. Get comprehensive SEO audits, performance insights, and actionable optimization recommendations." />
        <meta property="og:url" content="https://www.analyzesites.com/" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://www.analyzesites.com/images/og-home.jpg" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free AI Website Analyzer - Instant SEO Audit Tool" />
        <meta name="twitter:description" content="Get instant website analysis with our FREE AI tool. SEO audit, performance check, accessibility scan & optimization tips in seconds." />
        <meta name="twitter:image" content="https://www.analyzesites.com/images/twitter-home.jpg" />
        
        {/* Additional SEO Meta */}
        <meta name="keywords" content="free SEO audit, website analyzer tool, AI SEO checker, page speed test, mobile responsiveness checker, website performance analyzer" />
        <meta name="author" content="AnalyzeSites" />
        <meta name="robots" content="index,follow" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "AI Website Analyzer - Free SEO Tool",
            "description": "Free AI-powered website analyzer providing SEO audits, performance insights, and conversion optimization recommendations",
            "url": "https://www.analyzesites.com/",
            "mainEntity": {
              "@type": "WebApplication",
              "name": "AnalyzeSites AI Website Analyzer",
              "applicationCategory": "SEO Tool",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              }
            },
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://www.analyzesites.com/"
                }
              ]
            }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Hero Section */}
        <section className="relative overflow-hidden" aria-labelledby="hero-heading">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
            <div className="text-center mb-12">
              <div className="mb-4">
                <span className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                  Powered by NEXTIN VISION AI
                </span>
              </div>
              <h1 id="hero-heading" className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
                Free AI Website Analyzer
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-8">
                Get instant <strong>SEO audits</strong>, <strong>performance insights</strong>, and <strong>conversion optimization</strong> recommendations with our AI-powered website analysis tool
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <div className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2" aria-hidden="true"></span>
                  100% Free Analysis Tool
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2" aria-hidden="true"></span>
                  Professional Development Available
                </div>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="mb-8 max-w-2xl mx-auto" role="alert" aria-live="polite">
                <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg shadow-sm">
                  <div className="flex">
                    <div className="text-red-400 text-xl mr-3" aria-hidden="true">⚠️</div>
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
            <section className="mb-16" aria-labelledby="features-heading">
              <h2 id="features-heading" className="text-3xl font-bold text-center text-gray-900 mb-12">
                Comprehensive Website Analysis Features
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    icon: "🎯",
                    title: "SEO Optimization Analysis",
                    description: "Comprehensive SEO audit including meta tags, keywords, search rankings, and technical SEO factors",
                    gradient: "from-blue-500 to-blue-600"
                  },
                  {
                    icon: "💡",
                    title: "User Experience Analysis", 
                    description: "Evaluate website usability, mobile responsiveness, page load speed, and user interface design",
                    gradient: "from-purple-500 to-purple-600"
                  },
                  {
                    icon: "📈",
                    title: "Conversion Rate Optimization",
                    description: "Identify conversion bottlenecks and get actionable recommendations to improve growth rates",
                    gradient: "from-green-500 to-green-600"
                  }
                ].map((feature, index) => (
                  <article key={index} className="group hover:scale-105 transition-all duration-300">
                    <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl border border-gray-100">
                      <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300" aria-hidden="true">
                        {feature.icon}
                      </div>
                      <h3 className={`text-xl font-bold mb-3 bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent`}>
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* Trust Indicators */}
            <section className="mb-16" aria-labelledby="stats-heading">
              <h2 id="stats-heading" className="text-3xl font-bold text-center text-gray-900 mb-12">
                Trusted by Thousands of Websites
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="text-3xl font-bold text-blue-600 mb-2">15,000+</div>
                  <p className="text-gray-600 font-medium">Websites Analyzed</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="text-3xl font-bold text-purple-600 mb-2">2,500+</div>
                  <p className="text-gray-600 font-medium">Happy Clients</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="text-3xl font-bold text-green-600 mb-2">24/7</div>
                  <p className="text-gray-600 font-medium">Support Available</p>
                </div>
              </div>
            </section>

            {/* FAQ Section for SEO */}
            <section className="mt-16" aria-labelledby="faq-heading">
              <h2 id="faq-heading" className="text-3xl font-bold text-center text-gray-900 mb-12">
                Frequently Asked Questions
              </h2>
              <div className="max-w-4xl mx-auto space-y-6">
                {[
                  {
                    question: "How does the AI website analyzer work?",
                    answer: "Our AI analyzes your website's SEO factors, performance metrics, accessibility compliance, and user experience elements using advanced algorithms and industry best practices to provide comprehensive insights."
                  },
                  {
                    question: "Is the website analysis really free?",
                    answer: "Yes, our basic website analysis is completely free with no hidden costs. You get detailed SEO audits, performance reports, and optimization recommendations at no charge."
                  },
                  {
                    question: "What aspects of my website do you analyze?",
                    answer: "We analyze SEO factors (meta tags, keywords, structure), page speed performance, mobile responsiveness, accessibility compliance, security issues, and provide conversion optimization recommendations."
                  },
                  {
                    question: "How accurate are the analysis results?",
                    answer: "Our AI-powered analysis uses industry-standard metrics and best practices, providing 95%+ accuracy. Results are based on current SEO guidelines and web performance standards."
                  }
                ].map((faq, index) => (
                  <details key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <summary className="font-semibold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors">
                      {faq.question}
                    </summary>
                    <p className="mt-4 text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </details>
                ))}
              </div>
            </section>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-blue-100 rounded-full opacity-50 -translate-x-16 -translate-y-16" aria-hidden="true"></div>
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-purple-100 rounded-full opacity-50 translate-x-24 translate-y-24" aria-hidden="true"></div>
        </section>

        {/* Loading Overlay */}
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm" role="dialog" aria-labelledby="loading-title" aria-describedby="loading-description">
            <div className="bg-white rounded-2xl p-8 text-center shadow-2xl max-w-sm mx-4">
              <div className="relative mb-6">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-100 border-t-blue-600 mx-auto" aria-hidden="true"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 bg-blue-600 rounded-full opacity-20 animate-pulse" aria-hidden="true"></div>
                </div>
              </div>
              <h3 id="loading-title" className="text-lg font-semibold text-gray-900 mb-2">Analyzing Website</h3>
              <p id="loading-description" className="text-gray-600">Powered by NEXTIN VISION AI...</p>
              <p className="text-sm text-gray-500 mt-2">This may take up to 60 seconds</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Home;