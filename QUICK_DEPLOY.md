# 🚀 Quick Deploy Checklist

## Pre-Deployment Checklist

- [ ] Code pushed to GitHub/GitLab/Bitbucket
- [ ] `npm install` completes without errors
- [ ] `npm run build` completes successfully
- [ ] `npm run start` works locally at http://localhost:3000
- [ ] No console errors in browser
- [ ] Contact form email updated (if needed)
- [ ] Environment variables documented in `.env.example`

## Deployment Commands

```bash
# 1. Test locally (from project root)
npm install
npm run build
npm run start

# 2. Git commands (one-time setup)
git init
git add .
git commit -m "Initial commit: Set up Netlify deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/EagleVisionEdge.git
git push -u origin main

# 3. On Netlify.com
# - Click "New site from Git"
# - Connect to GitHub/GitLab/Bitbucket
# - Select repository
# - Netlify auto-detects build settings
# - Click "Deploy site"
```

## Key Files Created

| File | Purpose |
|------|---------|
| `netlify.toml` | Netlify build configuration |
| `next.config.js` | Next.js configuration |
| `.netlifyignore` | Files to ignore in Netlify builds |
| `.gitignore` | Git ignore rules |
| `.env.example` | Environment variables template |
| `DEPLOYMENT.md` | Detailed deployment guide |
| `setup-local.sh` | Local setup automation script |

## Build Settings (Auto-Detected)

- **Build Command:** `npm run build`
- **Publish Directory:** `.next`
- **Node Version:** 18
- **Functions:** Netlify Functions ready

## After Deployment

✅ Site deployed at: `https://[site-name].netlify.app`
✅ Connect custom domain in Netlify dashboard
✅ Monitor deployments and performance
✅ Set up automatic deploys on git push

## Support Resources

- 📖 See `DEPLOYMENT.md` for detailed instructions
- 📖 See `NETLIFY_SETUP_COMPLETE.md` for comprehensive setup overview
- 🔗 [Netlify Next.js Documentation](https://docs.netlify.com/frameworks/next-js/overview/)

