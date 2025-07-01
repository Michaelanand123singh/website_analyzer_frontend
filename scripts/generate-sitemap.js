// scripts/generate-sitemap.js
const fs = require('fs');
const path = require('path');

const baseUrl = 'https://www.analyzesites.com';

const routes = [
  {
    path: '/',
    priority: 1.0,
    changefreq: 'weekly',
    title: 'Website Analyzer - Free SEO Analysis Tool'
  },
  {
    path: '/about',
    priority: 0.8,
    changefreq: 'monthly',
    title: 'About - Website Analyzer'
  },
  {
    path: '/analysis',
    priority: 0.9, // Higher priority since it's main functionality
    changefreq: 'weekly', // Less frequent since it's a tool page
    title: 'Website Analysis Tool'
  }
];

const generateSitemap = () => {
  const currentDate = new Date().toISOString().split('T')[0];
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${routes.map(route => `  <url>
    <loc>${baseUrl}${route.path}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  // Write sitemap to public directory
  const publicDir = path.join(__dirname, '..', 'public');
  const sitemapPath = path.join(publicDir, 'sitemap.xml');
  
  try {
    fs.writeFileSync(sitemapPath, sitemap);
    console.log('✅ Sitemap generated successfully at public/sitemap.xml');
    console.log(`📊 Generated sitemap with ${routes.length} URLs`);
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
  }
  
  // Generate enhanced robots.txt
  const robotsTxt = `# Robots.txt for analyzesites.com
User-agent: *
Allow: /

# Main pages
Allow: /
Allow: /about
Allow: /analysis

# Disallow dynamic analysis results for privacy
Disallow: /analysis?*
Disallow: /analysis/*
Disallow: /*?url=*

# Block common unwanted paths
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /static/
Disallow: *.json$

# Allow important files
Allow: /robots.txt
Allow: /sitemap.xml
Allow: /favicon.ico

# Sitemap location
Sitemap: ${baseUrl}/sitemap.xml

# Crawl delay (optional - remove if you want faster crawling)
Crawl-delay: 1

# Specific bot instructions
User-agent: Googlebot
Allow: /
Crawl-delay: 0

User-agent: Bingbot
Allow: /
Crawl-delay: 1`;

  const robotsPath = path.join(publicDir, 'robots.txt');
  
  try {
    fs.writeFileSync(robotsPath, robotsTxt);
    console.log('✅ Enhanced robots.txt generated successfully');
  } catch (error) {
    console.error('❌ Error generating robots.txt:', error);
  }

  // Generate a simple JSON manifest for the sitemap (useful for monitoring)
  const sitemapManifest = {
    generated: new Date().toISOString(),
    baseUrl: baseUrl,
    totalUrls: routes.length,
    routes: routes.map(route => ({
      path: route.path,
      fullUrl: `${baseUrl}${route.path}`,
      priority: route.priority,
      changefreq: route.changefreq
    }))
  };

  const manifestPath = path.join(publicDir, 'sitemap-manifest.json');
  try {
    fs.writeFileSync(manifestPath, JSON.stringify(sitemapManifest, null, 2));
    console.log('✅ Sitemap manifest generated for monitoring');
  } catch (error) {
    console.error('❌ Error generating sitemap manifest:', error);
  }
};

// Ensure public directory exists
const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

generateSitemap();

module.exports = { generateSitemap, routes };