require('dotenv').config({ path: '.env.local' });

const fs = require('fs');
const path = require('path');
const { put } = require('@vercel/blob');

async function uploadPlaceholderImages() {
  try {
    // Read the placeholder images JSON file
    const jsonPath = path.join(__dirname, '../src/app/lib/placeholder-images.json');
    const fileContent = fs.readFileSync(jsonPath, 'utf-8');
    
    console.log('📤 Uploading placeholder-images.json to Vercel Blob...');
    
    const blob = await put('placeholder-images.json', fileContent, {
      access: 'public',
      contentType: 'application/json',
    });
    
    console.log('✅ Successfully uploaded!');
    console.log('📍 Blob URL:', blob.url);
    console.log('Blob pathname:', blob.pathname);
    
  } catch (error) {
    console.error('❌ Error uploading to Vercel Blob:', error.message);
    process.exit(1);
  }
}

uploadPlaceholderImages();
