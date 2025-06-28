import React from 'react';
import { BarChart3, Shield, Zap, Globe, Mail, Github, Linkedin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const features = [
    { icon: BarChart3, text: 'Analytics' },
    { icon: Shield, text: 'Security' },
    { icon: Zap, text: 'Performance' },
    { icon: Globe, text: 'SEO' }
  ];

  const links = [
    { category: 'Product', items: ['Features', 'Pricing', 'API', 'Documentation'] },
    { category: 'Company', items: ['About', 'Blog', 'Careers', 'Contact'] },
    { category: 'Resources', items: ['Help Center', 'Tutorials', 'Case Studies', 'Community'] }
  ];

  const socialLinks = [
    { icon: Mail, href: '#', label: 'Email' },
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' }
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                AI Website Analyzer
              </h3>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              Advanced AI-powered website analysis for SEO, performance, UX, and conversion optimization. 
              Get actionable insights to boost your digital presence.
            </p>
            
            {/* Feature Icons */}
            <div className="flex space-x-4">
              {features.map(({ icon: Icon, text }, index) => (
                <div key={index} className="group flex flex-col items-center">
                  <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-200">
                    <Icon className="h-4 w-4 text-gray-300 group-hover:text-white" />
                  </div>
                  <span className="text-xs text-gray-400 mt-1">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          {links.map(({ category, items }, index) => (
            <div key={index} className="lg:col-span-1">
              <h4 className="text-sm font-semibold text-white mb-4 tracking-wider uppercase">
                {category}
              </h4>
              <ul className="space-y-3">
                {items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <a 
                      href="#" 
                      className="text-gray-300 hover:text-blue-400 text-sm transition-colors duration-200 hover:translate-x-1 inline-block"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            
            {/* Copyright */}
            <div className="flex items-center space-x-4">
              <p className="text-sm text-gray-400">
                © {currentYear} AI Website Analyzer. All rights reserved.
              </p>
              <div className="hidden md:flex items-center space-x-4 text-xs text-gray-500">
                <a href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</a>
                <span>•</span>
                <a href="#" className="hover:text-gray-300 transition-colors">Terms of Service</a>
                <span>•</span>
                <a href="#" className="hover:text-gray-300 transition-colors">Cookie Policy</a>
              </div>
            </div>

            {/* Social Links & Status */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                {socialLinks.map(({ icon: Icon, href, label }, index) => (
                  <a
                    key={index}
                    href={href}
                    aria-label={label}
                    className="w-8 h-8 bg-gray-700 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-all duration-200 transform hover:scale-110"
                  >
                    <Icon className="h-4 w-4 text-gray-300 hover:text-white" />
                  </a>
                ))}
              </div>
              
              {/* Status Indicator */}
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-400">All systems operational</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;