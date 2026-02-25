import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ChevronLeft, Share2, X } from "lucide-react";
import BACDisplay from '@/components/breath/BACDisplay';
import MetabolismCalculator from '@/components/breath/MetabolismCalculator';
import UpsellModal from '@/components/monetization/UpsellModal';
import { getBreathTestHistory } from '@/lib/breathalyzer-api';

// Demo userId for now
const DEMO_USER_ID = 1;

export default function ResultScreen() {
  const [, setLocation] = useLocation();
  const [showInsuranceModal, setShowInsuranceModal] = useState(false);
  const [showUpsellModal, setShowUpsellModal] = useState(false);
  
  // Fetch the most recent breath test
  const { data: testHistory, isLoading } = useQuery({
    queryKey: [`/api/users/${DEMO_USER_ID}/breath-tests`],
    queryFn: () => getBreathTestHistory(DEMO_USER_ID)
  });
  
  const mostRecentTest = testHistory && testHistory.length > 0 
    ? testHistory[0] 
    : null;
    
  // Show upsell modal for tests with warning or danger levels
  useEffect(() => {
    if (mostRecentTest && (mostRecentTest.level === 'warning' || mostRecentTest.level === 'danger')) {
      setShowUpsellModal(true);
    }
  }, [mostRecentTest]);
  
  const handleGoBack = () => {
    setLocation('/');
  };
  
  const handleShare = () => {
    // In a real app, this would open a share dialog
    alert('Sharing functionality would be implemented here');
  };
  
  const handleNewTest = () => {
    setLocation('/scan');
  };
  
  const toggleInsuranceModal = () => {
    setShowInsuranceModal(!showInsuranceModal);
  };
  
  return (
    <div className="container max-w-md mx-auto px-4 py-8 text-fogwhite">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleGoBack}
            className="text-breathteal hover:text-breathteal/80 hover:bg-midnight"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-breathteal">Result Details</h1>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleShare}
            className="text-breathteal hover:text-breathteal/80 hover:bg-midnight"
          >
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : mostRecentTest ? (
          <>
            <BACDisplay 
              bac={mostRecentTest.bac.toString()}
              level={mostRecentTest.level as "safe" | "warning" | "danger"}
              message={mostRecentTest.message}
            />
            
            <Card className="border-midnight bg-carbon">
              <CardHeader className="bg-midnight pb-4 border-b border-midnight">
                <CardTitle className="text-fogwhite">Recommendations</CardTitle>
                <CardDescription className="text-coolgray">Based on your test results</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 p-5">
                {mostRecentTest.level === 'safe' ? (
                  <>
                    <p className="text-signalmint flex items-center gap-2">
                      <span className="h-5 w-5 rounded-full bg-signalmint/20 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                      Safe to drive
                    </p>
                    <p className="text-signalmint flex items-center gap-2">
                      <span className="h-5 w-5 rounded-full bg-signalmint/20 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                      No impairment detected
                    </p>
                    <p className="text-signalmint flex items-center gap-2">
                      <span className="h-5 w-5 rounded-full bg-signalmint/20 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                      Continue to monitor if drinking
                    </p>
                  </>
                ) : mostRecentTest.level === 'warning' ? (
                  <>
                    <p className="text-yellow-400 flex items-center gap-2">
                      <span className="h-5 w-5 rounded-full bg-yellow-400/20 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </span>
                      Do not drive
                    </p>
                    <p className="text-yellow-400 flex items-center gap-2">
                      <span className="h-5 w-5 rounded-full bg-yellow-400/20 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </span>
                      Moderate impairment detected
                    </p>
                    <p className="text-yellow-400 flex items-center gap-2">
                      <span className="h-5 w-5 rounded-full bg-yellow-400/20 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </span>
                      Wait several hours before driving
                    </p>
                    <p className="text-yellow-400 flex items-center gap-2">
                      <span className="h-5 w-5 rounded-full bg-yellow-400/20 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </span>
                      Consider arranging alternative transportation
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-crimson flex items-center gap-2">
                      <span className="h-5 w-5 rounded-full bg-crimson/20 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </span>
                      Do not drive under any circumstances
                    </p>
                    <p className="text-crimson flex items-center gap-2">
                      <span className="h-5 w-5 rounded-full bg-crimson/20 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </span>
                      Significant impairment detected
                    </p>
                    <p className="text-crimson flex items-center gap-2">
                      <span className="h-5 w-5 rounded-full bg-crimson/20 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </span>
                      Use rideshare, taxi, or public transportation
                    </p>
                    <p className="text-crimson flex items-center gap-2">
                      <span className="h-5 w-5 rounded-full bg-crimson/20 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </span>
                      Wait at least 24 hours before driving
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
            
            <div className="space-y-4">
              {(mostRecentTest.level === 'warning' || mostRecentTest.level === 'danger') && (
                <Card className="border-crimson/30 bg-midnight">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2 text-fogwhite">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-crimson" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                      Safety Services
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-0">
                    <p className="text-sm text-coolgray">
                      It's not safe to drive. Use a rideshare service or call a taxi to get home safely.
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <Button 
                        variant="outline" 
                        className="justify-between bg-carbon border-crimson/30 text-fogwhite hover:bg-crimson/10 hover:border-crimson/50"
                        onClick={() => window.open('https://www.uber.com', '_blank')}
                      >
                        <span className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-breathteal" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"/>
                            <path d="m13 7-3 3H7v4h3l3 3z"/>
                          </svg>
                          Request Uber
                        </span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-crimson" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </Button>
                      <Button 
                        variant="outline" 
                        className="justify-between bg-carbon border-crimson/30 text-fogwhite hover:bg-crimson/10 hover:border-crimson/50"
                        onClick={() => window.open('https://www.lyft.com', '_blank')}
                      >
                        <span className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-pink-400" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"/>
                            <path d="M15.707 11.707a1.111 1.111 0 0 1-1.571 0l-2.129-2.129-2.129 2.129a1.111 1.111 0 0 1-1.571-1.571l2.129-2.129-2.129-2.129a1.111 1.111 0 0 1 1.571-1.571l2.129 2.129 2.129-2.129a1.111 1.111 0 0 1 1.571 1.571l-2.129 2.129 2.129 2.129a1.111 1.111 0 0 1 0 1.571z"/>
                          </svg>
                          Request Lyft
                        </span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-crimson" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </Button>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full justify-between bg-carbon border-crimson/30 text-fogwhite hover:bg-crimson/10 hover:border-crimson/50"
                      onClick={() => {
                        // Open phone app with taxi number
                        window.open('tel:+1555-555-5555', '_blank');
                      }}
                    >
                      <span className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-yellow-400" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"/>
                          <path d="M15 9h-4V6H9v3H6l4.5 4.5L15 9z"/>
                        </svg>
                        Call Local Taxi
                      </span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-crimson" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </Button>
                  </CardContent>
                </Card>
              )}

              <Card className="border-breathteal/30 bg-midnight">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2 text-fogwhite">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-breathteal" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Insurance Benefits
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 pt-0">
                  <p className="text-sm text-coolgray">
                    Share your responsible testing habits with your insurance provider for potential discounts.
                  </p>
                  
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-2">
                      {/* Insurance provider options with logos - first row */}
                      <button 
                        className="p-3 border border-breathteal/20 rounded-md bg-carbon hover:bg-breathteal/10 transition-colors focus:outline-none focus:ring-2 focus:ring-breathteal"
                        onClick={() => window.open('https://www.statefarm.com', '_blank')}
                      >
                        <div className="flex flex-col items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-fogwhite mb-1" viewBox="0 0 24 24" fill="currentColor">
                            <rect width="24" height="24" rx="4" fill="#121A2D" />
                            <path d="M7 12 h10 M12 7 v10" stroke="#00D6B7" strokeWidth="2" />
                          </svg>
                          <span className="text-xs text-coolgray">State Farm</span>
                        </div>
                      </button>
                      
                      <button 
                        className="p-3 border border-breathteal/20 rounded-md bg-carbon hover:bg-breathteal/10 transition-colors focus:outline-none focus:ring-2 focus:ring-breathteal"
                        onClick={() => window.open('https://www.allstate.com', '_blank')}
                      >
                        <div className="flex flex-col items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-fogwhite mb-1" viewBox="0 0 24 24" fill="currentColor">
                            <rect width="24" height="24" rx="4" fill="#121A2D" />
                            <circle cx="12" cy="12" r="6" stroke="#00D6B7" strokeWidth="2" fill="none" />
                          </svg>
                          <span className="text-xs text-coolgray">Allstate</span>
                        </div>
                      </button>
                      
                      <button 
                        className="p-3 border border-breathteal/20 rounded-md bg-carbon hover:bg-breathteal/10 transition-colors focus:outline-none focus:ring-2 focus:ring-breathteal"
                        onClick={() => window.open('https://www.geico.com', '_blank')}
                      >
                        <div className="flex flex-col items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-fogwhite mb-1" viewBox="0 0 24 24" fill="currentColor">
                            <rect width="24" height="24" rx="4" fill="#121A2D" />
                            <path d="M6 12 A6 6 0 0 1 18 12" stroke="#00D6B7" strokeWidth="2" fill="none" />
                          </svg>
                          <span className="text-xs text-coolgray">Geico</span>
                        </div>
                      </button>
                      
                      {/* Insurance provider options with logos - second row */}
                      <button 
                        className="p-3 border border-breathteal/20 rounded-md bg-carbon hover:bg-breathteal/10 transition-colors focus:outline-none focus:ring-2 focus:ring-breathteal"
                        onClick={() => window.open('https://www.progressive.com', '_blank')}
                      >
                        <div className="flex flex-col items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-fogwhite mb-1" viewBox="0 0 24 24" fill="currentColor">
                            <rect width="24" height="24" rx="4" fill="#121A2D" />
                            <path d="M7 12 L17 12 L12 7 L12 17" stroke="#00D6B7" strokeWidth="2" fill="none" strokeLinecap="round" />
                          </svg>
                          <span className="text-xs text-coolgray">Progressive</span>
                        </div>
                      </button>
                      
                      <button 
                        className="p-3 border border-breathteal/20 rounded-md bg-carbon hover:bg-breathteal/10 transition-colors focus:outline-none focus:ring-2 focus:ring-breathteal"
                        onClick={() => window.open('https://www.libertymutual.com', '_blank')}
                      >
                        <div className="flex flex-col items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-fogwhite mb-1" viewBox="0 0 24 24" fill="currentColor">
                            <rect width="24" height="24" rx="4" fill="#121A2D" />
                            <path d="M8 8 L16 8 L16 16 L8 16 Z" stroke="#00D6B7" strokeWidth="2" fill="none" />
                          </svg>
                          <span className="text-xs text-coolgray">Liberty</span>
                        </div>
                      </button>
                      
                      <button 
                        className="p-3 border border-breathteal/20 rounded-md bg-carbon hover:bg-breathteal/10 transition-colors focus:outline-none focus:ring-2 focus:ring-breathteal"
                        onClick={() => window.open('https://www.nationwide.com', '_blank')}
                      >
                        <div className="flex flex-col items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-fogwhite mb-1" viewBox="0 0 24 24" fill="currentColor">
                            <rect width="24" height="24" rx="4" fill="#121A2D" />
                            <path d="M7 12 L17 12 M10 7 L14 7 M10 17 L14 17" stroke="#00D6B7" strokeWidth="2" strokeLinecap="round" />
                          </svg>
                          <span className="text-xs text-coolgray">Nationwide</span>
                        </div>
                      </button>
                    </div>
                  
                    <Button 
                      variant="outline" 
                      className="w-full justify-between bg-carbon border-breathteal/30 text-fogwhite hover:bg-midnight hover:text-breathteal"
                      onClick={toggleInsuranceModal}
                    >
                      <span>See All Insurance Providers</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Metabolism Calculator */}
              <MetabolismCalculator initialBAC={mostRecentTest.bac} />

              <Button 
                onClick={handleNewTest} 
                className="w-full mt-6 bg-breathteal hover:bg-breathteal/90 text-midnight font-medium"
              >
                Take a New Test
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-coolgray mb-4">No test results found</p>
            <Button 
              onClick={handleNewTest}
              className="bg-breathteal hover:bg-breathteal/90 text-midnight font-medium"
            >
              Take Your First Test
            </Button>
          </div>
        )}
      </div>
      
      {/* Insurance Providers Modal */}
      {showInsuranceModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-carbon border border-breathteal/40 rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="p-4 border-b border-midnight sticky top-0 bg-midnight flex justify-between items-center">
              <h2 className="text-xl font-semibold text-breathteal">Insurance Providers</h2>
              <button 
                onClick={toggleInsuranceModal}
                className="text-coolgray hover:text-breathteal transition-colors rounded-full p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-4">
              <p className="text-coolgray mb-4">
                Connect with your insurance provider to share your responsible testing habits and potentially receive discounts.
              </p>
              
              <div className="grid grid-cols-2 gap-3 mb-4">
                {/* First row of insurance providers */}
                <button 
                  className="p-4 border border-breathteal/20 rounded-md bg-midnight hover:bg-breathteal/10 transition-colors flex flex-col items-center"
                  onClick={() => window.open('https://www.statefarm.com', '_blank')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-fogwhite mb-2" viewBox="0 0 24 24" fill="currentColor">
                    <rect width="24" height="24" rx="4" fill="#121A2D" />
                    <path d="M7 12 h10 M12 7 v10" stroke="#00D6B7" strokeWidth="2" />
                  </svg>
                  <span className="text-sm text-fogwhite">State Farm</span>
                </button>
                
                <button 
                  className="p-4 border border-breathteal/20 rounded-md bg-midnight hover:bg-breathteal/10 transition-colors flex flex-col items-center"
                  onClick={() => window.open('https://www.allstate.com', '_blank')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-fogwhite mb-2" viewBox="0 0 24 24" fill="currentColor">
                    <rect width="24" height="24" rx="4" fill="#121A2D" />
                    <circle cx="12" cy="12" r="6" stroke="#00D6B7" strokeWidth="2" fill="none" />
                  </svg>
                  <span className="text-sm text-fogwhite">Allstate</span>
                </button>
                
                {/* Second row of insurance providers */}
                <button 
                  className="p-4 border border-breathteal/20 rounded-md bg-midnight hover:bg-breathteal/10 transition-colors flex flex-col items-center"
                  onClick={() => window.open('https://www.geico.com', '_blank')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-fogwhite mb-2" viewBox="0 0 24 24" fill="currentColor">
                    <rect width="24" height="24" rx="4" fill="#121A2D" />
                    <path d="M6 12 A6 6 0 0 1 18 12" stroke="#00D6B7" strokeWidth="2" fill="none" />
                  </svg>
                  <span className="text-sm text-fogwhite">Geico</span>
                </button>
                
                <button 
                  className="p-4 border border-breathteal/20 rounded-md bg-midnight hover:bg-breathteal/10 transition-colors flex flex-col items-center"
                  onClick={() => window.open('https://www.progressive.com', '_blank')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-fogwhite mb-2" viewBox="0 0 24 24" fill="currentColor">
                    <rect width="24" height="24" rx="4" fill="#121A2D" />
                    <path d="M7 12 L17 12 L12 7 L12 17" stroke="#00D6B7" strokeWidth="2" fill="none" strokeLinecap="round" />
                  </svg>
                  <span className="text-sm text-fogwhite">Progressive</span>
                </button>
                
                {/* Third row of insurance providers */}
                <button 
                  className="p-4 border border-breathteal/20 rounded-md bg-midnight hover:bg-breathteal/10 transition-colors flex flex-col items-center"
                  onClick={() => window.open('https://www.libertymutual.com', '_blank')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-fogwhite mb-2" viewBox="0 0 24 24" fill="currentColor">
                    <rect width="24" height="24" rx="4" fill="#121A2D" />
                    <path d="M8 8 L16 8 L16 16 L8 16 Z" stroke="#00D6B7" strokeWidth="2" fill="none" />
                  </svg>
                  <span className="text-sm text-fogwhite">Liberty Mutual</span>
                </button>
                
                <button 
                  className="p-4 border border-breathteal/20 rounded-md bg-midnight hover:bg-breathteal/10 transition-colors flex flex-col items-center"
                  onClick={() => window.open('https://www.nationwide.com', '_blank')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-fogwhite mb-2" viewBox="0 0 24 24" fill="currentColor">
                    <rect width="24" height="24" rx="4" fill="#121A2D" />
                    <path d="M7 12 L17 12 M10 7 L14 7 M10 17 L14 17" stroke="#00D6B7" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  <span className="text-sm text-fogwhite">Nationwide</span>
                </button>
              </div>
              
              <div className="mb-4">
                <p className="text-coolgray mb-2 text-sm">{"Don't see your provider?"}</p>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Search for your provider..."
                    className="w-full py-2 px-3 bg-midnight border border-breathteal/30 rounded-md text-fogwhite focus:outline-none focus:ring-2 focus:ring-breathteal/50"
                  />
                </div>
              </div>
              
              <div className="mt-6 flex flex-col gap-3">
                <Button 
                  className="w-full bg-breathteal text-midnight hover:bg-breathteal/90"
                  onClick={() => {
                    alert('Your information will be shared with your insurance provider for potential discounts.');
                    toggleInsuranceModal();
                  }}
                >
                  Share My Test History
                </Button>
                
                <Button 
                  variant="outline"
                  className="w-full border-breathteal/30 text-coolgray hover:text-fogwhite"
                  onClick={toggleInsuranceModal}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Premium Upsell Modal */}
      <UpsellModal 
        visible={showUpsellModal} 
        onClose={() => setShowUpsellModal(false)} 
      />
    </div>
  );
}