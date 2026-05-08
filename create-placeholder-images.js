const fs = require('fs');
const path = require('path');

// Create placeholder SVG content for vehicles
function createVehicleSVG(make, model, year, color = '#0F172A') {
  return `<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
    <rect width="800" height="600" fill="${color}"/>
    <text x="400" y="280" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="32" font-weight="bold">
      ${make} ${model}
    </text>
    <text x="400" y="320" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="24">
      ${year}
    </text>
    <rect x="300" y="350" width="200" height="80" fill="none" stroke="white" stroke-width="2" rx="10"/>
    <text x="400" y="395" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="18">
      Vehicle Image
    </text>
  </svg>`;
}

// Vehicles to create placeholders for
const vehicles = [
  { make: 'Toyota', model: 'Camry', year: 2021, images: ['camry-1', 'camry-2', 'camry-3'] },
  { make: 'Honda', model: 'Civic', year: 2020, images: ['civic-1', 'civic-2', 'civic-3'] },
  { make: 'Ford', model: 'F-150', year: 2019, images: ['f150-1', 'f150-2', 'f150-3'] },
  { make: 'Chevrolet', model: 'Equinox', year: 2022, images: ['equinox-1', 'equinox-2', 'equinox-3'] },
  { make: 'Nissan', model: 'Rogue', year: 2018, images: ['rogue-1', 'rogue-2', 'rogue-3'] },
  { make: 'Mercedes-Benz', model: 'C300', year: 2017, images: ['c300-1', 'c300-2', 'c300-3'] },
  { make: 'Hyundai', model: 'Elantra', year: 2023, images: ['elantra-1', 'elantra-2', 'elantra-3'] },
  { make: 'Kia', model: 'Sorento', year: 2021, images: ['sorento-1', 'sorento-2', 'sorento-3'] },
  { make: 'Ram', model: '1500', year: 2020, images: ['ram1500-1', 'ram1500-2', 'ram1500-3'] }
];

// Create the images directory if it doesn't exist
const imagesDir = path.join(__dirname, 'public', 'images', 'vehicles');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Generate placeholder images
vehicles.forEach(vehicle => {
  vehicle.images.forEach((imageName, index) => {
    const svgContent = createVehicleSVG(vehicle.make, vehicle.model, vehicle.year);
    const filePath = path.join(imagesDir, `${imageName}.svg`);
    fs.writeFileSync(filePath, svgContent);
    console.log(`Created: ${filePath}`);
  });
});

console.log('All placeholder vehicle images created successfully!');
