// scripts/optimize-build.js
const fs = require('fs');
const path = require('path');
const imagemin = require('imagemin');
const imageminWebp = require('imagemin-webp');
const imageminPngquant = require('imagemin-pngquant');
const imageminMozjpeg = require('imagemin-mozjpeg');

const optimizeBuild = async () => {
  console.log('🚀 Starting build optimization...');
  
  const buildDir = path.join(__dirname, '..', 'build');
  
  if (!fs.existsSync(buildDir)) {
    console.log('❌ Build directory not found. Run "npm run build" first.');
    return;
  }

  try {
    // Optimize images
    console.log('🖼️  Optimizing images...');
    const imageFiles = await imagemin([`${buildDir}/**/*.{jpg,jpeg,png}`], {
      destination: `${buildDir}/optimized`,
      plugins: [
        imageminMozjpeg({quality: 85}),
        imageminPngquant({quality: [0.6, 0.8]}),
        imageminWebp({quality: 80})
      ]
    });
    
    if (imageFiles.length > 0) {
      console.log(`✅ Optimized ${imageFiles.length} images`);
    }
    
    // Generate performance budget report
    const staticDir = path.join(buildDir, 'static');
    if (fs.existsSync(staticDir)) {
      const jsFiles = fs.readdirSync(path.join(staticDir, 'js'))
        .filter(file => file.endsWith('.js'))
        .map(file => {
          const filePath = path.join(staticDir, 'js', file);
          const stats = fs.statSync(filePath);
          return {
            name: file,
            size: stats.size,
            sizeKB: Math.round(stats.size / 1024)
          };
        });
      
      const cssFiles = fs.readdirSync(path.join(staticDir, 'css'))
        .filter(file => file.endsWith('.css'))
        .map(file => {
          const filePath = path.join(staticDir, 'css', file);
          const stats = fs.statSync(filePath);
          return {
            name: file,
            size: stats.size,
            sizeKB: Math.round(stats.size / 1024)
          };
        });
      
      console.log('\n📊 Bundle Analysis:');
      console.log('JavaScript files:');
      jsFiles.forEach(file => {
        const status = file.sizeKB > 250 ? '⚠️ ' : '✅';
        console.log(`  ${status} ${file.name}: ${file.sizeKB}KB`);
      });
      
      console.log('CSS files:');
      cssFiles.forEach(file => {
        const status = file.sizeKB > 50 ? '⚠️ ' : '✅';
        console.log(`  ${status} ${file.name}: ${file.sizeKB}KB`);
      });
      
      const totalJS = jsFiles.reduce((sum, file) => sum + file.sizeKB, 0);
      const totalCSS = cssFiles.reduce((sum, file) => sum + file.sizeKB, 0);
      
      console.log(`\n📈 Total bundle size: ${totalJS + totalCSS}KB`);
      console.log(`   JavaScript: ${totalJS}KB`);
      console.log(`   CSS: ${totalCSS}KB`);
      
      if (totalJS > 500) {
        console.log('⚠️  Consider code splitting to reduce JavaScript bundle size');
      }
    }
    
    // Add cache headers suggestion
    console.log('\n🔧 Recommended .htaccess rules for caching:');
    console.log(`
# Add to your .htaccess file:
<IfModule mod_expires.c>
  ExpiresActive on
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
</IfModule>
    `);
    
    console.log('✅ Build optimization completed!');
    
  } catch (error) {
    console.error('❌ Error during optimization:', error);
  }
};

optimizeBuild();