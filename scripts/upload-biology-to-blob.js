require('dotenv').config({ path: '.env.local' });

const fs = require('fs');
const path = require('path');
const { put } = require('@vercel/blob');

async function uploadBiologyFiles() {
  try {
    const biologyDir = path.join(__dirname, '../src/lib/Biology');
    const files = fs.readdirSync(biologyDir);
    
    console.log(`📤 Found ${files.length} biology files. Starting upload to Vercel Blob...`);
    
    for (const file of files) {
      const filePath = path.join(biologyDir, file);
      const fileContent = fs.readFileSync(filePath);
      
      console.log(`⏳ Uploading: ${file}`);
      
      try {
        const blob = await put(`biology/${file}`, fileContent, {
          access: 'public',
          contentType: 'application/pdf',
        });
        
        console.log(`✅ ${file} uploaded successfully`);
        console.log(`   URL: ${blob.url}`);
      } catch (error) {
        console.error(`❌ Failed to upload ${file}:`, error.message);
      }
    }
    
    console.log('\n✨ Upload process completed!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

uploadBiologyFiles();
