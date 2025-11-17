import sharp from 'sharp';
import { readFileSync, statSync } from 'fs';

const svgBuffer = readFileSync('moby.svg');

// Use dark blue background to make the light blue whale (#98c9ff) stand out
// This matches the app's darker blue theme color
sharp(svgBuffer)
  .resize(512, 512, {
    fit: 'contain',
    background: { r: 25, g: 118, b: 210, alpha: 1 } // Dark blue #1976D2 for contrast
  })
  .png()
  .toFile('moby-icon-512.png')
  .then(() => {
    console.log('Successfully created moby-icon-512.png (512x512)');
    // Check file size
    const stats = statSync('moby-icon-512.png');
    const fileSizeInMB = stats.size / (1024 * 1024);
    console.log(`File size: ${fileSizeInMB.toFixed(2)} MB`);
    if (fileSizeInMB > 1) {
      console.log('Warning: File size exceeds 1MB. Consider optimizing.');
    }
  })
  .catch(err => {
    console.error('Error converting SVG:', err);
    process.exit(1);
  });

