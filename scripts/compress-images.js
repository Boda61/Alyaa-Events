import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PUBLIC = path.join(__dirname, '..', 'public');
const PICTURE = path.join(PUBLIC, 'picture');
const BEFOREAFTER = path.join(PUBLIC, 'beforeafter');

// Width per filename pattern — never upscale
const WIDTH_RULES = [
  { pattern: /^design\s?\d+\.jpe?g$/i,        width: 800 },
  { pattern: /^Design\s?\d+\.jpe?g$/i,         width: 800 },
  { pattern: /^(after|before)\s?\d+\.jpe?g$/i, width: 900 },
  { pattern: /^(after|before)\d+\.(jpg|jpeg)$/i, width: 900 },
  { pattern: /logo\.(jpg|jpeg|png)$/i,          width: 300 },
  { pattern: /hero-bg/i,                        width: 1920 },
];
const DEFAULT_WIDTH = 900;
const JPEG_QUALITY  = 82;
const WEBP_QUALITY  = 80;

function getWidth(filename) {
  for (const rule of WIDTH_RULES) {
    if (rule.pattern.test(filename)) return rule.width;
  }
  return DEFAULT_WIDTH;
}

async function processImage(filePath) {
  const filename = path.basename(filePath);
  const dir      = path.dirname(filePath);
  const ext      = path.extname(filename).toLowerCase();
  const base     = path.basename(filename, ext);
  const webpPath = path.join(dir, base + '.webp');

  if (ext === '.webp') return null;

  const width = getWidth(filename);

  try {
    const originalSize = fs.statSync(filePath).size;
    // Read into buffer first — avoids sharp's Unicode/space path issues on Windows
    const inputBuf = fs.readFileSync(filePath);
    const meta = await sharp(inputBuf).metadata();
    const targetWidth = (meta.width && meta.width < width) ? meta.width : width;

    // Re-compress JPEG in-place only if it saves >5%
    const jpegBuf = await sharp(inputBuf)
      .resize({ width: targetWidth, withoutEnlargement: true })
      .jpeg({ quality: JPEG_QUALITY, mozjpeg: true, progressive: true })
      .toBuffer();
    if (jpegBuf.length < originalSize * 0.95) {
      fs.writeFileSync(filePath, jpegBuf);
    }

    // Write WebP alongside original (read fresh compressed jpeg)
    const jpegForWebP = fs.readFileSync(filePath);
    const webpBuf = await sharp(jpegForWebP)
      .resize({ width: targetWidth, withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY, effort: 4 })
      .toBuffer();
    fs.writeFileSync(webpPath, webpBuf);

    const newJpegSize = fs.statSync(filePath).size;
    const webpSize    = fs.statSync(webpPath).size;

    return {
      file:       filename,
      originalKB: Math.round(originalSize / 1024),
      jpegKB:     Math.round(newJpegSize / 1024),
      webpKB:     Math.round(webpSize / 1024),
      savedKB:    Math.round((originalSize - webpSize) / 1024),
    };
  } catch (err) {
    console.error(`  FAILED: ${filename} — ${err.message}`);
    return null;
  }
}

async function processDir(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (fs.statSync(full).isFile() && /\.(jpe?g|png)$/i.test(entry)) {
      process.stdout.write(`  ${entry}...`);
      const r = await processImage(full);
      if (r) {
        process.stdout.write(` ${r.originalKB}KB -> WebP ${r.webpKB}KB (saved ${r.savedKB}KB)\n`);
        results.push(r);
      } else {
        process.stdout.write(' skipped\n');
      }
    }
  }
  return results;
}

async function main() {
  console.log('\n=== Image Compression ===\n');
  let all = [];

  console.log('picture/');
  all = all.concat(await processDir(PICTURE));

  console.log('\nbeforeafter/');
  all = all.concat(await processDir(BEFOREAFTER));

  const logoPath = path.join(PUBLIC, 'logo.jpg');
  if (fs.existsSync(logoPath)) {
    console.log('\npublic/logo.jpg');
    process.stdout.write('  logo.jpg...');
    const r = await processImage(logoPath);
    if (r) { process.stdout.write(` ${r.originalKB}KB -> WebP ${r.webpKB}KB\n`); all.push(r); }
  }

  const totalOrig  = all.reduce((s, r) => s + r.originalKB, 0);
  const totalWebP  = all.reduce((s, r) => s + r.webpKB, 0);
  const totalSaved = totalOrig - totalWebP;

  console.log('\n=== Summary ===');
  console.log('Files processed : ' + all.length);
  console.log('Original total  : ' + (totalOrig  / 1024).toFixed(1) + ' MB');
  console.log('WebP total      : ' + (totalWebP  / 1024).toFixed(1) + ' MB');
  console.log('Total saved     : ' + (totalSaved / 1024).toFixed(1) + ' MB (' + Math.round(totalSaved / totalOrig * 100) + '%)');
}

main().catch(console.error);
