#!/bin/bash

echo "🧹 Cleaning up build artifacts..."

# Remove build directories safely
rm -rf dist
rm -rf frontend/dist
rm -rf backend/dist

# Clean up temporary files
find . -name "*.log" -delete
find . -name ".DS_Store" -delete

echo "🔄 Rebuilding project..."

# Rebuild the project
npm run build

echo "✅ Reset complete!"
echo "🚀 You can now run: npm run dev"