/**
 * CyCrack Build Script
 * Obfuscates JavaScript, minifies CSS/HTML, and outputs to dist/
 */

const fs = require('fs');
const path = require('path');
const JavaScriptObfuscator = require('javascript-obfuscator');
const CleanCSS = require('clean-css');
const { minify } = require('html-minifier-terser');

// Configuration
const srcDir = path.join(__dirname, 'src');
const distDir = path.join(__dirname, 'dist');

// Files to process
const jsFiles = ['app.js', 'ciphers.js', 'levels.js'];
const cssFiles = ['styles.css'];
const htmlFiles = ['index.html', '404.html'];
const copyFiles = ['.nojekyll'];

// Obfuscator options (high obfuscation)
const obfuscatorOptions = {
    compact: true,
    controlFlowFlattening: true,
    controlFlowFlatteningThreshold: 0.75,
    deadCodeInjection: true,
    deadCodeInjectionThreshold: 0.4,
    debugProtection: false,
    disableConsoleOutput: true,
    identifierNamesGenerator: 'hexadecimal',
    log: false,
    numbersToExpressions: true,
    renameGlobals: false,
    selfDefending: true,
    simplify: true,
    splitStrings: true,
    splitStringsChunkLength: 10,
    stringArray: true,
    stringArrayCallsTransform: true,
    stringArrayEncoding: ['base64'],
    stringArrayIndexShift: true,
    stringArrayRotate: true,
    stringArrayShuffle: true,
    stringArrayWrappersCount: 2,
    stringArrayWrappersChainedCalls: true,
    stringArrayWrappersParametersMaxCount: 4,
    stringArrayWrappersType: 'function',
    stringArrayThreshold: 0.75,
    transformObjectKeys: true,
    unicodeEscapeSequence: false
};

// CSS minifier options
const cssOptions = {
    level: 2
};

// HTML minifier options
const htmlOptions = {
    collapseWhitespace: true,
    removeComments: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    useShortDoctype: true,
    minifyCSS: true,
    minifyJS: true
};

// Ensure dist directory exists
function ensureDistDir() {
    if (fs.existsSync(distDir)) {
        fs.rmSync(distDir, { recursive: true });
    }
    fs.mkdirSync(distDir, { recursive: true });
    console.log('✓ Created dist directory');
}

// Obfuscate JavaScript files
function obfuscateJS() {
    console.log('\n📦 Obfuscating JavaScript...');
    
    jsFiles.forEach(file => {
        const srcPath = path.join(srcDir, file);
        const distPath = path.join(distDir, file);
        
        if (!fs.existsSync(srcPath)) {
            console.log(`  ⚠ Skipping ${file} (not found)`);
            return;
        }
        
        const code = fs.readFileSync(srcPath, 'utf8');
        const obfuscatedCode = JavaScriptObfuscator.obfuscate(code, obfuscatorOptions);
        
        fs.writeFileSync(distPath, obfuscatedCode.getObfuscatedCode());
        
        const originalSize = (code.length / 1024).toFixed(1);
        const newSize = (obfuscatedCode.getObfuscatedCode().length / 1024).toFixed(1);
        console.log(`  ✓ ${file}: ${originalSize}KB → ${newSize}KB`);
    });
}

// Minify CSS files
function minifyCSS() {
    console.log('\n🎨 Minifying CSS...');
    
    const cleanCSS = new CleanCSS(cssOptions);
    
    cssFiles.forEach(file => {
        const srcPath = path.join(srcDir, file);
        const distPath = path.join(distDir, file);
        
        if (!fs.existsSync(srcPath)) {
            console.log(`  ⚠ Skipping ${file} (not found)`);
            return;
        }
        
        const css = fs.readFileSync(srcPath, 'utf8');
        const minified = cleanCSS.minify(css);
        
        fs.writeFileSync(distPath, minified.styles);
        
        const originalSize = (css.length / 1024).toFixed(1);
        const newSize = (minified.styles.length / 1024).toFixed(1);
        console.log(`  ✓ ${file}: ${originalSize}KB → ${newSize}KB`);
    });
}

// Minify HTML files
async function minifyHTML() {
    console.log('\n📄 Minifying HTML...');
    
    for (const file of htmlFiles) {
        const srcPath = path.join(srcDir, file);
        const distPath = path.join(distDir, file);
        
        if (!fs.existsSync(srcPath)) {
            console.log(`  ⚠ Skipping ${file} (not found)`);
            continue;
        }
        
        const html = fs.readFileSync(srcPath, 'utf8');
        const minified = await minify(html, htmlOptions);
        
        fs.writeFileSync(distPath, minified);
        
        const originalSize = (html.length / 1024).toFixed(1);
        const newSize = (minified.length / 1024).toFixed(1);
        console.log(`  ✓ ${file}: ${originalSize}KB → ${newSize}KB`);
    }
}

// Copy additional files
function copyAdditionalFiles() {
    console.log('\n📋 Copying additional files...');
    
    copyFiles.forEach(file => {
        const srcPath = path.join(srcDir, file);
        const distPath = path.join(distDir, file);
        
        if (!fs.existsSync(srcPath)) {
            console.log(`  ⚠ Skipping ${file} (not found)`);
            return;
        }
        
        fs.copyFileSync(srcPath, distPath);
        console.log(`  ✓ ${file}`);
    });
}

// Main build function
async function build() {
    console.log('🔐 CyCrack Build Process');
    console.log('========================\n');
    
    try {
        ensureDistDir();
        obfuscateJS();
        minifyCSS();
        await minifyHTML();
        copyAdditionalFiles();
        
        console.log('\n✅ Build complete! Output in dist/');
        console.log('\nTo deploy to GitHub Pages:');
        console.log('  npm run deploy');
    } catch (error) {
        console.error('\n❌ Build failed:', error.message);
        process.exit(1);
    }
}

build();
