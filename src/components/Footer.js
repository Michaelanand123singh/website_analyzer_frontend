import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-300">
              © 2025 AI Website Analyzer. Built for conversion optimization.
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-300">Powered by</span>
            <span className="text-sm font-semibold text-blue-400">
              AI
            </span>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-700">
          <p className="text-xs text-gray-400 text-center">
            Analyze websites for SEO, UX, content, conversion, and technical optimization
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;