import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function AffiliatesPage() {
  return (
    <div className="min-h-screen bg-[#080808] text-white">
      {/* Header */}
      <header className="px-6 py-6 flex justify-between items-center bg-[#050505] border-b border-[#222222]">
        <Link href="/">
          <span className="text-2xl font-headline text-white">
            DarkNotes
          </span>
        </Link>
        
        <div className="flex space-x-3">
          <Link href="/mentor-selection">
            <Button className="bg-transparent hover:bg-[#0a0a0a] text-white border border-[#333333] px-4 py-1.5 h-auto">
              Mentors
            </Button>
          </Link>
          <Link href="/auth">
            <Button className="bg-transparent hover:bg-[#0a0a0a] text-white border border-[#333333] px-6 py-1.5 h-auto">
              Get Started
            </Button>
          </Link>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-headline text-[#d8c99b] mb-6">
            DarkNotes Affiliate Program
          </h1>
          
          <p className="text-md text-gray-300 max-w-3xl mx-auto">
            Partner with us to earn commission on every new member you bring to the DarkNotes community.
            Promote the future of AI-powered music mentorship.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
          {/* Left column: Benefits */}
          <div>
            <h2 className="text-2xl font-headline mb-6 text-purple-400">Program Benefits</h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="text-xl mb-2">30% Commission</h3>
                  <p className="text-gray-400">Earn 30% commission on all Pro memberships referred through your affiliate link, including recurring monthly payments.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="text-xl mb-2">90-Day Cookie</h3>
                  <p className="text-gray-400">Our tracking cookies last 90 days, giving you credit for conversions that happen weeks after the initial click.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="text-xl mb-2">Marketing Resources</h3>
                  <p className="text-gray-400">Access exclusive marketing materials, including banners, social media content, and mentor highlight reels.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 flex-shrink-0">
                  4
                </div>
                <div>
                  <h3 className="text-xl mb-2">Monthly Payments</h3>
                  <p className="text-gray-400">Receive your affiliate earnings monthly with reliable payment processing through PayPal or direct deposit.</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right column: Sign up */}
          <div>
            <Card className="bg-[#111111] border-[#333333]">
              <CardHeader>
                <CardTitle className="text-2xl text-white">Become an Affiliate</CardTitle>
                <CardDescription className="text-gray-400">
                  Fill out this form to join our affiliate program
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-300" htmlFor="name">Full Name</label>
                    <Input 
                      id="name" 
                      className="bg-[#1a1a1a] border-[#333333] text-white" 
                      placeholder="Your name" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm text-gray-300" htmlFor="email">Email Address</label>
                    <Input 
                      id="email" 
                      type="email" 
                      className="bg-[#1a1a1a] border-[#333333] text-white" 
                      placeholder="your@email.com" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm text-gray-300" htmlFor="website">Website or Social Media URL</label>
                    <Input 
                      id="website" 
                      className="bg-[#1a1a1a] border-[#333333] text-white" 
                      placeholder="https://yourwebsite.com" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm text-gray-300" htmlFor="why">How will you promote DarkNotes?</label>
                    <textarea 
                      id="why" 
                      className="w-full rounded-md bg-[#1a1a1a] border border-[#333333] p-2 text-white" 
                      rows={3} 
                      placeholder="Tell us about your promotion plans"
                    />
                  </div>
                </form>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-purple-700 hover:bg-purple-600 text-white">
                  Submit Application
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
        
        {/* Testimonials */}
        <div className="mt-20">
          <h2 className="text-2xl font-headline text-center mb-10 text-purple-400">Affiliate Success Stories</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#111111] border border-[#333333] p-6 rounded-lg">
              <div className="mb-4">
                <div className="inline-flex p-1 bg-purple-500/20 rounded-full">
                  <div className="w-10 h-10 rounded-full bg-purple-700 text-white flex items-center justify-center font-bold">
                    M
                  </div>
                </div>
              </div>
              <p className="text-gray-300 mb-4">"I've earned over $3,500 in just 3 months by recommending DarkNotes to my music production community. The conversion rate is incredible because the product sells itself."</p>
              <p className="text-purple-400 font-bold">Michael J.</p>
              <p className="text-xs text-gray-500">Music Producer & Blogger</p>
            </div>
            
            <div className="bg-[#111111] border border-[#333333] p-6 rounded-lg">
              <div className="mb-4">
                <div className="inline-flex p-1 bg-purple-500/20 rounded-full">
                  <div className="w-10 h-10 rounded-full bg-purple-700 text-white flex items-center justify-center font-bold">
                    S
                  </div>
                </div>
              </div>
              <p className="text-gray-300 mb-4">"As a vocal coach, DarkNotes has been the perfect complement to my teaching. My students love it, and I earn passive income every month from my referrals."</p>
              <p className="text-purple-400 font-bold">Sarah K.</p>
              <p className="text-xs text-gray-500">Vocal Coach</p>
            </div>
            
            <div className="bg-[#111111] border border-[#333333] p-6 rounded-lg">
              <div className="mb-4">
                <div className="inline-flex p-1 bg-purple-500/20 rounded-full">
                  <div className="w-10 h-10 rounded-full bg-purple-700 text-white flex items-center justify-center font-bold">
                    D
                  </div>
                </div>
              </div>
              <p className="text-gray-300 mb-4">"My YouTube channel is all about music tech reviews. DarkNotes has been my highest-converting affiliate program by far. The 30% commission is extremely generous."</p>
              <p className="text-purple-400 font-bold">David T.</p>
              <p className="text-xs text-gray-500">YouTube Creator</p>
            </div>
          </div>
        </div>
        
        {/* CTA */}
        <div className="mt-20 text-center p-10 rounded-lg border border-[#333333] bg-gradient-to-br from-[#111111] to-[#1a1a1a]">
          <h2 className="text-3xl font-headline mb-4 text-[#d8c99b]">Ready to start earning?</h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">Join our affiliate program today and turn your audience into a revenue stream while helping musicians find their unique sound.</p>
          <Button className="bg-purple-700 hover:bg-purple-600 text-white px-8 py-2 h-auto text-lg">
            Apply Now
          </Button>
        </div>
        
        {/* Brand tagline */}
        <div className="mt-20 text-center">
          <p className="text-gray-400 font-handwriting text-lg">
            Where your rawest thoughts become your realest sound
          </p>
        </div>
      </main>
    </div>
  );
}