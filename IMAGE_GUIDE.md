# Vehicle Images Guide

## How to Add Real Car Images to Your Inventory

### Current Setup
The inventory page currently uses placeholder images from `via.placeholder.com`. These are temporary and should be replaced with real car images.

### Image Requirements
- **Format**: JPG, PNG, or WebP
- **Size**: 800x600px minimum (for good quality)
- **Aspect Ratio**: 4:3 recommended
- **File Size**: Under 500KB per image for fast loading

### Where to Get Images
You can obtain car images from:
1. **Manufacturer websites** (Toyota, Honda, Ford, etc.)
2. **Stock photo sites** (Unsplash, Pexels, Pixabay)
3. **Car photography websites**
4. **Your own photos** (if you have actual inventory)

### How to Replace Images

#### Option 1: Update the vehicles.ts file
Replace the placeholder URLs in `/data/vehicles.ts`:

```typescript
// Before (placeholder)
images: [
  'https://via.placeholder.com/800x600/0F172A/FFFFFF?text=Toyota+Camry+2021',
  'https://via.placeholder.com/800x600/0F172A/FFFFFF?text=Toyota+Camry+Side+View',
  'https://via.placeholder.com/800x600/0F172A/FFFFFF?text=Toyota+Camry+Interior',
],

// After (real images)
images: [
  'https://example.com/toyota-camry-2021-front.jpg',
  'https://example.com/toyota-camry-2021-side.jpg',
  'https://example.com/toyota-camry-2021-interior.jpg',
],
```

#### Option 2: Use local images
1. Create a folder: `public/images/vehicles/`
2. Add your images to this folder
3. Update the paths in `vehicles.ts`:

```typescript
images: [
  '/images/vehicles/toyota-camry-2021-front.jpg',
  '/images/vehicles/toyota-camry-2021-side.jpg',
  '/images/vehicles/toyota-camry-2021-interior.jpg',
],
```

### Recommended Image Sources
1. **Unsplash** - Free high-quality car photos
2. **Pexels** - Free stock photos
3. **Manufacturer Press Kits** - Official product photos
4. **Car Review Sites** - Professional photography

### Image Naming Convention
Use descriptive names like:
- `toyota-camry-2021-front.jpg`
- `honda-civic-2020-side.jpg`
- `ford-f150-2019-interior.jpg`

### Current Vehicles in Inventory
1. Toyota Camry SE 2021
2. Honda Civic LX 2020
3. Ford F-150 XLT 2019
4. Chevrolet Equinox LT 2022
5. Nissan Rogue S 2018
6. Mercedes-Benz C300 2017
7. Hyundai Elantra 2023
8. Kia Sorento 2021
9. Ram 1500 Big Horn 2020

### Tips for Better Images
- Use consistent lighting across all images
- Show multiple angles (front, side, rear, interior)
- Ensure high resolution for zoom functionality
- Remove backgrounds if possible (product-style photos)
- Maintain consistent aspect ratios

### Legal Considerations
- Ensure you have rights to use the images
- Credit photographers if required
- Check manufacturer image usage policies
- Consider watermarking your own photos

### Testing
After updating images:
1. Restart the development server
2. Check the inventory page
3. Verify all images load properly
4. Test on mobile devices
5. Check loading performance

### Need Help?
If you need assistance with specific vehicles or image sources, let me know which cars you'd like to focus on first!
