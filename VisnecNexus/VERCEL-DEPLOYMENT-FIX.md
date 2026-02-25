# Vercel Deployment Fix

## Issue

If you see this error on Vercel:

```
Error: No Output Directory named 'out' found after the Build completed.
```

## Solution

This project uses **Next.js App Router with server-side rendering**, not static export. Vercel should automatically detect this.

### Steps to Fix:

1. **In Vercel Dashboard:**
   - Go to your project settings
   - Navigate to "Build & Development Settings"
   - Ensure these settings:
     - **Framework Preset**: Next.js
     - **Build Command**: `npm run build` (or leave empty for auto-detect)
     - **Output Directory**: Leave empty (Vercel will use `.next` automatically)
     - **Install Command**: `npm install`

2. **Verify `next.config.js`:**
   - Make sure there's NO `output: 'export'` line
   - The file should look like this:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com'],
  },
  // NO output: 'export' here!
  async redirects() {
    return [
      {
        source: '/notebook',
        destination: 'https://vnx-note.visnec.ai',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
```

3. **Check `vercel.json`:**
   - Should specify `framework: "nextjs"`
   - Should NOT have `outputDirectory` field

4. **Redeploy:**
   - Push your changes to GitHub
   - Vercel will auto-deploy
   - OR manually trigger a new deployment

## Why This Happens

- Next.js App Router uses **server-side rendering** by default
- Output directory is `.next`, not `out`
- `out` directory is only used for static exports (`output: 'export'`)
- Vercel automatically handles `.next` directory

## Verification

After deployment, check:
- [ ] All pages load correctly
- [ ] Navigation works
- [ ] Google Analytics tracking
- [ ] BuyMeACoffee widget appears
- [ ] Affiliate links work

## Alternative: Force Static Export (Not Recommended)

If you absolutely need static export, add to `next.config.js`:

```javascript
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true, // Required for static export
  },
  // ... rest of config
};
```

**Note**: This disables server-side features and image optimization.

## Still Having Issues?

1. Check Vercel build logs for specific errors
2. Verify `package.json` has correct Next.js version
3. Ensure all dependencies are installed
4. Try deleting `.next` folder and rebuilding locally
5. Check Vercel's Next.js documentation: https://vercel.com/docs/frameworks/nextjs

## Contact

For VNX-specific deployment issues, contact the Visnec team.

