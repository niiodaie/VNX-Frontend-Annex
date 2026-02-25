export function Footer() {
  return (
    <footer className="text-sm mt-8 border-t py-6 bg-white">
      <div className="grid md:grid-cols-3 gap-6 px-4 text-center md:text-left">
        
        <div>
          <h4 className="font-bold mb-2">Nexus Tracker</h4>
          <p className="mb-2 text-gray-600">
            Simplified project management for solopreneurs and small businesses.
            Stay organized, get AI assistance, and track your progress efficiently.
          </p>
          <div className="flex justify-center md:justify-start space-x-4 mt-2">
            <a href="https://nexustracker.visnec.ai" aria-label="Home" target="_blank" rel="noreferrer">
              <svg className="w-5 h-5 fill-current text-gray-600 hover:text-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M10 12H6v4h8v-4h-4z" />
                <path d="M18 8.6V18a1 1 0 01-1 1h-4v-5H7v5H3a1 1 0 01-1-1V8.6L10 2l8 6.6z" />
              </svg>
            </a>
            <a href="https://x.com/vnxplatform" target="_blank" aria-label="X (Twitter)" rel="noreferrer">
              <svg className="w-5 h-5 fill-current text-gray-600 hover:text-sky-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M19.633 7.997c.013.179.013.359.013.538 0 5.486-4.176 11.812-11.812 11.812-2.35 0-4.542-.688-6.385-1.877a8.36 8.36 0 006.188-1.725 4.157 4.157 0 01-3.88-2.878 5.234 5.234 0 001.872-.071 4.147 4.147 0 01-3.33-4.073v-.052a4.18 4.18 0 001.878.522 4.15 4.15 0 01-1.284-5.53A11.79 11.79 0 0010.12 9.62a4.688 4.688 0 01-.104-.95 4.153 4.153 0 017.182-2.84 8.179 8.179 0 002.637-1.005 4.118 4.118 0 01-1.823 2.29 8.285 8.285 0 002.39-.65 8.968 8.968 0 01-2.073 2.132z" />
              </svg>
            </a>
            <a href="https://www.linkedin.com/company/107405663/admin/dashboard/" target="_blank" aria-label="LinkedIn" rel="noreferrer">
              <svg className="w-5 h-5 fill-current text-gray-600 hover:text-blue-700" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.038-1.85-3.038-1.853 0-2.136 1.445-2.136 2.937v5.67H9.352V9h3.415v1.561h.049c.476-.897 1.637-1.85 3.368-1.85 3.6 0 4.265 2.368 4.265 5.451v6.29zM5.337 7.433a2.06 2.06 0 110-4.119 2.06 2.06 0 010 4.119zM6.881 20.452H3.793V9h3.088v11.452z" />
              </svg>
            </a>
            <a href="https://www.facebook.com/profile.php?id=61576882583780" target="_blank" aria-label="Facebook" rel="noreferrer">
              <svg className="w-5 h-5 fill-current text-gray-600 hover:text-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a href="https://www.instagram.com/vnxplatform/" target="_blank" aria-label="Instagram" rel="noreferrer">
              <svg className="w-5 h-5 fill-current text-gray-600 hover:text-pink-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.618 5.367 11.986 11.988 11.986s11.987-5.368 11.987-11.986C24.014 5.367 18.635.001 12.017.001zM8.449 16.988c-2.51 0-4.541-2.031-4.541-4.541s2.031-4.541 4.541-4.541 4.541 2.031 4.541 4.541-2.031 4.541-4.541 4.541zm7.119 0c-2.51 0-4.541-2.031-4.541-4.541s2.031-4.541 4.541-4.541 4.541 2.031 4.541 4.541-2.031 4.541-4.541 4.541z"/>
              </svg>
            </a>
            <a href="https://www.tiktok.com/search?q=vnxplatform&t=1751189923817" target="_blank" aria-label="TikTok" rel="noreferrer">
              <svg className="w-5 h-5 fill-current text-gray-600 hover:text-black" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
              </svg>
            </a>
            <a href="https://www.reddit.com/user/Hot-Cut47/" target="_blank" aria-label="Reddit" rel="noreferrer">
              <svg className="w-5 h-5 fill-current text-gray-600 hover:text-orange-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
              </svg>
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-bold mb-2">Product</h4>
          <ul className="space-y-1 text-gray-700">
            <li><a href="/pricing">Pricing</a></li>
            <li><a href="/features">Features</a></li>
            <li><a href="/roadmap">Roadmap</a></li>
            <li><a href="/docs">API Docs</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-2">Support</h4>
          <ul className="space-y-1 text-gray-700">
            <li><a href="/help">Help Center</a></li>
            <li><a href="/contact">Contact Us</a></li>
            <li><a href="/privacy">Privacy Policy</a></li>
            <li><a href="/terms">Terms of Service</a></li>
          </ul>
        </div>
      </div>

      <div className="text-center mt-6 text-gray-500 text-xs">
        Made with ❤️ by <a href="https://visnec.ai" className="text-blue-600 font-medium" target="_blank" rel="noopener noreferrer">VNX</a> - Powered by <a href="https://visnec.com" className="text-blue-600 font-medium" target="_blank" rel="noopener noreferrer">Visnec</a><br />
        © 2025 Visnec Global Company. All rights reserved.
      </div>
    </footer>
  )
}