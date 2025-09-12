#!/usr/bin/env node
// Universal build script for Cloudflare Pages deployment

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting Cloudflare Pages build process...');
console.log('Current working directory:', process.cwd());
console.log('Directory contents:', fs.readdirSync('.'));

// Check if frontend directory exists
if (fs.existsSync('frontend') && fs.statSync('frontend').isDirectory()) {
  console.log('Found frontend directory. Changing to frontend directory...');
  
  try {
    // Change to frontend directory
    process.chdir('frontend');
    console.log('Current directory:', process.cwd());
    console.log('Frontend directory contents:', fs.readdirSync('.'));
    
    // Check if package.json exists
    if (fs.existsSync('package.json')) {
      console.log('Found package.json. Installing dependencies...');
      execSync('npm install', { stdio: 'inherit' });
      
      console.log('Building frontend application...');
      execSync('npm run build', { stdio: 'inherit' });
      
      console.log('Build completed successfully!');
      
      // Check if dist directory exists
      if (fs.existsSync('dist') && fs.statSync('dist').isDirectory()) {
        console.log('Dist directory contents:', fs.readdirSync('dist'));
      } else {
        console.log('WARNING: Dist directory not found!');
      }
    } else {
      console.error('ERROR: package.json not found in frontend directory!');
      process.exit(1);
    }
  } catch (error) {
    console.error('ERROR during build process:', error.message);
    process.exit(1);
  }
} else {
  console.error('ERROR: frontend directory not found!');
  console.log('Available directories:');
  const items = fs.readdirSync('.');
  items.forEach(item => {
    if (fs.statSync(item).isDirectory()) {
      console.log('  -', item);
    }
  });
  process.exit(1);
}