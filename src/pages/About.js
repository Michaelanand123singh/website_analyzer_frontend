import React from 'react';

const About = () => {
  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            About AI Website Analyzer
          </h1>
          <p className="text-xl text-gray-600">
            Comprehensive website analysis powered by artificial intelligence
          </p>
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
              Powered by DeepSeek AI
            </h3>
            <p className="text-gray-600">
              Leveraging advanced AI technology to provide intelligent insights 
              and recommendations tailored to your specific website.
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

        <div className="bg-blue-50 rounded-lg p-8 border border-blue-200">
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
      </div>
    </div>
  );
};

export default About;