# VNX Deployment Guide

This guide will help you deploy the VNX project to production.

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)

Vercel is the recommended platform for Next.js applications.

#### Steps:

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial VNX deployment"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js settings

3. **Configure Environment Variables**
   In Vercel dashboard, add:
   ```
   NEXT_PUBLIC_SITE_URL=https://visnec.ai
   NEXT_PUBLIC_GA_ID=G-4NL5X61FCX
   NEXT_PUBLIC_BMC_ID=visnec
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your site will be live!

#### Custom Domain Setup:

1. In Vercel project settings, go to "Domains"
2. Add `visnec.ai`
3. Configure DNS records as instructed
4. Add subdomain `e-services.visnec.ai` if needed

### Option 2: Netlify

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod
   ```

3. **Configure**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Add environment variables in Netlify dashboard

### Option 3: Self-Hosted (VPS/Cloud)

#### Requirements:
- Node.js 18+
- PM2 or similar process manager
- Nginx (recommended)

#### Steps:

1. **Clone repository on server**
   ```bash
   git clone YOUR_REPO_URL
   cd vnx-regenerated
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build for production**
   ```bash
   npm run build
   ```

4. **Start with PM2**
   ```bash
   npm install -g pm2
   pm2 start npm --name "vnx" -- start
   pm2 save
   pm2 startup
   ```

5. **Configure Nginx**
   ```nginx
   server {
       listen 80;
       server_name visnec.ai;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

6. **Enable HTTPS with Let's Encrypt**
   ```bash
   sudo certbot --nginx -d visnec.ai -d www.visnec.ai
   ```

## 🔧 Post-Deployment Checklist

### Essential:
- [ ] Verify all pages load correctly
- [ ] Test navigation links
- [ ] Check mobile responsiveness
- [ ] Verify Google Analytics is tracking
- [ ] Test BuyMeACoffee widget appears
- [ ] Confirm eSIM affiliate links work
- [ ] Test contact forms (if any)
- [ ] Check SEO meta tags in page source
- [ ] Verify sitemap.xml is accessible
- [ ] Test robots.txt

### Optional:
- [ ] Set up monitoring (e.g., Sentry, LogRocket)
- [ ] Configure CDN for images
- [ ] Enable caching headers
- [ ] Set up automated backups
- [ ] Configure analytics dashboards
- [ ] Test performance with Lighthouse
- [ ] Set up uptime monitoring

## 🔐 Environment Variables

### Production Environment:

```env
# Required
NEXT_PUBLIC_SITE_URL=https://visnec.ai
NEXT_PUBLIC_GA_ID=G-4NL5X61FCX
NEXT_PUBLIC_BMC_ID=visnec

# Optional - Affiliate IDs
NEXT_PUBLIC_AIRALO_REF=your_airalo_ref_id
NEXT_PUBLIC_NOMAD_REF=your_nomad_ref_id
NEXT_PUBLIC_MOBIMATTER_REF=your_mobimatter_ref_id
```

## 📊 Performance Optimization

### Image Optimization:
- Use Next.js Image component for all images
- Compress images before uploading
- Use WebP format when possible

### Code Splitting:
- Already handled by Next.js automatically
- Use dynamic imports for heavy components

### Caching:
- Configure CDN caching headers
- Enable browser caching
- Use Redis for API caching (if applicable)

## 🔄 Continuous Deployment

### GitHub Actions Example:

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## 🐛 Troubleshooting

### Build Fails:
- Check Node.js version (18+ required)
- Clear cache: `rm -rf .next node_modules && npm install`
- Check for TypeScript errors: `npm run build`

### Pages Not Loading:
- Verify all routes are defined in `app/` directory
- Check for missing page.tsx files
- Review Next.js logs

### Analytics Not Working:
- Verify GA ID in environment variables
- Check browser console for errors
- Ensure analytics.tsx is imported in layout

### Styling Issues:
- Clear Tailwind cache
- Rebuild: `npm run build`
- Check for conflicting CSS

## 📱 Domain Configuration

### DNS Records for visnec.ai:

```
Type    Name              Value
A       @                 76.76.21.21 (Vercel IP)
CNAME   www               cname.vercel-dns.com
CNAME   e-services        cname.vercel-dns.com
```

### Subdomain Setup:

For `e-services.visnec.ai`:
1. Add subdomain in Vercel
2. Create CNAME record in DNS
3. Wait for SSL certificate provisioning

## 🔗 Useful Links

- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com)

## 💡 Tips

1. **Use Preview Deployments**: Test changes on preview URLs before production
2. **Monitor Performance**: Use Vercel Analytics or Google PageSpeed Insights
3. **Set Up Alerts**: Configure uptime monitoring and error tracking
4. **Regular Backups**: Keep backups of your codebase and database
5. **Security Headers**: Already configured in next.config.js

## 📞 Support

For deployment issues:
- Check Next.js documentation
- Review Vercel/Netlify logs
- Contact Visnec team for VNX-specific questions

---

**Good luck with your deployment! 🚀**

