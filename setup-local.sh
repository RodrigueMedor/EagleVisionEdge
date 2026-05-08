#!/bin/bash

# Quick start script for EagleVisionEdge local development

echo "🚀 EagleVisionEdge Local Development Setup"
echo "=========================================="
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
else
    echo "✅ Dependencies already installed"
fi

echo ""
echo "🔨 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please check the error messages above."
    exit 1
fi

echo ""
echo "✅ Build successful!"
echo ""
echo "Available commands:"
echo "  npm run dev    - Start development server (http://localhost:3000)"
echo "  npm run build  - Build for production"
echo "  npm run start  - Start production server"
echo "  npm run lint   - Lint the code"
echo ""
echo "To deploy to Netlify:"
echo "  1. Push your code to GitHub/GitLab/Bitbucket"
echo "  2. Visit https://app.netlify.com"
echo "  3. Click 'New site from Git'"
echo "  4. Select your repository"
echo "  5. Netlify will automatically detect the build settings"
echo ""

