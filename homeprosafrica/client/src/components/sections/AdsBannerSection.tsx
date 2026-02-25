import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  AlertTriangle, 
  Hammer, 
  Wrench, 
  Lightbulb, 
  ChevronLeft, 
  ChevronRight, 
  Shield, 
  Video, 
  Camera 
} from "lucide-react";

export default function AdsBannerSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const bannerContent = [
    {
      category: "DIY",
      title: "Weekend Home Improvement Projects",
      description: "Easy DIY tasks to upgrade your home without breaking the bank.",
      icon: <Hammer className="w-6 h-6" />,
      buttonText: "View DIY Tips",
      bgColor: "bg-amber-100",
      textColor: "text-amber-800",
      buttonClass: "bg-amber-600 hover:bg-amber-700",
    },
    {
      category: "SAFETY",
      title: "Essential Home Safety Checklist",
      description: "Protect your family with these crucial home safety measures.",
      icon: <AlertTriangle className="w-6 h-6" />,
      buttonText: "Safety Guide",
      bgColor: "bg-red-100",
      textColor: "text-red-800",
      buttonClass: "bg-red-600 hover:bg-red-700",
    },
    {
      category: "INSURANCE",
      title: "Protect Your Home & Service Projects",
      description: "Get specialized insurance for homeowners and service professionals.",
      icon: <Shield className="w-6 h-6" />,
      buttonText: "Compare Options",
      bgColor: "bg-purple-100",
      textColor: "text-purple-800",
      buttonClass: "bg-purple-600 hover:bg-purple-700",
    },
    {
      category: "VERIFICATION",
      title: "Verified Pros You Can Trust",
      description: "All professionals undergo thorough background and skill verification.",
      icon: <Camera className="w-6 h-6" />,
      buttonText: "Learn About Verification",
      bgColor: "bg-teal-100",
      textColor: "text-teal-800",
      buttonClass: "bg-teal-600 hover:bg-teal-700",
    },
    {
      category: "TOOLS",
      title: "Must-Have Tools for Small Business Owners",
      description: "Essential equipment to maintain your business premises efficiently.",
      icon: <Wrench className="w-6 h-6" />,
      buttonText: "Equipment Guide",
      bgColor: "bg-blue-100",
      textColor: "text-blue-800",
      buttonClass: "bg-blue-600 hover:bg-blue-700",
    },
    {
      category: "BUSINESS TIPS",
      title: "Growing Your Service Business in Africa",
      description: "Expert strategies to expand your local service business.",
      icon: <Lightbulb className="w-6 h-6" />,
      buttonText: "Business Tips",
      bgColor: "bg-green-100",
      textColor: "text-green-800",
      buttonClass: "bg-green-600 hover:bg-green-700",
    },
    {
      category: "SHARE WORK",
      title: "Upload Videos of Your Projects",
      description: "Professionals can showcase their skills with video portfolios.",
      icon: <Video className="w-6 h-6" />,
      buttonText: "Upload Now",
      bgColor: "bg-pink-100",
      textColor: "text-pink-800",
      buttonClass: "bg-pink-600 hover:bg-pink-700",
    }
  ];

  const prevSlide = () => {
    setCurrentSlide((prev) => 
      prev === 0 ? bannerContent.length - 1 : prev - 1
    );
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => 
      (prev + 1) % bannerContent.length
    );
  };

  const currentBanner = bannerContent[currentSlide];

  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4">
        <div className="relative">
          <Card className={`${currentBanner.bgColor} border-none shadow-md overflow-hidden`}>
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row items-center p-4 md:p-6">
                <div className="w-16 h-16 rounded-full flex items-center justify-center bg-white mb-4 md:mb-0 md:mr-6">
                  {currentBanner.icon}
                </div>
                <div className="flex-1 text-center md:text-left">
                  <span className={`inline-block px-2 py-1 text-xs font-semibold rounded mb-2 ${currentBanner.textColor} bg-white bg-opacity-50`}>
                    {currentBanner.category}
                  </span>
                  <h3 className={`text-xl font-bold mb-2 ${currentBanner.textColor}`}>{currentBanner.title}</h3>
                  <p className={`${currentBanner.textColor} mb-4 md:mb-0`}>{currentBanner.description}</p>
                </div>
                <div className="mt-4 md:mt-0 md:ml-6">
                  <Button className={`text-white ${currentBanner.buttonClass} px-4 py-2`}>
                    {currentBanner.buttonText}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {bannerContent.length > 1 && (
            <>
              <Button 
                variant="outline" 
                size="icon" 
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white rounded-full shadow-md"
                onClick={prevSlide}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white rounded-full shadow-md"
                onClick={nextSlide}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}