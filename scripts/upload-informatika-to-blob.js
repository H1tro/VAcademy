require('dotenv').config({ path: '.env.local' });

const fs = require('fs');
const path = require('path');
const { put } = require('@vercel/blob');

const DOCUMENTS_DIR = 'C:\\Users\\user\\Documents';

const FILES = [
  'Азы программирования (Начало).pdf',
  'Система и сети (Середина).pdf',
  'Парадигмы(Конец).pdf',
];

async function uploadInformatikaFiles() {
  console.log(`📤 Found ${FILES.length} informatics files. Starting upload to Vercel Blob...\n`);

  for (const file of FILES) {
    const filePath = path.join(DOCUMENTS_DIR, file);

    if (!fs.existsSync(filePath)) {
      console.error(`❌ File not found: ${filePath}`);
      continue;
    }

    const fileContent = fs.readFileSync(filePath);
    console.log(`⏳ Uploading: ${file}`);

    try {
      const blob = await put(`informatika/${file}`, fileContent, {
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
}

uploadInformatikaFiles();
