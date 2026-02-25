import React from "react";
import { Header, Footer } from "@/components/layout/navigation";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="py-20 px-6 max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-purple-600 text-transparent bg-clip-text">
            Privacy Policy
          </h1>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 mb-8">
              Last Updated: April 12, 2025
            </p>
            
            <p className="text-gray-300 mb-8">
              At DarkNotes, we value your privacy and are committed to protecting your personal information. Our Privacy Policy outlines how we collect, use, and safeguard your data as you explore and engage with our platform.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">1. Information We Collect</h2>
            <p className="text-gray-300">
              We collect information you provide directly to us, such as when you create an account, upload content, or subscribe to our premium services. This may include:
            </p>
            <ul className="list-disc pl-6 text-gray-300">
              <li>Personal information (name, email address)</li>
              <li>Payment information</li>
              <li>Music and content you upload</li>
              <li>Feedback and interactions with our AI mentors</li>
            </ul>
            
            <p className="text-gray-300 mt-4">
              We also automatically collect certain information when you use our Service, including:
            </p>
            <ul className="list-disc pl-6 text-gray-300">
              <li>Device information</li>
              <li>Usage data and analytics</li>
              <li>IP address and location data</li>
              <li>Cookies and tracking technologies</li>
            </ul>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">2. How We Use Your Information</h2>
            <p className="text-gray-300">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 text-gray-300">
              <li>Provide, maintain, and improve our Service</li>
              <li>Process transactions and manage your account</li>
              <li>Personalize your experience and deliver tailored content</li>
              <li>Train and improve our AI mentors</li>
              <li>Communicate with you about updates, promotions, and news</li>
              <li>Comply with legal obligations</li>
            </ul>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">3. Sharing Your Information</h2>
            <p className="text-gray-300">
              We do not sell your personal information. We may share your information with:
            </p>
            <ul className="list-disc pl-6 text-gray-300">
              <li>Service providers who help us operate our platform</li>
              <li>Payment processors for subscription management</li>
              <li>Legal authorities when required by law</li>
              <li>Other users if you choose to make your content public</li>
            </ul>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">4. Data Security</h2>
            <p className="text-gray-300">
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">5. Your Choices and Rights</h2>
            <p className="text-gray-300">
              You have certain rights regarding your personal information, including:
            </p>
            <ul className="list-disc pl-6 text-gray-300">
              <li>Accessing, correcting, or deleting your personal information</li>
              <li>Withdrawing consent for certain processing activities</li>
              <li>Opting out of marketing communications</li>
              <li>Requesting a copy of your data</li>
            </ul>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">6. Changes to This Policy</h2>
            <p className="text-gray-300">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last Updated" date.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">7. Contact Us</h2>
            <p className="text-gray-300">
              If you have any questions about this Privacy Policy, please contact us at privacy@darknotes.com.
            </p>
            
            <div className="mt-12 text-center">
              <p className="text-sm text-gray-500">
                © {new Date().getFullYear()} DarkNotes - A Visnec Media LLC company. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}