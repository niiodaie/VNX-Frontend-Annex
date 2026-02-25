import React from "react";
import { Header, Footer } from "@/components/layout/navigation";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="py-20 px-6 max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-purple-600 text-transparent bg-clip-text">
            Terms of Service
          </h1>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 mb-8">
              Last Updated: April 12, 2025
            </p>
            
            <p className="text-gray-300 mb-8">
              Welcome to DarkNotes! These Terms of Use govern your use of our website and services. By accessing or using DarkNotes, you agree to abide by these terms. If you do not agree, please do not use our services.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-300">
              By using DarkNotes, you acknowledge that you have read, understood, and agree to these Terms of Use and our Privacy Policy.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">2. Eligibility</h2>
            <p className="text-gray-300">
              You must be at least 18 to use DarkNotes. By using our services, you represent that you meet this age requirement.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">3. Account Registration</h2>
            <p className="text-gray-300">
              You may be required to create an account to access certain features of DarkNotes. You agree to provide accurate, current, and complete information during registration and to update such information as necessary.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">4. User Conduct</h2>
            <p className="text-gray-300">
              You agree to use DarkNotes in a manner that is lawful and in compliance with these Terms. You will not:
            </p>
            <ul className="list-disc pl-6 text-gray-300 mb-4">
              <li>Use the platform for any illegal, harmful, or unauthorized purposes.</li>
              <li>Upload or transmit any content that is defamatory, obscene, offensive, or violates any third-party rights.</li>
              <li>Disrupt or interfere with the security or performance of the platform.</li>
            </ul>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">5. Intellectual Property</h2>
            <p className="text-gray-300">
              All content on DarkNotes, including text, graphics, logos, and software, is the property of DarkNotes or our licensors and is protected by intellectual property laws. You are granted a limited license to access and use the content for personal, non-commercial purposes.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">6. Third-Party Links</h2>
            <p className="text-gray-300">
              DarkNotes may contain links to third-party websites. We do not endorse or assume any responsibility for the content or practices of these websites. Your access to third-party sites is at your own risk.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">7. Termination</h2>
            <p className="text-gray-300">
              We reserve the right to suspend or terminate your access to DarkNotes at our discretion, without notice, for any violation of these Terms or other conduct that we believe is harmful to the platform or other users.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">8. Disclaimer of Warranties</h2>
            <p className="text-gray-300">
              DarkNotes is provided on an "as-is" and "as-available" basis. We make no representations or warranties of any kind regarding the platform or its availability.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">9. Limitation of Liability</h2>
            <p className="text-gray-300">
              To the fullest extent permitted by applicable law, DarkNotes shall not be liable for any indirect, incidental, or consequential damages arising from your use of the platform.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">10. Indemnification</h2>
            <p className="text-gray-300">
              You agree to indemnify and hold harmless DarkNotes, its affiliates, and their respective officers, directors, and employees from any claims, losses, or damages arising out of your use of the platform or violation of these Terms.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">11. Changes to Terms</h2>
            <p className="text-gray-300">
              We reserve the right to modify these Terms of Use at any time. Any changes will be effective immediately upon posting on the DarkNotes website. Your continued use of the platform constitutes acceptance of the new terms.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">12. Governing Law</h2>
            <p className="text-gray-300">
              These Terms of Use shall be governed by and construed in accordance with the laws of California, without regard to its conflict of law provisions.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">13. Contact Information</h2>
            <p className="text-gray-300">
              If you have any questions about these Terms of Use, please contact us at darknotes@gmail.com.
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