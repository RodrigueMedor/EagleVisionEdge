# Netlify Deployment Guide for EagleVisionEdge

## Overview
This guide will help you deploy your Next.js auto dealership website to Netlify. The project has been configured for static site generation (SSG) which is optimal for Netlify's hosting platform.

## Prerequisites
- Netlify account (free tier is sufficient)
- Git repository (GitHub, GitLab, or Bitbucket)
- Project code pushed to the repository

## Configuration Files

### 1. netlify.toml
Your project includes a `netlify.toml` file with the following configuration:
- **Build command**: `npm run build`
- **Publish directory**: `out` (configured for static export)
- **Node version**: 18
- **Redirects**: Proper routing for Next.js pages

### 2. next.config.js
Updated for static export:
- `output: 'export'` - Enables static site generation
- `trailingSlash: true` - Ensures proper routing
- `distDir: 'out'` - Matches Netlify publish directory
- `images.unoptimized: true` - Required for static export

## Deployment Steps

### Method 1: Git Integration (Recommended)

1. **Push to Git Repository**
   ```bash
   git add .
   git commit -m "Configure for Netlify deployment"
   git push origin main
   ```

2. **Connect to Netlify**
   - Go to [netlify.com](https://netlify.com) and sign in
   - Click "Add new site" → "Import an existing project"
   - Connect your Git provider
   - Select your repository

3. **Configure Build Settings**
   - **Build command**: `npm run build`
   - **Publish directory**: `out`
   - **Node version**: 18
   - Click "Deploy site"

### Method 2: Drag and Drop

1. **Build Locally**
   ```bash
   npm run build
   ```

2. **Deploy**
   - Navigate to the `out` directory
   - Compress the entire directory into a ZIP file
   - Drag and drop the ZIP file to [app.netlify.com/drop](https://app.netlify.com/drop)

## Environment Variables (Optional)

If you need environment variables:
1. Go to Site settings → Environment variables
2. Add any required variables (API keys, etc.)
3. Redeploy your site

## Custom Domain (Optional)

1. Go to Site settings → Domain management
2. Add your custom domain
3. Update DNS records as instructed by Netlify

## Testing Your Deployment

After deployment:
- Check that all pages load correctly
- Test navigation between pages
- Verify images and assets are loading
- Test responsive design on mobile devices

## Troubleshooting

### Common Issues

1. **Build Fails**
   - Check that `npm run build` works locally
   - Verify Node version compatibility
   - Check for missing dependencies

2. **404 Errors on Navigation**
   - Ensure `trailingSlash: true` in next.config.js
   - Verify redirect rules in netlify.toml

3. **Images Not Loading**
   - Confirm `images.unoptimized: true` in next.config.js
   - Check image paths in your components

### Build Logs
- View build logs in Netlify dashboard under "Deploys"
- Look for specific error messages to debug issues

## Performance Optimization

Your site is already optimized for Netlify:
- Static generation for fast load times
- Proper caching headers configured
- Optimized asset delivery via CDN

## Continuous Deployment

With Git integration:
- Every push to your main branch triggers a new deployment
- Pull requests create deploy previews
- Automatic SSL certificates
- Instant rollbacks

## Support

- Netlify documentation: [docs.netlify.com](https://docs.netlify.com)
- Next.js static export: [nextjs.org/docs/advanced-features/static-html-export](https://nextjs.org/docs/advanced-features/static-html-export)

## Next Steps

1. Deploy your site using one of the methods above
2. Set up custom domain if desired
3. Configure analytics if needed
4. Consider setting up form handling for the contact forms

Your EagleVisionEdge site is now ready for Netlify deployment! 🚀
