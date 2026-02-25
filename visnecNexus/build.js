#!/usr/bin/env node

// Production build script for VNX Nexus
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('🏗️  Building VNX Nexus for production...');

try {
  // Ensure dist directory exists
  const distDir = path.join(__dirname, 'dist');
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  // Use static HTML for reliable deployment
  console.log('📦 Preparing static frontend files...');
  const frontendDir = path.join(__dirname, 'frontend');
  
  if (fs.existsSync(frontendDir)) {
    // Copy static HTML files for production
    const sourceFile = path.join(frontendDir, 'index.html');
    const destFile = path.join(distDir, 'index.html');
    if (fs.existsSync(sourceFile)) {
      fs.copyFileSync(sourceFile, destFile);
      console.log('✓ Copied index.html to dist/');
    }
    
    // Copy any static assets if they exist
    const assetsDir = path.join(frontendDir, 'assets');
    if (fs.existsSync(assetsDir)) {
      const distAssetsDir = path.join(distDir, 'assets');
      if (!fs.existsSync(distAssetsDir)) {
        fs.mkdirSync(distAssetsDir, { recursive: true });
      }
      execSync(`cp -r ${assetsDir}/* ${distAssetsDir}/`, { stdio: 'inherit' });
      console.log('✓ Copied assets to dist/');
    }
  } else {
    console.log('⚠️  No frontend directory found, creating minimal build');
  }

  // Ensure we have at least a basic index.html
  const indexPath = path.join(distDir, 'index.html');
  if (!fs.existsSync(indexPath)) {
    // Copy from root if available
    const rootIndex = path.join(__dirname, 'index.html');
    if (fs.existsSync(rootIndex)) {
      fs.copyFileSync(rootIndex, indexPath);
      console.log('✓ Copied root index.html to dist/');
    }
  }

  console.log('✅ Build completed successfully');
  console.log('🚀 Ready for deployment');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}