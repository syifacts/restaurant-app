const sharp = require('sharp');
const fs = require('fs');


const compressImage = async (inputPath, outputPath, width, targetSizeKB) => {
  let quality = 80;
  const maxSizeBytes = targetSizeKB * 1024;


  while (quality > 0) {
    await sharp(inputPath)
      .resize({width})
      .toFormat('jpeg', {mozjpeg: true, quality})
      .toFile(outputPath);

    const {size} = fs.statSync(outputPath);
    if (size <= maxSizeBytes) {
      break;
    }

    quality -= 5;
  }

  console.log(`Gambar ${outputPath} terkompresi dengan ukuran ${Math.round(fs.statSync(outputPath).size / 1024)} KB`);
};


const inputImagePath = 'src/public/images/heros/hero-image_2.jpg';


const outputSmallPath = 'src/public/images/hero-image_2-small.jpg';
const outputMediumPath = 'src/public/images/hero-image_2-medium.jpg';
const outputLargePath = 'src/public/images/hero-image_2-large.jpg';


const compressImages = async () => {
  try {
    await compressImage(inputImagePath, outputSmallPath, 600, 200); // Small
    await compressImage(inputImagePath, outputMediumPath, 1200, 200); // Medium
    await compressImage(inputImagePath, outputLargePath, 1800, 200); // Large
    console.log('Semua gambar terkompresi!');
  } catch (err) {
    console.error('Terjadi kesalahan:', err);
  }
};


compressImages();
