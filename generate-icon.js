import sharp from 'sharp';
import { readFileSync, statSync } from 'fs';

const svgBuffer = readFileSync('moby.svg');

// Use dark blue background to make the light blue whale (#98c9ff) stand out
// This matches the app's darker blue theme color
// Add padding to ensure whale fits within Android's adaptive icon safe zone (center 66%)
// The safe zone prevents cropping on different launchers
sharp(svgBuffer)
  .resize(340, 340, {  // 66% of 512 to fit in safe zone
    fit: 'contain',
    background: { r: 25, g: 118, b: 210, alpha: 1 } // Dark blue #1976D2 for contrast
  })
  .extend({
    top: 86,
    bottom: 86,
    left: 86,
    right: 86,
    background: { r: 25, g: 118, b: 210, alpha: 1 } // Extend with same background color
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

