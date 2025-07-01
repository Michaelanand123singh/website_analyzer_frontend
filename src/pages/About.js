import React from 'react';

const About = () => {
  return (
    <>

      <div className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Enhanced Header with SEO-optimized content */}
          <header className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              About AI Website Analyzer: Advanced Website Analysis Tool
            </h1>
            <p className="text-xl text-gray-600 mb-4">
              Comprehensive website analysis powered by artificial intelligence for SEO optimization, user experience enhancement, and conversion rate improvement
            </p>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 mb-6">
              <span>Developed by</span>
              <a 
                href="https://nextinvision.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                title="NEXTIN VISION - Premier IT Services Company"
              >
                NEXTIN VISION
              </a>
            </div>
            
            {/* Breadcrumb Navigation for SEO */}
            <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-8">
              <ol className="flex justify-center space-x-2">
                <li><a href="/" className="hover:text-blue-600">Home</a></li>
                <li className="before:content-['/'] before:mx-2">About</li>
              </ol>
            </nav>
          </header>

          {/* Company Banner with enhanced SEO content */}
          <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 mb-12 text-white" aria-labelledby="company-banner">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-4 md:mb-0">
                <h2 id="company-banner" className="text-2xl font-bold mb-2">NEXTIN VISION</h2>
                <p className="text-blue-100">Premier IT Services & Software Solutions Company specializing in AI-powered business tools</p>
              </div>
              <a 
                href="https://nextinvision.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors inline-flex items-center"
                title="Visit NEXTIN VISION main website for comprehensive IT services"
              >
                Visit Our Main Website
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </section>

          {/* Key Features Section with SEO-optimized content */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12" aria-labelledby="key-features">
            <h2 id="key-features" className="sr-only">Key Features of AI Website Analyzer</h2>
            
            <article className="bg-white rounded-lg shadow-md p-6 border">
              <div className="text-3xl mb-4" role="img" aria-label="Rocket emoji">🚀</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Conversion Rate Optimization Analysis
              </h3>
              <p className="text-gray-600">
                Our advanced AI algorithms analyze your website's conversion funnel to identify optimization opportunities 
                and provide data-driven recommendations for improving business growth and revenue generation.
              </p>
            </article>

            <article className="bg-white rounded-lg shadow-md p-6 border">
              <div className="text-3xl mb-4" role="img" aria-label="Target emoji">🎯</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Multi-Dimensional Website Analysis
              </h3>
              <p className="text-gray-600">
                Comprehensive examination of SEO performance, user experience design, content quality assessment, 
                technical performance metrics, and conversion potential to provide a complete website audit.
              </p>
            </article>

            <article className="bg-white rounded-lg shadow-md p-6 border">
              <div className="text-3xl mb-4" role="img" aria-label="Lightning emoji">⚡</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Powered by Advanced AI Technology
              </h3>
              <p className="text-gray-600">
                Leveraging cutting-edge artificial intelligence and machine learning technology developed by NEXTIN VISION 
                to provide intelligent, personalized insights tailored to your specific website and industry requirements.
              </p>
            </article>

            <article className="bg-white rounded-lg shadow-md p-6 border">
              <div className="text-3xl mb-4" role="img" aria-label="Chart emoji">📊</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Actionable SEO and Performance Reports
              </h3>
              <p className="text-gray-600">
                Receive detailed website analysis reports with priority-ranked action items based on potential impact, 
                making it easy to understand what optimization tasks to prioritize for maximum results.
              </p>
            </article>
          </section>

          {/* How It Works Section with enhanced SEO structure */}
          <section className="bg-blue-50 rounded-lg p-8 border border-blue-200 mb-12" aria-labelledby="how-it-works">
            <h2 id="how-it-works" className="text-2xl font-bold text-blue-900 mb-4">How Our AI Website Analyzer Works</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-4 mt-1" aria-label="Step 1">1</span>
                <div>
                  <h3 className="font-semibold text-blue-900">Comprehensive Website Crawling</h3>
                  <p className="text-blue-800">Our intelligent AI crawler systematically analyzes your website structure, content, and performance metrics to gather comprehensive data for analysis.</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-4 mt-1" aria-label="Step 2">2</span>
                <div>
                  <h3 className="font-semibold text-blue-900">Advanced AI Analysis Engine</h3>
                  <p className="text-blue-800">Sophisticated machine learning algorithms analyze multiple aspects including SEO factors, user experience elements, technical performance, and conversion optimization opportunities.</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-4 mt-1" aria-label="Step 3">3</span>
                <div>
                  <h3 className="font-semibold text-blue-900">Prioritized Actionable Insights</h3>
                  <p className="text-blue-800">Receive comprehensive reports with strategically prioritized recommendations for website optimization, ranked by potential impact on your business goals.</p>
                </div>
              </div>
            </div>
          </section>

          {/* NEXTIN VISION Services Section with enhanced SEO */}
          <section className="bg-gray-50 rounded-lg p-8 border" aria-labelledby="additional-services">
            <div className="text-center mb-8">
              <h2 id="additional-services" className="text-2xl font-bold text-gray-900 mb-4">
                Need More Than Website Analysis? Explore NEXTIN VISION's IT Services
              </h2>
              <p className="text-gray-600">
                NEXTIN VISION offers comprehensive IT services and software development solutions to transform your digital presence and accelerate business growth
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <article className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="text-2xl mb-3" role="img" aria-label="Computer emoji">💻</div>
                <h3 className="font-semibold text-gray-900 mb-2">Custom Software Development</h3>
                <p className="text-sm text-gray-600">Bespoke software solutions designed and developed to meet your specific business requirements and operational needs</p>
              </article>

              <article className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="text-2xl mb-3" role="img" aria-label="Globe emoji">🌐</div>
                <h3 className="font-semibold text-gray-900 mb-2">Professional Web Development</h3>
                <p className="text-sm text-gray-600">Modern, responsive, and SEO-optimized websites that drive measurable results and enhance user engagement</p>
              </article>

              <article className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="text-2xl mb-3" role="img" aria-label="Mobile phone emoji">📱</div>
                <h3 className="font-semibold text-gray-900 mb-2">Mobile App Development</h3>
                <p className="text-sm text-gray-600">Native and cross-platform iOS and Android mobile applications for enhanced customer engagement and business growth</p>
              </article>

              <article className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="text-2xl mb-3" role="img" aria-label="Robot emoji">🤖</div>
                <h3 className="font-semibold text-gray-900 mb-2">AI & Machine Learning Solutions</h3>
                <p className="text-sm text-gray-600">Advanced AI-powered solutions and machine learning implementations, including tools like this website analyzer</p>
              </article>

              <article className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="text-2xl mb-3" role="img" aria-label="Cloud emoji">☁️</div>
                <h3 className="font-semibold text-gray-900 mb-2">Cloud Infrastructure Solutions</h3>
                <p className="text-sm text-gray-600">Scalable cloud infrastructure setup, migration services, and ongoing cloud management for optimal performance</p>
              </article>

              <article className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="text-2xl mb-3" role="img" aria-label="Wrench emoji">🔧</div>
                <h3 className="font-semibold text-gray-900 mb-2">Strategic IT Consulting</h3>
                <p className="text-sm text-gray-600">Expert technology guidance and strategic IT consulting services to drive digital transformation and business growth</p>
              </article>
            </div>

            <div className="text-center">
              <a 
                href="https://nextinvision.com/services" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center mr-4"
                title="Explore NEXTIN VISION's comprehensive IT services"
              >
                Explore Our Services
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
              <a 
                href="https://nextinvision.com/contact" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-gray-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-gray-700 transition-colors inline-flex items-center"
                title="Get free IT consultation from NEXTIN VISION experts"
              >
                Get Free Consultation
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-2.697-.413l-2.725.813c-.353.105-.726-.083-.706-.455l.148-2.666A7.956 7.956 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
                </svg>
              </a>
            </div>
          </section>

          {/* FAQ Section for additional SEO value */}
          <section className="mt-12" aria-labelledby="faq-section">
            <h2 id="faq-section" className="text-2xl font-bold text-gray-900 mb-6 text-center">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <details className="bg-white rounded-lg p-6 shadow-sm border">
                <summary className="font-semibold text-gray-900 cursor-pointer">What makes AI Website Analyzer different from other website analysis tools?</summary>
                <p className="mt-3 text-gray-600">Our AI Website Analyzer uses advanced machine learning algorithms developed by NEXTIN VISION to provide comprehensive analysis across SEO, user experience, conversion optimization, and technical performance, offering personalized insights tailored to your specific website and industry.</p>
              </details>
              
              <details className="bg-white rounded-lg p-6 shadow-sm border">
                <summary className="font-semibold text-gray-900 cursor-pointer">How accurate is the AI website analysis?</summary>
                <p className="mt-3 text-gray-600">Our AI analysis engine is continuously trained on the latest SEO best practices, user experience standards, and conversion optimization techniques, providing highly accurate and actionable recommendations based on current industry standards and proven methodologies.</p>
              </details>
              
              <details className="bg-white rounded-lg p-6 shadow-sm border">
                <summary className="font-semibold text-gray-900 cursor-pointer">Is the website analyzer free to use?</summary>
                <p className="mt-3 text-gray-600">Yes, our AI Website Analyzer offers comprehensive analysis capabilities at no cost, providing valuable insights to help improve your website's performance, SEO rankings, and conversion rates.</p>
              </details>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default About;