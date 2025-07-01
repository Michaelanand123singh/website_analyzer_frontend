const fs = require('fs');
const path = require('path');

// Use dynamic import for ES modules
async function optimizeBuild() {
  try {
    const { default: imagemin } = await import('imagemin');
    const { default: imageminJpegtran } = await import('imagemin-jpegtran');
    const { default: imageminPngquant } = await import('imagemin-pngquant');
    const { default: imageminSvgo } = await import('imagemin-svgo');
    const { default: imageminWebp } = await import('imagemin-webp');

    const buildDir = path.join(__dirname, '..', 'build');
    
    console.log('🚀 Starting build optimization...');

    // Optimize images
    console.log('📸 Optimizing images...');
    
    const files = await imagemin([`${buildDir}/static/media/*.{jpg,jpeg,png,svg}`], {
      destination: `${buildDir}/static/media`,
      plugins: [
        imageminJpegtran(),
        imageminPngquant({
          quality: [0.6, 0.8]
        }),
        imageminSvgo({
          plugins: [
            {
              name: 'removeViewBox',
              active: false
            }
          ]
        })
      ]
    });

    console.log(`✅ Optimized ${files.length} images`);

    // Generate WebP versions
    console.log('🖼️  Generating WebP versions...');
    
    const webpFiles = await imagemin([`${buildDir}/static/media/*.{jpg,jpeg,png}`], {
      destination: `${buildDir}/static/media`,
      plugins: [
        imageminWebp({
          quality: 80
        })
      ]
    });

    console.log(`✅ Generated ${webpFiles.length} WebP images`);

    // Optimize CSS and JS (basic minification check)
    console.log('🎨 Checking CSS/JS optimization...');
    
    const cssFiles = fs.readdirSync(`${buildDir}/static/css`).filter(file => file.endsWith('.css'));
    const jsFiles = fs.readdirSync(`${buildDir}/static/js`).filter(file => file.endsWith('.js'));
    
    console.log(`✅ Found ${cssFiles.length} CSS files and ${jsFiles.length} JS files`);

    // Add cache headers to static files (create .htaccess for Apache)
    const htaccessContent = `# Cache static assets
<IfModule mod_expires.c>
  ExpiresActive on
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
</IfModule>

# Gzip compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/plain
  AddOutputFilterByType DEFLATE text/html
  AddOutputFilterByType DEFLATE text/xml
  AddOutputFilterByType DEFLATE text/css
  AddOutputFilterByType DEFLATE application/xml
  AddOutputFilterByType DEFLATE application/xhtml+xml
  AddOutputFilterByType DEFLATE application/rss+xml
  AddOutputFilterByType DEFLATE application/javascript
  AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>`;

    fs.writeFileSync(`${buildDir}/.htaccess`, htaccessContent);
    console.log('✅ Generated .htaccess for caching and compression');

    console.log('🎉 Build optimization completed successfully!');
    
  } catch (error) {
    console.error('❌ Build optimization failed:', error.message);
    // Don't fail the build process, just log the error
    console.log('⚠️  Continuing without optimization...');
  }
}

// Run the optimization
optimizeBuild();