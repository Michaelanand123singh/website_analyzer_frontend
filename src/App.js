import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Analysis from './pages/Analysis';
import About from './pages/About';
import { trackPageView } from './services/analytics';

// Component to track page views
function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    // Track page view whenever location changes
    trackPageView(location.pathname, document.title);
  }, [location]);

  return null;
}

function App() {
  useEffect(() => {
    // Track initial page load
    trackPageView(window.location.pathname, document.title);
  }, []);

  return (
    <HelmetProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <AnalyticsTracker />
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            {/* Add dynamic route for analysis with slug */}
            <Route path="/analysis/:slug" element={<Analysis />} />
            {/* Keep the static route as fallback */}
            <Route path="/analysis" element={<Analysis />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </HelmetProvider>
  );
}

export default App;