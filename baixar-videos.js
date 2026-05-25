/**
 * AUTO SPORT - Script de Download de Vídeos do Hero
 * Execute: node baixar-videos.js
 * Os vídeos serão salvos em public/videos/
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, 'public', 'videos');
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// Lista de videos a baixar (com fallbacks)
const videoQueue = [
  {
    label: 'Hero Slide 1 - Carro Esportivo',
    filename: 'hero-slide1.mp4',
    sources: [
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
      'https://filesamples.com/samples/video/mp4/sample_1280x720.mp4',
    ]
  },
  {
    label: 'Hero Slide 2 - Test Drive',
    filename: 'hero-slide2.mp4',
    sources: [
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4',
      'https://filesamples.com/samples/video/mp4/sample_960x400_ocean_with_audio.mp4',
    ]
  },
  {
    label: 'Hero Slide 3 - Joyride',
    filename: 'hero-slide3.mp4',
    sources: [
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
      'https://filesamples.com/samples/video/mp4/sample_640x360.mp4',
    ]
  }
];

function downloadUrl(url, destPath, redirectCount = 0) {
  return new Promise((resolve, reject) => {
    if (redirectCount > 5) return reject(new Error('Too many redirects'));

    const isHttps = url.startsWith('https');
    const mod = isHttps ? https : http;

    const req = mod.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    }, res => {
      if ([301, 302, 307, 308].includes(res.statusCode) && res.headers.location) {
        resolve(downloadUrl(res.headers.location, destPath, redirectCount + 1));
        return;
      }

      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }

      const ct = res.headers['content-type'] || '';
      if (!ct.includes('video') && !ct.includes('octet-stream')) {
        reject(new Error(`Content-Type invalido: ${ct}`));
        return;
      }

      const total = parseInt(res.headers['content-length'] || '0', 10);
      let downloaded = 0;
      let lastLog = 0;

      const file = fs.createWriteStream(destPath);
      res.pipe(file);

      res.on('data', chunk => {
        downloaded += chunk.length;
        const now = Date.now();
        if (now - lastLog > 2000 && total > 0) {
          const pct = ((downloaded / total) * 100).toFixed(0);
          process.stdout.write(`  ${pct}% (${(downloaded/1024/1024).toFixed(1)} / ${(total/1024/1024).toFixed(1)} MB)\r`);
          lastLog = now;
        }
      });

      file.on('finish', () => {
        file.close();
        const size = fs.statSync(destPath).size;
        if (size < 10000) {
          fs.unlinkSync(destPath);
          reject(new Error(`Arquivo muito pequeno: ${size} bytes`));
        } else {
          resolve(`${(size / 1024 / 1024).toFixed(1)} MB`);
        }
      });

      file.on('error', reject);
    });

    req.on('error', reject);
    req.setTimeout(120000, () => {
      req.destroy();
      reject(new Error('Timeout de 120s'));
    });
  });
}

async function run() {
  console.log('╔═══════════════════════════════════════════╗');
  console.log('║  AUTO SPORT - Downloader de Vídeos Hero  ║');
  console.log('╚═══════════════════════════════════════════╝\n');

  for (const video of videoQueue) {
    const destPath = path.join(OUTPUT_DIR, video.filename);

    if (fs.existsSync(destPath) && fs.statSync(destPath).size > 100000) {
      console.log(`✅ ${video.filename} já existe (${(fs.statSync(destPath).size/1024/1024).toFixed(1)} MB) - pulando\n`);
      continue;
    }

    console.log(`⬇️  Baixando: ${video.label}`);
    let success = false;

    for (const url of video.sources) {
      console.log(`   Fonte: ${url.substring(0, 70)}...`);
      try {
        const size = await downloadUrl(url, destPath);
        console.log(`\n   ✅ Salvo em public/videos/${video.filename} (${size})\n`);
        success = true;
        break;
      } catch (err) {
        console.log(`\n   ❌ Falhou: ${err.message}`);
      }
    }

    if (!success) {
      console.log(`   ⚠️  Todos os fontes falharam para ${video.filename}\n`);
    }
  }

  console.log('\n═══════════════════════════════════════════════');
  const downloaded = videoQueue.filter(v => {
    const p = path.join(OUTPUT_DIR, v.filename);
    return fs.existsSync(p) && fs.statSync(p).size > 100000;
  }).length;

  console.log(`✅ ${downloaded}/${videoQueue.length} vídeos prontos em public/videos/`);
  if (downloaded === videoQueue.length) {
    console.log('\n🎬 Todos os vídeos prontos! Reinicie o servidor para aplicar.');
  } else {
    console.log('\n⚠️  Alguns vídeos falharam. Os posters serão usados como fallback visual.');
  }
}

run().catch(console.error);
