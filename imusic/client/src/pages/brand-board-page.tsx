import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Check, Download, ArrowLeft } from "lucide-react";

// SVG Logo 1 - Minimalist
const MinimalistLogo = () => (
  <svg width="180" height="60" viewBox="0 0 180 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 10H30L25 50H15L20 10Z" fill="#A855F7" />
    <path d="M45 10H35L30 50H40L45 10Z" fill="#A855F7" />
    <path d="M50 30C50 20 60 10 70 10C80 10 85 20 85 30C85 40 80 50 70 50C60 50 50 40 50 30Z" fill="#A855F7" />
    <path d="M90 10H95L100 30H105L110 10H115L108 50H103L100 35H95L90 50H85L90 10Z" fill="#A855F7" />
    <path d="M120 10H140V15H125V25H135V30H125V45H140V50H120V10Z" fill="#A855F7" />
    <path d="M145 50V10H150V45H165V50H145Z" fill="#A855F7" />
  </svg>
);

// SVG Logo 2 - Dreamlike
const DreamlikeLogo = () => (
  <svg width="200" height="60" viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g filter="url(#filter0_d_123_456)">
      <path d="M35 15C35 12.2386 37.2386 10 40 10H50C52.7614 10 55 12.2386 55 15V45C55 47.7614 52.7614 50 50 50H40C37.2386 50 35 47.7614 35 45V15Z" fill="#9333EA" />
      <path d="M65 15C65 12.2386 67.2386 10 70 10H80C82.7614 10 85 12.2386 85 15V45C85 47.7614 82.7614 50 80 50H70C67.2386 50 65 47.7614 65 45V15Z" fill="#9333EA" />
      <path d="M95 15C95 12.2386 97.2386 10 100 10H110C112.761 10 115 12.2386 115 15V45C115 47.7614 112.761 50 110 50H100C97.2386 50 95 47.7614 95 45V15Z" fill="#9333EA" />
      <path d="M125 15C125 12.2386 127.239 10 130 10H140C142.761 10 145 12.2386 145 15V45C145 47.7614 142.761 50 140 50H130C127.239 50 125 47.7614 125 45V15Z" fill="#9333EA" />
      <path d="M155 15C155 12.2386 157.239 10 160 10H170C172.761 10 175 12.2386 175 15V45C175 47.7614 172.761 50 170 50H160C157.239 50 155 47.7614 155 45V15Z" fill="#9333EA" />
    </g>
    <text x="50" y="35" fontFamily="serif" fontSize="24" fill="white" fontWeight="bold">DARKNOTES</text>
    <defs>
      <filter id="filter0_d_123_456" x="0" y="0" width="200" height="60" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
        <feOffset dy="4" />
        <feGaussianBlur stdDeviation="7" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix type="matrix" values="0 0 0 0 0.639 0 0 0 0 0.329 0 0 0 0 0.965 0 0 0 0.5 0" />
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_123_456" />
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_123_456" result="shape" />
      </filter>
    </defs>
  </svg>
);

// SVG Logo 3 - Futuristic
const FuturisticLogo = () => (
  <svg width="200" height="60" viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M30 10L35 15V25L30 30L25 25V15L30 10Z" fill="#A855F7" />
    <path d="M45 10L50 15V25L45 30L40 25V15L45 10Z" fill="#A855F7" />
    <path d="M60 25L55 30V40L60 45L65 40V30L60 25Z" fill="#A855F7" />
    <path d="M75 25L80 30V40L75 45L70 40V30L75 25Z" fill="#A855F7" />
    <path d="M90 10L95 15V25L90 30L85 25V15L90 10Z" fill="#A855F7" />
    <path d="M105 10L110 15V25L105 30L100 25V15L105 10Z" fill="#A855F7" />
    <path d="M120 25L115 30V40L120 45L125 40V30L120 25Z" fill="#A855F7" />
    <path d="M135 25L140 30V40L135 45L130 40V30L135 25Z" fill="#A855F7" />
    <path d="M150 10L155 15V25L150 30L145 25V15L150 10Z" fill="#A855F7" />
    <path d="M165 10L170 15V25L165 30L160 25V15L165 10Z" fill="#A855F7" />
    <text x="55" y="55" fontFamily="monospace" fontSize="18" fill="white" fontWeight="bold">DARKNOTES</text>
  </svg>
);

// Color Palette Component
const ColorSwatch = ({ color, name, hex }: { color: string; name: string; hex: string }) => {
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(hex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col">
      <div 
        className={`h-20 w-full rounded-t-md`} 
        style={{ backgroundColor: hex }}
      ></div>
      <div className="bg-[#121212] rounded-b-md p-3">
        <div className="flex justify-between items-center">
          <span className="text-white text-sm font-medium">{name}</span>
          <button 
            onClick={copyToClipboard}
            className="text-gray-400 hover:text-white"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
        <span className="text-gray-400 text-xs">{hex}</span>
      </div>
    </div>
  );
};

export default function BrandBoardPage() {
  return (
    <div className="min-h-screen bg-black text-white overflow-auto purple-light-effect texture-overlay">
      {/* Navigation Bar */}
      <nav className="px-4 sm:px-6 py-4 sm:py-6 border-b border-[#333] border-opacity-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/">
            <span className="text-3xl sm:text-4xl md:text-5xl font-['Playfair_Display'] font-semibold text-purple-400 hover:text-purple-300 transition cursor-pointer">
              DarkNotes
            </span>
          </Link>
          
          <div className="flex items-center">
            <Link href="/">
              <Button variant="ghost" className="text-gray-300 hover:text-white">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Home
              </Button>
            </Link>
            
            <Button className="ml-4 bg-purple-700 hover:bg-purple-600">
              <Download className="w-5 h-5 mr-2" />
              Download Assets
            </Button>
          </div>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-serif text-amber-100 mb-4">DarkNotes Brand Board</h1>
          <p className="text-gray-400 max-w-2xl">
            A comprehensive guide to our visual identity, showcasing our logo options, color palette, 
            typography, and design philosophy with a lo-fi meets futuristic AI aesthetic.
          </p>
        </div>
        
        <Tabs defaultValue="logos" className="w-full mb-16">
          <TabsList className="grid grid-cols-3 mb-8 bg-[#121212] text-gray-400">
            <TabsTrigger value="logos" className="data-[state=active]:text-purple-400 data-[state=active]:shadow-none">Logos</TabsTrigger>
            <TabsTrigger value="colors" className="data-[state=active]:text-purple-400 data-[state=active]:shadow-none">Colors</TabsTrigger>
            <TabsTrigger value="typography" className="data-[state=active]:text-purple-400 data-[state=active]:shadow-none">Typography</TabsTrigger>
          </TabsList>
          
          <TabsContent value="logos" className="space-y-8">
            <div className="bg-[#121212] rounded-xl p-8 purple-glow texture-overlay relative">
              <h2 className="text-2xl font-medium text-white mb-6">Logo Options</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-[#0A0A0A] rounded-lg p-6 flex flex-col items-center hover:purple-glow transition-all duration-300">
                  <div className="bg-[#121212] w-full h-32 rounded-md flex items-center justify-center mb-4">
                    <MinimalistLogo />
                  </div>
                  <h3 className="text-lg font-medium text-purple-200 mb-2">Minimalist</h3>
                  <p className="text-gray-400 text-sm text-center">Clean, elegant design with a focus on typography and simple shapes.</p>
                  <Button variant="outline" size="sm" className="mt-4">
                    <Download className="w-4 h-4 mr-2" />
                    Download SVG
                  </Button>
                </div>
                
                <div className="bg-[#0A0A0A] rounded-lg p-6 flex flex-col items-center hover:purple-glow transition-all duration-300">
                  <div className="bg-[#121212] w-full h-32 rounded-md flex items-center justify-center mb-4">
                    <DreamlikeLogo />
                  </div>
                  <h3 className="text-lg font-medium text-purple-200 mb-2">Dreamlike</h3>
                  <p className="text-gray-400 text-sm text-center">Atmospheric logo with purple glow effects and a mysterious aesthetic.</p>
                  <Button variant="outline" size="sm" className="mt-4">
                    <Download className="w-4 h-4 mr-2" />
                    Download SVG
                  </Button>
                </div>
                
                <div className="bg-[#0A0A0A] rounded-lg p-6 flex flex-col items-center hover:purple-glow transition-all duration-300">
                  <div className="bg-[#121212] w-full h-32 rounded-md flex items-center justify-center mb-4">
                    <FuturisticLogo />
                  </div>
                  <h3 className="text-lg font-medium text-purple-200 mb-2">Futuristic</h3>
                  <p className="text-gray-400 text-sm text-center">Tech-inspired geometric design evoking audio waveforms and AI patterns.</p>
                  <Button variant="outline" size="sm" className="mt-4">
                    <Download className="w-4 h-4 mr-2" />
                    Download SVG
                  </Button>
                </div>
              </div>
              
              <div className="mt-10 border-t border-[#333] border-opacity-50 pt-8">
                <h3 className="text-xl font-medium text-white mb-4">Logo Usage Guidelines</h3>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>Maintain clear space around the logo equal to the height of the "D" in DarkNotes</li>
                  <li>Do not stretch, distort, or alter the proportions of the logo</li>
                  <li>The logo can be used on dark backgrounds or with a dark overlay on images</li>
                  <li>Minimum size for digital use: 120px width</li>
                </ul>
              </div>
              
              <div className="absolute top-2 right-2 w-4 h-4 bg-purple-500 rounded-full opacity-70 pulse-slow"></div>
            </div>
          </TabsContent>
          
          <TabsContent value="colors" className="space-y-8">
            <div className="bg-[#121212] rounded-xl p-8 purple-glow texture-overlay relative">
              <h2 className="text-2xl font-medium text-white mb-6">Color Palette</h2>
              <div className="mb-8">
                <h3 className="text-lg font-medium text-purple-200 mb-4">Primary Palette</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <ColorSwatch color="purple" name="Primary Purple" hex="#A855F7" />
                  <ColorSwatch color="dark-purple" name="Dark Purple" hex="#7E22CE" />
                  <ColorSwatch color="light-purple" name="Light Purple" hex="#C084FC" />
                  <ColorSwatch color="amber" name="Accent Amber" hex="#FCD34D" />
                </div>
              </div>
              
              <div className="mb-8">
                <h3 className="text-lg font-medium text-purple-200 mb-4">Background Palette</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <ColorSwatch color="black" name="Black" hex="#000000" />
                  <ColorSwatch color="dark-gray" name="Dark Gray" hex="#121212" />
                  <ColorSwatch color="med-gray" name="Medium Gray" hex="#1E1E1E" />
                  <ColorSwatch color="light-gray" name="Light Gray" hex="#333333" />
                </div>
              </div>
              
              <div className="mb-8">
                <h3 className="text-lg font-medium text-purple-200 mb-4">UI Elements</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <ColorSwatch color="success" name="Success" hex="#10B981" />
                  <ColorSwatch color="warning" name="Warning" hex="#F59E0B" />
                  <ColorSwatch color="error" name="Error" hex="#EF4444" />
                  <ColorSwatch color="info" name="Info" hex="#3B82F6" />
                </div>
              </div>
              
              <div className="mt-10 border-t border-[#333] border-opacity-50 pt-8">
                <h3 className="text-xl font-medium text-white mb-4">Color Usage Guidelines</h3>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>Primary Purple should be used for primary buttons and key UI elements</li>
                  <li>Dark Purple works well for hover states and secondary elements</li>
                  <li>Accent Amber should be used sparingly to highlight important information</li>
                  <li>Text should primarily use white (#FFFFFF) or light gray (#E5E5E5) for optimal readability</li>
                </ul>
              </div>
              
              <div className="absolute top-2 right-2 w-4 h-4 bg-purple-500 rounded-full opacity-70 pulse-slow"></div>
            </div>
          </TabsContent>
          
          <TabsContent value="typography" className="space-y-8">
            <div className="bg-[#121212] rounded-xl p-8 purple-glow texture-overlay relative">
              <h2 className="text-2xl font-medium text-white mb-6">Typography</h2>
              
              <div className="mb-10">
                <h3 className="text-lg font-medium text-purple-200 mb-4">Primary Font: Playfair Display</h3>
                <div className="bg-[#0A0A0A] rounded-lg p-6">
                  <p className="font-['Playfair_Display'] text-5xl text-white mb-4">DarkNotes</p>
                  <p className="font-['Playfair_Display'] text-3xl text-gray-300 mb-4">Where your rawest thoughts become your realest sound</p>
                  <p className="font-['Playfair_Display'] text-lg text-gray-400">
                    ABCDEFGHIJKLMNOPQRSTUVWXYZ<br />
                    abcdefghijklmnopqrstuvwxyz<br />
                    1234567890
                  </p>
                </div>
                <p className="mt-4 text-gray-400 text-sm">
                  Playfair Display is our primary display font, used for logos, headings, and key promotional text.
                  Its elegant serifs add sophistication to our brand while maintaining readability.
                </p>
              </div>
              
              <div className="mb-10">
                <h3 className="text-lg font-medium text-purple-200 mb-4">Body Font: Inter</h3>
                <div className="bg-[#0A0A0A] rounded-lg p-6">
                  <p className="font-sans text-3xl text-white mb-4">User Interface Text</p>
                  <p className="font-sans text-xl text-gray-300 mb-4">Create music with AI mentorship</p>
                  <p className="font-sans text-base text-gray-400">
                    This clean, modern sans-serif font provides excellent readability across all device sizes
                    while maintaining a contemporary aesthetic that complements our futuristic brand identity.
                  </p>
                </div>
                <p className="mt-4 text-gray-400 text-sm">
                  Inter is our primary body font, used for all interface elements, body text, and navigation.
                  Its clean lines and excellent readability make it perfect for digital interfaces.
                </p>
              </div>
              
              <div className="mb-10">
                <h3 className="text-lg font-medium text-purple-200 mb-4">Accent Font: Cedarville Cursive</h3>
                <div className="bg-[#0A0A0A] rounded-lg p-6">
                  <p className="font-handwriting text-3xl text-white mb-4">Express your rawest thoughts...</p>
                  <p className="font-handwriting text-xl text-gray-300">Turn them into your realest sound</p>
                </div>
                <p className="mt-4 text-gray-400 text-sm">
                  Cedarville Cursive is used for lyric writing interfaces and personal elements that require
                  a handwritten feel, reinforcing the personal creative aspects of our platform.
                </p>
              </div>
              
              <div className="mt-10 border-t border-[#333] border-opacity-50 pt-8">
                <h3 className="text-xl font-medium text-white mb-4">Typography Guidelines</h3>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>Headings should use Playfair Display with appropriate spacing</li>
                  <li>Body text should use Inter at 16px minimum for readability</li>
                  <li>Handwriting font should be limited to creative input areas and personal touches</li>
                  <li>Maintain proper hierarchy with clear size and weight distinctions</li>
                </ul>
              </div>
              
              <div className="absolute top-2 right-2 w-4 h-4 bg-purple-500 rounded-full opacity-70 pulse-slow"></div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="bg-[#121212] rounded-xl p-8 mb-12 purple-glow texture-overlay relative">
          <h2 className="text-2xl font-medium text-white mb-6">Design Philosophy</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#0A0A0A] rounded-lg p-6">
              <h3 className="text-lg font-medium text-purple-200 mb-3">Lo-fi Aesthetics</h3>
              <p className="text-gray-400 text-sm">
                We embrace the raw, imperfect qualities of lo-fi design to evoke emotion and authenticity.
                Grungy textures, subtle lighting, and slightly imperfect elements create a more human feel
                in our digital interface.
              </p>
            </div>
            
            <div className="bg-[#0A0A0A] rounded-lg p-6">
              <h3 className="text-lg font-medium text-purple-200 mb-3">Futuristic AI</h3>
              <p className="text-gray-400 text-sm">
                Our design incorporates subtle AI indicators through pulsing elements, soft purple glows,
                and minimal UI flourishes that suggest intelligence without overwhelming the interface.
                This creates a sense of ambient technology assisting the creative process.
              </p>
            </div>
            
            <div className="bg-[#0A0A0A] rounded-lg p-6">
              <h3 className="text-lg font-medium text-purple-200 mb-3">Emotional Depth</h3>
              <p className="text-gray-400 text-sm">
                Through mysterious silhouettes, dreamlike lighting effects, and a focus on personal expression,
                our design creates emotional resonance with users. The dark theme with purple highlights
                creates an immersive environment for creative exploration.
              </p>
            </div>
          </div>
          
          <div className="absolute top-2 right-2 w-4 h-4 bg-purple-500 rounded-full opacity-70 pulse-slow"></div>
        </div>
      </main>
      
      <footer className="py-6 sm:py-8 px-4 sm:px-6 bg-black border-t border-[#333] border-opacity-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0 text-center md:text-left">
            <Link href="/">
              <span className="text-2xl sm:text-3xl font-['Playfair_Display'] font-semibold text-purple-400 hover:text-purple-300 transition cursor-pointer">
                DarkNotes
              </span>
            </Link>
            <p className="text-gray-500 mt-2 text-sm sm:text-base">Where your rawest thoughts become your realest sound</p>
          </div>
          
          <div className="text-gray-500 text-sm">
            Brand Guidelines • April 2025
          </div>
        </div>
      </footer>
    </div>
  );
}