import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const { pathname } = useLocation();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/analysis', label: 'Analysis' },
    { path: '/about', label: 'About' }
  ];

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 group">
            <span className="text-2xl group-hover:scale-110 transition-transform">🔍</span>
            <span className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
              Website Analyzer
            </span>
          </Link>
          
          <nav className="flex space-x-1">
            {navItems.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  pathname === path
                    ? 'text-blue-600 bg-blue-50 border-b-2 border-blue-600' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;