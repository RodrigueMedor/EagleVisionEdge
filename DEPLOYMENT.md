# Deployment Guide for Netlify

## Prerequisites
- GitHub, GitLab, or Bitbucket account with your code repository
- Netlify account (create at https://netlify.com)

## Step 1: Connect Your Repository to Netlify

1. Go to [Netlify](https://app.netlify.com)
2. Click "New site from Git"
3. Choose your Git provider (GitHub, GitLab, or Bitbucket)
4. Authorize Netlify to access your repositories
5. Select the `EagleVisionEdge` repository

## Step 2: Configure Build Settings

Netlify should automatically detect:
- **Build command:** `npm run build`
- **Publish directory:** `.next`
- **Node version:** 18 (configured in netlify.toml)

These are already configured in the `netlify.toml` file.

## Step 3: Install Dependencies

Before deployment, run locally:
```bash
npm install
npm run build
npm run start
```

## Step 4: Environment Variables (if needed)

1. Go to your site settings on Netlify
2. Navigate to "Site settings" → "Build & deploy" → "Environment"
3. Add any environment variables from `.env.example`
4. Most variables should use the `NEXT_PUBLIC_` prefix to be accessible in the browser

## Step 5: Deploy

Simply push to your main branch:
```bash
git add .
git commit -m "Set up Netlify deployment"
git push origin main
```

Netlify will automatically:
1. Pull your code
2. Install dependencies (`npm install`)
3. Build your project (`npm run build`)
4. Deploy to your site

## Custom Domain Setup

1. Go to your Netlify site settings
2. Navigate to "Domain management"
3. Click "Add custom domain"
4. Follow the DNS configuration steps

Your site will be available at: `https://app.netlify.com` (or your custom domain)

## Monitoring & Logs

- View deployment logs: Site → Deployments
- Check build issues: Netlify → Logs
- Monitor performance: Analytics tab

## Troubleshooting

### Build Fails
- Check the build log for errors
- Ensure all dependencies in `package.json` are installed
- Verify Node version is 18+

### Site Not Loading
- Clear browser cache
- Check if all required environment variables are set
- Review Netlify function logs if using API routes

### Performance Issues
- Images are optimized with Tailwind CSS
- Static assets are cached (configured in netlify.toml)
- Use Netlify's analytics to identify bottlenecks

## Useful Commands

```bash
# Local development
npm run dev

# Build for production
npm run build

# Test production build locally
npm run start

# Lint your code
npm lint
```

## Additional Resources

- [Netlify Next.js Documentation](https://docs.netlify.com/frameworks/next-js/overview/)
- [Netlify Build Configuration](https://docs.netlify.com/configure-builds/overview/)
- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)

