/**
 * Generate all required favicon formats from the source PNG
 *
 * Run: node scripts/generate-favicons.js
 *
 * This will create all favicon files needed for the website
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SOURCE_IMAGE = path.join(__dirname, '../src/assets/favicon.png');
const OUTPUT_DIR = path.join(__dirname, '../public');

async function generateFavicons() {
    console.log('🎨 Generating favicons from:', SOURCE_IMAGE);
    console.log('📁 Output directory:', OUTPUT_DIR);
    console.log('');

    try {
        // Ensure output directory exists
        if (!fs.existsSync(OUTPUT_DIR)) {
            fs.mkdirSync(OUTPUT_DIR, { recursive: true });
        }

        // 1. Generate favicon-16x16.png
        console.log('📦 Generating favicon-16x16.png...');
        await sharp(SOURCE_IMAGE)
            .resize(16, 16)
            .toFile(path.join(OUTPUT_DIR, 'favicon-16x16.png'));

        // 2. Generate favicon-32x32.png
        console.log('📦 Generating favicon-32x32.png...');
        await sharp(SOURCE_IMAGE)
            .resize(32, 32)
            .toFile(path.join(OUTPUT_DIR, 'favicon-32x32.png'));

        // 3. Generate apple-touch-icon.png (180x180)
        console.log('📦 Generating apple-touch-icon.png (180x180)...');
        await sharp(SOURCE_IMAGE)
            .resize(180, 180)
            .toFile(path.join(OUTPUT_DIR, 'apple-touch-icon.png'));

        // 4. Generate android-chrome-192x192.png
        console.log('📦 Generating android-chrome-192x192.png...');
        await sharp(SOURCE_IMAGE)
            .resize(192, 192)
            .toFile(path.join(OUTPUT_DIR, 'android-chrome-192x192.png'));

        // 5. Generate android-chrome-512x512.png
        console.log('📦 Generating android-chrome-512x512.png...');
        await sharp(SOURCE_IMAGE)
            .resize(512, 512)
            .toFile(path.join(OUTPUT_DIR, 'android-chrome-512x512.png'));

        // 6. Copy the original favicon.ico if it exists
        const icoSource = path.join(__dirname, '../src/app/favicon.ico');
        const icoDest = path.join(OUTPUT_DIR, 'favicon.ico');
        if (fs.existsSync(icoSource)) {
            console.log('📦 Copying favicon.ico...');
            fs.copyFileSync(icoSource, icoDest);
        }

        // 7. Create SVG version (simplified - you may need to manually create a proper SVG)
        console.log('📦 Creating icon.svg (placeholder)...');
        const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#000"/>
  <text x="50%" y="50%" font-size="256" text-anchor="middle" dominant-baseline="middle" fill="#fff" font-family="Arial, sans-serif" font-weight="bold">AF</text>
</svg>`;

        // Note: This creates a simple placeholder SVG.
        // For best results, manually create an SVG version of your logo
        fs.writeFileSync(path.join(OUTPUT_DIR, 'icon.svg'), svgContent);
        console.log('⚠️  Note: icon.svg is a placeholder. Consider creating a proper SVG version of your logo.');

        // 8. Create site.webmanifest
        console.log('📦 Creating site.webmanifest...');
        const manifest = {
            name: 'Artist Factory Budapest',
            short_name: 'Artist Factory',
            description: 'Próbaterem és Stúdió Budapest',
            icons: [
                {
                    src: '/android-chrome-192x192.png',
                    sizes: '192x192',
                    type: 'image/png'
                },
                {
                    src: '/android-chrome-512x512.png',
                    sizes: '512x512',
                    type: 'image/png'
                }
            ],
            theme_color: '#ffffff',
            background_color: '#ffffff',
            display: 'standalone',
            start_url: '/hu'
        };

        fs.writeFileSync(
            path.join(OUTPUT_DIR, 'site.webmanifest'),
            JSON.stringify(manifest, null, 2)
        );

        console.log('');
        console.log('✅ All favicons generated successfully!');
        console.log('');
        console.log('📋 Generated files:');
        console.log('  - favicon.ico (copied)');
        console.log('  - favicon-16x16.png');
        console.log('  - favicon-32x32.png');
        console.log('  - apple-touch-icon.png');
        console.log('  - android-chrome-192x192.png');
        console.log('  - android-chrome-512x512.png');
        console.log('  - icon.svg (placeholder - consider creating a proper SVG)');
        console.log('  - site.webmanifest');
        console.log('');
        console.log('🚀 You can now deploy your changes!');

    } catch (error) {
        console.error('❌ Error generating favicons:', error);
        process.exit(1);
    }
}

// Check if sharp is installed
try {
    require.resolve('sharp');
    generateFavicons();
} catch (e) {
    console.error('❌ Error: "sharp" package is not installed.');
    console.log('');
    console.log('Please install it by running:');
    console.log('  npm install --save-dev sharp');
    console.log('');
    console.log('Then run this script again:');
    console.log('  node scripts/generate-favicons.js');
    process.exit(1);
}
