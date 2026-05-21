const { execSync } = require('child_process');
const fs = require('fs');

if (process.env.RENDER) {
  console.log('🚀 Running Render Build (Backend)...');
  // Install server dependencies
  execSync('cd server && npm install', { stdio: 'inherit' });
} else {
  console.log('📦 Running Client Build (Frontend)...');
  // Build client
  execSync('cd client && npm run build', { stdio: 'inherit' });
  
  // Copy build files to root dist folder for Vercel
  console.log('🚚 Copying build to root dist folder...');
  fs.rmSync('./dist', { recursive: true, force: true });
  fs.cpSync('./client/dist', './dist', { recursive: true });
}
