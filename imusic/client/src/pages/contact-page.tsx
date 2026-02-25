import React from "react";
import { Header, Footer } from "@/components/layout/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="py-20 px-6 max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-purple-600 text-transparent bg-clip-text text-center">
            Contact Us
          </h1>
          
          <p className="text-gray-300 text-center mb-12 max-w-2xl mx-auto">
            Have questions about DarkNotes? Want to learn more about our AI mentors or subscription plans? We're here to help. Reach out using the form below.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-gradient-to-br from-black/80 to-purple-950/20 rounded-lg p-8 border border-purple-900/30">
              <h2 className="text-2xl font-bold mb-6 text-purple-400">Send Us a Message</h2>
              
              <form className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-gray-300">
                    Name
                  </label>
                  <Input
                    id="name"
                    placeholder="Your name"
                    className="bg-black/50 border-purple-900/50 focus:border-purple-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-300">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Your email address"
                    className="bg-black/50 border-purple-900/50 focus:border-purple-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium text-gray-300">
                    Subject
                  </label>
                  <Input
                    id="subject"
                    placeholder="What's this about?"
                    className="bg-black/50 border-purple-900/50 focus:border-purple-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium text-gray-300">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    placeholder="Your message..."
                    className="bg-black/50 border-purple-900/50 focus:border-purple-500 min-h-[150px]"
                  />
                </div>
                
                <Button 
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900"
                >
                  Send Message
                </Button>
              </form>
            </div>
            
            <div>
              <div className="bg-gradient-to-br from-black/80 to-purple-950/20 rounded-lg p-8 border border-purple-900/30 mb-8">
                <h3 className="text-xl font-bold mb-4 text-purple-400">Contact Information</h3>
                
                <div className="space-y-4 text-gray-300">
                  <p>
                    <span className="block text-sm text-gray-500">Email</span>
                    support@darknotes.com
                  </p>
                  
                  <p>
                    <span className="block text-sm text-gray-500">Phone</span>
                    (800) 555-DARK
                  </p>
                  
                  <p>
                    <span className="block text-sm text-gray-500">Address</span>
                    123 Music Avenue<br />
                    Suite 456<br />
                    Los Angeles, CA 90028
                  </p>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-black/80 to-purple-950/20 rounded-lg p-8 border border-purple-900/30">
                <h3 className="text-xl font-bold mb-4 text-purple-400">Business Inquiries</h3>
                
                <p className="text-gray-300 mb-4">
                  For partnership opportunities, press inquiries, or business-related questions, please contact our business development team.
                </p>
                
                <p className="text-gray-300">
                  <span className="block text-sm text-gray-500">Business Development</span>
                  business@darknotes.com
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <p className="text-gray-400">
              Response Time: We typically respond to inquiries within 24-48 hours.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}