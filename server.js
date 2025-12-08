const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files with CORS headers for AR.js
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  
  // Important: Force HTTPS on production
  if (req.headers['x-forwarded-proto'] !== 'https' && process.env.NODE_ENV === 'production') {
    return res.redirect('https://' + req.headers.host + req.url);
  }
  
  next();
});

// Serve static files from current directory
app.use(express.static(__dirname, {
  setHeaders: (res, filePath) => {
    // Disable cache for development/debugging
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    // Set proper content type for GLB files
    if (filePath.endsWith('.glb')) {
      res.setHeader('Content-Type', 'model/gltf-binary');
    }
    // Set proper content type for GLTF files
    if (filePath.endsWith('.gltf')) {
      res.setHeader('Content-Type', 'model/gltf+json');
    }
    // Set proper content type for NFT marker files
    if (filePath.endsWith('.fset') || filePath.endsWith('.fset3') || filePath.endsWith('.iset')) {
      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader('Access-Control-Allow-Origin', '*');
    }
  }
}));

// Serve index.html for root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n🌲 Forest Tales AR Experience 🐻`);
  console.log(`================================`);
  console.log(`Server running on port ${PORT}`);
  console.log(`\n📱 Mobile Access:`);
  console.log(`   https://your-render-url.onrender.com`);
  console.log(`\n⚠️  IMPORTANT:`);
  console.log(`   - Must use HTTPS for camera access`);
  console.log(`   - Allow camera permissions when prompted`);
  console.log(`   - Print NFT markers from /forest, /bear, /text folders`);
  console.log(`================================\n`);
});