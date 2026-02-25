import Head from "next/head";
import Script from "next/script";

export default function EsimPage() {
  return (
    <main className="min-h-screen bg-white text-slate-800">
      <Head>
        <title>Instant eSIMs for Global Travelers | esim.visnec.ai</title>
        <meta name="description" content="Get connected instantly in over 190+ countries with our eSIM partners. No roaming fees, no physical SIMs needed." />
        <meta name="keywords" content="eSIM, global travel, mobile data, instant eSIM, digital SIM, esim international, esim for travelers" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://esim.visnec.ai" />
      </Head>

      {/* Google Analytics */}
      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-4NL5X61FCX"
      ></Script>
      <Script id="google-analytics">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag() { dataLayer.push(arguments); }
          gtag('js', new Date());
          gtag('config', 'G-4NL5X61FCX');
        `}
      </Script>

      {/* BuyMeACoffee */}
      <Script
        data-name="BMC-Widget"
        data-cfasync="false"
        src="https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js"
        data-id="visnec"
        data-description="Support us on Buy me a coffee!"
        data-message="Love what we're building?"
        data-color="#5F7FFF"
        data-position="Right"
        data-x_margin="18"
        data-y_margin="18"
      ></Script>

      {/* HERO */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Instant eSIMs for Global Travelers</h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8">
          Get connected instantly in over 190+ countries. No physical SIM cards, no roaming fees.
        </p>
        <a
          href="#get-esim"
          className="bg-white text-indigo-700 font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-slate-100 transition"
        >
          Get Your eSIM
        </a>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 px-6 text-center bg-slate-50">
        <h2 className="text-3xl font-bold mb-4">How It Works</h2>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          <div>
            <h3 className="text-xl font-semibold mb-2">1. Choose a Destination</h3>
            <p>Select your travel country or region and pick the best plan for your needs.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">2. Scan & Activate</h3>
            <p>Receive your QR code instantly. Scan it and your eSIM is activated in minutes.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">3. Stay Connected</h3>
            <p>Enjoy fast, secure mobile data throughout your journey.</p>
          </div>
        </div>
      </section>

      {/* EMBED / AFFILIATE SECTION */}
      <section id="get-esim" className="py-16 px-6 text-center">
        <h2 className="text-3xl font-bold mb-6">Buy Your eSIM Now</h2>
        <p className="mb-8 max-w-xl mx-auto">
          Choose from our trusted partners. Instant delivery. Affordable pricing.
        </p>
        <div className="flex flex-wrap justify-center gap-6">
          <a
            href="https://www.airalo.com/?ref=YOUR_REF_ID"
            target="_blank"
            className="bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            Airalo
          </a>
          <a
            href="https://www.getnomad.app?ref=YOUR_REF_ID"
            target="_blank"
            className="bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 transition"
          >
            Nomad
          </a>
          <a
            href="https://www.mobimatter.com?ref=YOUR_REF_ID"
            target="_blank"
            className="bg-pink-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-pink-700 transition"
          >
            MobiMatter
          </a>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-slate-100 py-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto space-y-6">
          <div>
            <h3 className="font-semibold">What is an eSIM?</h3>
            <p>An eSIM is a digital SIM that lets you activate a cellular plan without a physical SIM card.</p>
          </div>
          <div>
            <h3 className="font-semibold">Which phones support eSIM?</h3>
            <p>Most newer iPhones, Google Pixel phones, and many Samsung and Huawei models support eSIM.</p>
          </div>
          <div>
            <h3 className="font-semibold">Can I keep my current number?</h3>
            <p>Yes! Your eSIM is for data. You can still use WhatsApp or calls over Wi-Fi with your original number.</p>
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 text-white text-center py-6 text-sm">
        Powered by Visnec Nexus (VNX) — <a href="https://visnec.com" className="underline">visnec.com</a>
      </footer>
    </main>
  );
}
