# VNX - Visnec Nexus

A comprehensive digital ecosystem of tools, platforms, directories, and marketplaces for global innovators and travelers.

## 🌟 Features

- **11 VNX Pillars**: Tools, Platforms, Directories, Resources, Community, Marketplace, Insights, Experiences, Trends, Ventures, and E-Services
- **Global eSIM Service**: Instant connectivity in 150+ countries
- **Modern UI/UX**: Built with Next.js 14+, React 18, and Tailwind CSS
- **SEO Optimized**: Complete metadata, Open Graph tags, and sitemap
- **Analytics**: Google Analytics and BuyMeACoffee integration
- **Responsive Design**: Mobile-first approach with beautiful animations
- **Multi-language Ready**: Structure for 8 languages (EN, ES, FR, DE, PT, AR, SW, ZH)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
vnx-regenerated/
├── app/                      # Next.js 14+ App Router
│   ├── layout.tsx           # Root layout with metadata
│   ├── page.tsx             # Home page
│   ├── globals.css          # Global styles
│   ├── tools/               # Tools pillar
│   ├── platforms/           # Platforms pillar
│   ├── directories/         # Directories pillar
│   ├── resources/           # Resources pillar
│   ├── community/           # Community pillar
│   ├── marketplace/         # Marketplace pillar
│   ├── insights/            # Insights pillar
│   ├── experiences/         # Experiences pillar
│   ├── trends/              # Trends pillar
│   ├── ventures/            # Ventures pillar
│   └── e-services/          # E-Services pillar
│       └── esim/            # eSIM service page
│
├── components/              # React components
│   ├── navigation.tsx       # Main navigation
│   ├── footer.tsx           # Footer with "Powered by Visnec"
│   ├── hero-section.tsx     # Hero section
│   ├── pillars-section.tsx  # VNX pillars display
│   ├── trending-section.tsx # Trending items
│   ├── cta-section.tsx      # Call-to-action
│   └── analytics.tsx        # Google Analytics & BMC
│
├── config/                  # Configuration files
│   ├── site.ts             # Site configuration
│   └── analytics.ts        # Analytics config
│
├── lib/                    # Utility functions
│   └── utils.ts           # Helper functions
│
├── public/                 # Static assets
│   ├── favicon/           # Favicon files
│   ├── images/            # Images
│   ├── locales/           # i18n translations
│   ├── sitemap.xml        # Sitemap
│   └── robots.txt         # Robots file
│
├── next.config.js         # Next.js configuration
├── tailwind.config.ts     # Tailwind CSS config
├── tsconfig.json          # TypeScript config
└── package.json           # Dependencies
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file based on `.env.example`:

```env
NEXT_PUBLIC_SITE_URL=https://visnec.ai
NEXT_PUBLIC_GA_ID=G-4NL5X61FCX
NEXT_PUBLIC_BMC_ID=visnec
```

### Affiliate Links

Update affiliate reference IDs in:
- `app/e-services/esim/page.tsx`

Replace `YOUR_REF_ID` with your actual affiliate IDs for:
- Airalo
- Nomad
- MobiMatter

## 🎨 Customization

### Colors

Tailwind CSS configuration is in `tailwind.config.ts`. Modify the theme to match your brand.

### Content

- **Site Config**: Edit `config/site.ts` for site-wide settings
- **Analytics**: Update `config/analytics.ts` for tracking IDs
- **Pages**: Modify files in `app/` directory for page content

## 📦 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Set environment variables
4. Deploy

```bash
# Or use Vercel CLI
npm i -g vercel
vercel
```

### Other Platforms

Build the project and deploy the `.next` folder:

```bash
npm run build
```

## 🌐 Domains

- **Main**: visnec.ai
- **E-Services**: e-services.visnec.ai (subdomain)
- **Tools**: tools.visnec.ai (optional)

## 🔗 Key Integrations

### Google Analytics

- ID: `G-4NL5X61FCX`
- Configured in `components/analytics.tsx`

### Buy Me a Coffee

- ID: `visnec`
- Widget appears bottom-right on all pages

### SEO

- Metadata in `app/layout.tsx`
- Open Graph tags included
- Sitemap at `/sitemap.xml`
- Robots at `/robots.txt`

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Tested on all major devices and browsers

## 🌍 Multi-language Support

Structure ready for 8 languages:
- English (EN)
- Spanish (ES)
- French (FR)
- German (DE)
- Portuguese (PT)
- Arabic (AR)
- Swahili (SW)
- Chinese (ZH)

Translation files can be added to `public/locales/`

## 🤝 Contributing

This is a proprietary project for Visnec Nexus. For questions or support, contact the Visnec team.

## 📄 License

© 2024 Visnec Nexus. All rights reserved.

## 🔗 Links

- **Website**: [visnec.ai](https://visnec.ai)
- **Visnec**: [visnec.com](https://visnec.com)
- **Support**: Contact via website

---

**Powered by [Visnec](https://visnec.com)**

