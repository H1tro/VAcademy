require('dotenv').config({ path: '.env.local' });

const fs = require('fs');
const path = require('path');
const { put } = require('@vercel/blob');

const SECTIONS = [
  { dir: path.join(__dirname, '../../Desktop/Раздел 1'), prefix: 'section1' },
  { dir: path.join(__dirname, '../../Desktop/Раздел 2'), prefix: 'section2' },
  { dir: path.join(__dirname, '../../Desktop/Раздел 3'), prefix: 'section3' },
  { dir: path.join(__dirname, '../../Desktop/Раздел 4'), prefix: 'section4' },
];

async function uploadMatematikaFiles() {
  console.log('📤 Загрузка файлов математики в Vercel Blob...\n');

  let total = 0;

  for (const { dir, prefix } of SECTIONS) {
    if (!fs.existsSync(dir)) {
      console.log(`⚠️ Папка не найдена: ${dir}`);
      continue;
    }

    const files = fs.readdirSync(dir);
    console.log(`📁 ${prefix} — найдено ${files.length} файлов`);

    for (const file of files) {
      const filePath = path.join(dir, file);

      if (!fs.statSync(filePath).isFile()) continue;

      const blobPath = `matematika/${prefix}/${file}`;
      const fileContent = fs.readFileSync(filePath);

      console.log(`  ⏳ ${file}`);

      try {
        const blob = await put(blobPath, fileContent, {
          access: 'public',
          contentType: 'application/pdf',
        });
        console.log(`  ✅ ${blob.url}`);
        total++;
      } catch (error) {
        console.error(`  ❌ ${file}: ${error.message}`);
      }
    }

    console.log('');
  }

  console.log(`✨ Готово! Загружено ${total} файлов.`);
}

uploadMatematikaFiles().catch((err) => {
  console.error('❌ Ошибка:', err.message);
  process.exit(1);
});
