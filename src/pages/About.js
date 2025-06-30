import React from 'react';

const About = () => {
  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            About AI Website Analyzer
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            Comprehensive website analysis powered by artificial intelligence
          </p>
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <span>Developed by</span>
            <a 
              href="https://nextinvision.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-semibold text-blue-600 hover:text-blue-800 transition-colors"
            >
              NEXTIN VISION
            </a>
          </div>
        </div>

        {/* NEXTIN VISION Company Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 mb-12 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h2 className="text-2xl font-bold mb-2">NEXTIN VISION</h2>
              <p className="text-blue-100">Premier IT Services & Software Solutions Company</p>
            </div>
            <a 
              href="https://nextinvision.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors inline-flex items-center"
            >
              Visit Our Main Website
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6 border">
            <div className="text-3xl mb-4">🚀</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Conversion Optimization
            </h3>
            <p className="text-gray-600">
              Our AI analyzes your website to identify conversion opportunities 
              and provide actionable recommendations for business growth.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border">
            <div className="text-3xl mb-4">🎯</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Multi-Dimensional Analysis
            </h3>
            <p className="text-gray-600">
              We examine SEO, user experience, content quality, technical performance, 
              and conversion potential to give you a complete picture.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border">
            <div className="text-3xl mb-4">⚡</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Powered by Advanced AI
            </h3>
            <p className="text-gray-600">
              Leveraging cutting-edge AI technology developed by NEXTIN VISION 
              to provide intelligent insights tailored to your specific website.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border">
            <div className="text-3xl mb-4">📊</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Actionable Reports
            </h3>
            <p className="text-gray-600">
              Get detailed reports with priority actions ranked by impact, 
              making it easy to know what to fix first.
            </p>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-8 border border-blue-200 mb-12">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">How It Works</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-4 mt-1">1</span>
              <div>
                <h4 className="font-semibold text-blue-900">Website Crawling</h4>
                <p className="text-blue-800">Our AI crawls your website to gather comprehensive data</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-4 mt-1">2</span>
              <div>
                <h4 className="font-semibold text-blue-900">AI Analysis</h4>
                <p className="text-blue-800">Advanced algorithms analyze multiple aspects of your site</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-4 mt-1">3</span>
              <div>
                <h4 className="font-semibold text-blue-900">Actionable Insights</h4>
                <p className="text-blue-800">Receive prioritized recommendations for optimization</p>
              </div>
            </div>
          </div>
        </div>

        {/* NEXTIN VISION Services Section */}
        <div className="bg-gray-50 rounded-lg p-8 border">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Need More Than Website Analysis?
            </h2>
            <p className="text-gray-600">
              NEXTIN VISION offers comprehensive IT services to transform your digital presence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="text-2xl mb-3">💻</div>
              <h4 className="font-semibold text-gray-900 mb-2">Custom Software Development</h4>
              <p className="text-sm text-gray-600">Tailored software solutions for your business needs</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="text-2xl mb-3">🌐</div>
              <h4 className="font-semibold text-gray-900 mb-2">Web Development</h4>
              <p className="text-sm text-gray-600">Modern, responsive websites that drive results</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="text-2xl mb-3">📱</div>
              <h4 className="font-semibold text-gray-900 mb-2">Mobile App Development</h4>
              <p className="text-sm text-gray-600">iOS and Android apps for your business</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="text-2xl mb-3">🤖</div>
              <h4 className="font-semibold text-gray-900 mb-2">AI & Machine Learning</h4>
              <p className="text-sm text-gray-600">AI-powered solutions like this analyzer</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="text-2xl mb-3">☁️</div>
              <h4 className="font-semibold text-gray-900 mb-2">Cloud Solutions</h4>
              <p className="text-sm text-gray-600">Scalable cloud infrastructure and migration</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="text-2xl mb-3">🔧</div>
              <h4 className="font-semibold text-gray-900 mb-2">IT Consulting</h4>
              <p className="text-sm text-gray-600">Strategic technology guidance for growth</p>
            </div>
          </div>

          <div className="text-center">
            <a 
              href="https://nextinvision.com/services" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center mr-4"
            >
              Explore Our Services
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
            <a 
              href="https://nextinvision.com/contact" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-gray-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-gray-700 transition-colors inline-flex items-center"
            >
              Get Free Consultation
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-2.697-.413l-2.725.813c-.353.105-.726-.083-.706-.455l.148-2.666A7.956 7.956 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;