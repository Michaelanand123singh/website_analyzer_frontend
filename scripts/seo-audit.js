// scripts/seo-audit.js
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');
const path = require('path');

const runSEOAudit = async () => {
  const chrome = await chromeLauncher.launch({chromeFlags: ['--headless']});
  const options = {
    logLevel: 'info',
    output: 'html',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    port: chrome.port,
  };

  const urls = [
    'http://localhost:3000/',
    'http://localhost:3000/about',
    'http://localhost:3000/analysis'
  ];

  console.log('🔍 Starting SEO audit...');

  for (const url of urls) {
    try {
      console.log(`Auditing: ${url}`);
      const runnerResult = await lighthouse(url, options);
      
      // Generate report
      const reportHtml = runnerResult.report;
      const urlPath = url.replace('http://localhost:3000', '').replace('/', 'home') || 'home';
      const reportPath = path.join(__dirname, '..', 'reports', `lighthouse-${urlPath}-${Date.now()}.html`);
      
      // Ensure reports directory exists
      const reportsDir = path.dirname(reportPath);
      if (!fs.existsSync(reportsDir)) {
        fs.mkdirSync(reportsDir, { recursive: true });
      }
      
      fs.writeFileSync(reportPath, reportHtml);
      
      // Extract scores
      const lhr = runnerResult.lhr;
      console.log(`✅ Report generated: ${reportPath}`);
      console.log(`📊 Scores for ${url}:`);
      console.log(`   Performance: ${Math.round(lhr.categories.performance.score * 100)}`);
      console.log(`   Accessibility: ${Math.round(lhr.categories.accessibility.score * 100)}`);
      console.log(`   Best Practices: ${Math.round(lhr.categories['best-practices'].score * 100)}`);
      console.log(`   SEO: ${Math.round(lhr.categories.seo.score * 100)}`);
      console.log('');
      
    } catch (error) {
      console.error(`❌ Error auditing ${url}:`, error.message);
    }
  }

  await chrome.kill();
  console.log('🎉 SEO audit completed!');
};

runSEOAudit().catch(console.error);