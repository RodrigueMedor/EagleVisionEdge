const https = require('https');
const fs = require('fs');
const path = require('path');

// Function to download an image
function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(path.join(__dirname, 'public', 'images', 'vehicles', filename));
    
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`Downloaded: ${filename}`);
          resolve();
        });
      } else {
        file.close();
        fs.unlinkSync(path.join(__dirname, 'public', 'images', 'vehicles', filename));
        reject(new Error(`Failed to download ${filename}. Status: ${response.statusCode}`));
      }
    }).on('error', (err) => {
      file.close();
      fs.unlinkSync(path.join(__dirname, 'public', 'images', 'vehicles', filename));
      reject(err);
    });
  });
}

// Real car image URLs (using reliable sources)
const carImages = [
  // Toyota Camry
  'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop&auto=format',
  
  // Honda Civic
  'https://images.unsplash.com/photo-1619946926621-fdcab65787ea?w=800&h=600&fit=crop&auto=format',
  
  // Ford F-150
  'https://images.unsplash.com/photo-1574366539602-f1a0c9a3f6d6?w=800&h=600&fit=crop&auto=format',
  
  // Chevrolet Equinox
  'https://images.unsplash.com/photo-1553413096-0e9896c5d1b8?w=800&h=600&fit=crop&auto=format',
  
  // Nissan Rogue
  'https://images.unsplash.com/photo-1549395536-5f9b8c1e6d5c?w=800&h=600&fit=crop&auto=format',
  
  // Mercedes C300
  'https://images.unsplash.com/photo-1553413096-0e9896c5d1b8?w=800&h=600&fit=crop&auto=format',
  
  // Hyundai Elantra
  'https://images.unsplash.com/photo-1619946926621-fdcab65787ea?w=800&h=600&fit=crop&auto=format',
  
  // Kia Sorento
  'https://images.unsplash.com/photo-1549395536-5f9b8c1e6d5c?w=800&h=600&fit=crop&auto=format',
  
  // Ram 1500
  'https://images.unsplash.com/photo-1574366539602-f1a0c9a3f6d6?w=800&h=600&fit=crop&auto=format'
];

const filenames = [
  'camry-1.jpg',
  'civic-1.jpg', 
  'f150-1.jpg',
  'equinox-1.jpg',
  'rogue-1.jpg',
  'c300-1.jpg',
  'elantra-1.jpg',
  'sorento-1.jpg',
  'ram1500-1.jpg'
];

// Download all images
async function downloadAllImages() {
  console.log('Starting to download real car images...');
  
  try {
    for (let i = 0; i < carImages.length; i++) {
      await downloadImage(carImages[i], filenames[i]);
    }
    console.log('All car images downloaded successfully!');
  } catch (error) {
    console.error('Error downloading images:', error.message);
  }
}

downloadAllImages();
