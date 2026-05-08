#!/bin/bash

# EagleVisionEdge - Ready Check Test Suite
# Run this script to verify your project is ready for Netlify deployment

echo "🧪 EagleVisionEdge Project Ready Check"
echo "======================================"
echo ""

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"

TESTS_PASSED=0
TESTS_FAILED=0

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Check Node modules
echo "📦 Test 1: Checking dependencies..."
if [ -d "node_modules" ]; then
  echo -e "${GREEN}✓ PASS${NC}: node_modules directory exists"
  ((TESTS_PASSED++))
else
  echo -e "${RED}✗ FAIL${NC}: node_modules not found. Run 'npm install'"
  ((TESTS_FAILED++))
fi
echo ""

# Test 2: Check configuration files
echo "⚙️  Test 2: Checking configuration files..."
CONFIG_FILES=("next.config.js" "netlify.toml" ".gitignore" "tsconfig.json" "package.json")
for file in "${CONFIG_FILES[@]}"; do
  if [ -f "$file" ]; then
    echo -e "${GREEN}✓${NC} $file"
  else
    echo -e "${RED}✗${NC} $file missing"
    ((TESTS_FAILED++))
  fi
done
((TESTS_PASSED++))
echo ""

# Test 3: Check build
echo "🔨 Test 3: Running production build..."
if npm run build > /dev/null 2>&1; then
  echo -e "${GREEN}✓ PASS${NC}: Build completed successfully"
  ((TESTS_PASSED++))
else
  echo -e "${RED}✗ FAIL${NC}: Build failed. Check error messages above"
  ((TESTS_FAILED++))
fi
echo ""

# Test 4: Check build output
echo "📂 Test 4: Verifying build output..."
if [ -d ".next" ]; then
  echo -e "${GREEN}✓ PASS${NC}: .next directory created"
  ((TESTS_PASSED++))
else
  echo -e "${RED}✗ FAIL${NC}: .next directory not found"
  ((TESTS_FAILED++))
fi
echo ""

# Test 5: Check Netlify configuration
echo "🌐 Test 5: Checking Netlify configuration..."
if grep -q "npm run build" netlify.toml; then
  echo -e "${GREEN}✓ PASS${NC}: netlify.toml contains build command"
  ((TESTS_PASSED++))
else
  echo -e "${RED}✗ FAIL${NC}: netlify.toml build command not found"
  ((TESTS_FAILED++))
fi
echo ""

# Summary
echo "======================================"
echo "📊 Test Summary"
echo "======================================"
echo -e "Tests Passed: ${GREEN}$TESTS_PASSED${NC}"
echo -e "Tests Failed: ${RED}$TESTS_FAILED${NC}"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
  echo -e "${GREEN}✅ ALL TESTS PASSED!${NC}"
  echo ""
  echo "Your project is ready for Netlify deployment! 🚀"
  echo ""
  echo "Next steps:"
  echo "1. Push to GitHub/GitLab/Bitbucket:"
  echo "   git add ."
  echo "   git commit -m 'Ready for Netlify deployment'"
  echo "   git push origin main"
  echo ""
  echo "2. Go to https://app.netlify.com"
  echo "3. Click 'New site from Git'"
  echo "4. Select your repository"
  echo "5. Netlify will auto-detect build settings"
  echo "6. Done! Your site will deploy automatically 🎉"
  echo ""
  exit 0
else
  echo -e "${RED}❌ TESTS FAILED${NC}"
  echo ""
  echo "Please fix the issues above and try again."
  echo "For help, see DEPLOYMENT.md"
  echo ""
  exit 1
fi

