import { useState } from "react";

export default function Footer() {
  const [language, setLanguage] = useState("en");
  const [region, setRegion] = useState("auto");

  // const quickLinks = [
  //   { label: "About Us", href: "#" },
  //   { label: "Blog", href: "#" },
  //   { label: "Careers", href: "#" },
  //   { label: "Contact", href: "#" },
  // ];

  // const platformLinks = [
  //   { label: "Tools", href: "#tools" },
  //   { label: "Platforms", href: "#platforms" },
  //   { label: "Community", href: "#community" },
  //   { label: "Marketplace", href: "#marketplace" },
  // ];

  const supportLinks = [
    { label: "Help Center", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Sitemap", href: "#" },
  ];

  const socialLinks = [
    {
      name: "Twitter",
      href: "#",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
        </svg>
      ),
    },
    {
      name: "LinkedIn",
      href: "#",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
    {
      name: "YouTube",
      href: "#",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
    },
  ];

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);
    console.log("Language changed to:", e.target.value);
  };

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRegion(e.target.value);
    console.log("Region changed to:", e.target.value);
  };

  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">VX</span>
              </div>
              <span className="text-xl font-bold text-white">VNX</span>
            </div>
            <p className="text-slate-400 mb-6">
              Your digital gateway to AI tools, platforms, and resources that power the future of
              innovation.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="text-slate-400 hover:text-white transition-colors"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#tools" className="text-slate-400 hover:text-white transition-colors">
                  Tools
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  About
                </a>
              </li>
            </ul>
          </div>

          {/* All 8 Pillars */}
          <div>
            <h3 className="text-white font-semibold mb-4">Pillars</h3>
            <ul className="space-y-2">
              <li>
                <a href="#tools" className="text-slate-400 hover:text-white transition-colors">
                  Tools
                </a>
              </li>
              <li>
                <a href="#platforms" className="text-slate-400 hover:text-white transition-colors">
                  Platforms
                </a>
              </li>
              <li>
                <a href="#directories" className="text-slate-400 hover:text-white transition-colors">
                  Directories
                </a>
              </li>
              <li>
                <a href="#resources" className="text-slate-400 hover:text-white transition-colors">
                  Resources
                </a>
              </li>
              <li>
                <a href="#community" className="text-slate-400 hover:text-white transition-colors">
                  Community
                </a>
              </li>
              <li>
                <a href="#marketplace" className="text-slate-400 hover:text-white transition-colors">
                  Marketplace
                </a>
              </li>
              <li>
                <a href="#insights" className="text-slate-400 hover:text-white transition-colors">
                  Insights
                </a>
              </li>
              <li>
                <a href="#experience" className="text-slate-400 hover:text-white transition-colors">
                  Experience
                </a>
              </li>
            </ul>
          </div>

          {/* Support & Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support & Legal</h3>
            <ul className="space-y-2">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-slate-400 hover:text-white transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            {/* Language & Geo Selector */}
            <div className="mt-6">
              <select
                value={language}
                onChange={handleLanguageChange}
                className="bg-slate-800 border border-slate-700 text-slate-300 rounded-lg px-3 py-2 text-sm mb-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="en">🌐 English (US)</option>
                <option value="es">🇪🇸 Español</option>
                <option value="fr">🇫🇷 Français</option>
                <option value="de">🇩🇪 Deutsch</option>
              </select>
              <select
                value={region}
                onChange={handleRegionChange}
                className="bg-slate-800 border border-slate-700 text-slate-300 rounded-lg px-3 py-2 text-sm w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="auto">🌍 Auto-detect</option>
                <option value="us">🇺🇸 United States</option>
                <option value="eu">🇪🇺 Europe</option>
                <option value="asia">🌏 Asia Pacific</option>
              </select>
              <div className="text-sm text-slate-400 mt-2">📍 Detected: United States</div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-slate-400 text-sm mb-4 md:mb-0">
            © 2024 VNX - Visnec Nexus. All rights reserved. • Made with ❤️ by Visnec Nexus
          </div>
          <div className="flex space-x-6 text-sm">
            <a href="#" className="text-slate-400 hover:text-white transition-colors">
              Status
            </a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors">
              API
            </a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors">
              Developers
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
