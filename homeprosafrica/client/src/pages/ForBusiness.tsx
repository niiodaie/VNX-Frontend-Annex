import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  Users, 
  ShieldCheck, 
  Award, 
  Clock, 
  Banknote,
  Check,
  ArrowRight,
  Building2,
  Rocket,
  Briefcase
} from "lucide-react";

export default function ForBusiness() {
  const benefits = [
    {
      icon: <TrendingUp className="h-8 w-8 text-primary" />,
      title: "Grow Your Customer Base",
      description: "Reach thousands of potential customers looking for your exact services in your local area.",
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Targeted Audience",
      description: "Connect with homeowners actively seeking skilled professionals for specific projects.",
    },
    {
      icon: <ShieldCheck className="h-8 w-8 text-primary" />,
      title: "Build Trust & Reputation",
      description: "Showcase your verified reviews and build a strong online presence that converts into business.",
    },
    {
      icon: <Award className="h-8 w-8 text-primary" />,
      title: "Stand Out From Competition",
      description: "Highlight your expertise, certifications, and unique services to differentiate your business.",
    },
    {
      icon: <Clock className="h-8 w-8 text-primary" />,
      title: "Save Time & Resources",
      description: "Focus on your work while we handle marketing and connecting you with qualified leads.",
    },
    {
      icon: <Banknote className="h-8 w-8 text-primary" />,
      title: "Flexible Pricing Options",
      description: "Choose payment models that work for your business, from subscription to pay-per-lead.",
    },
  ];

  const pricingPlans = [
    {
      name: "Basic",
      price: "Free",
      description: "Get started with a basic profile",
      features: [
        "Basic business profile",
        "Limited visibility in search results",
        "Receive up to 5 leads per month",
        "Email support"
      ],
      recommended: false,
      buttonText: "Sign Up Free"
    },
    {
      name: "Pro",
      price: "$29/month",
      description: "Perfect for growing businesses",
      features: [
        "Enhanced business profile",
        "Priority in search results",
        "Unlimited leads",
        "Verified badge",
        "Review response tools",
        "Phone support"
      ],
      recommended: true,
      buttonText: "Start 14-Day Trial"
    },
    {
      name: "Premium",
      price: "$79/month",
      description: "For established service businesses",
      features: [
        "All Pro features",
        "Featured listings",
        "Promotional banners",
        "Lead analytics dashboard",
        "Customer relationship tools",
        "Dedicated account manager"
      ],
      recommended: false,
      buttonText: "Contact Sales"
    }
  ];

  const businessTypes = [
    {
      icon: <Building2 className="h-6 w-6 text-primary" />,
      title: "Service Contractors",
      examples: "Plumbers, Electricians, HVAC, etc.",
      benefits: [
        "Grow your residential service business",
        "Fill gaps in your schedule",
        "Expand to new neighborhoods",
        "Build a verified online presence"
      ]
    },
    {
      icon: <Briefcase className="h-6 w-6 text-primary" />,
      title: "Small Businesses",
      examples: "Cleaning Services, Landscaping, Painting",
      benefits: [
        "Compete with larger companies",
        "Showcase your local expertise",
        "Build your customer base",
        "Manage your reputation effectively"
      ]
    },
    {
      icon: <Rocket className="h-6 w-6 text-primary" />,
      title: "Solo Professionals",
      examples: "Independent craftsmen, specialists, etc.",
      benefits: [
        "Find clients without expensive advertising",
        "Establish credibility through verification",
        "Build your personal brand",
        "Flexible pricing to match your needs"
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="pt-16">
        {/* Hero section */}
        <section className="relative py-20 bg-gradient-to-r from-primary to-secondary">
          <div className="container mx-auto px-4 text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Grow Your Service Business Across Africa
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Join thousands of service professionals who are expanding their customer base 
              and building their reputation on HomeProsAfrica.
            </p>
            <Button className="bg-white text-primary hover:bg-white/90 px-8 py-6 text-lg font-semibold rounded-full">
              Register Your Business
            </Button>
          </div>
        </section>

        {/* Business Types section */}
        <section className="py-16 bg-light">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">
                Who is HomeProsAfrica For?
              </h2>
              <p className="text-gray-medium max-w-2xl mx-auto">
                Our platform helps various types of service businesses connect with homeowners across Africa.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {businessTypes.map((type, index) => (
                <Card key={index} className="overflow-hidden shadow-md">
                  <CardContent className="p-8">
                    <div className="mb-6">
                      {type.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{type.title}</h3>
                    <p className="text-gray-medium text-sm mb-4">{type.examples}</p>
                    <ul className="space-y-2">
                      {type.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-start">
                          <Check className="text-primary mt-1 mr-2 h-4 w-4 flex-shrink-0" />
                          <span className="text-sm">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
                FOR BUSINESS OWNERS
              </span>
              <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">
                Grow Your Service Business Across Africa
              </h2>
              <p className="text-gray-medium max-w-2xl mx-auto">
                Join thousands of small business owners who have expanded their customer base and increased their revenue through our platform.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <Card key={index} className="border border-gray-200 hover:shadow-md transition-shadow duration-300">
                  <CardContent className="p-6 text-center md:text-left">
                    <div className="flex flex-col md:flex-row items-center md:items-start mb-4">
                      <div className="mb-4 md:mb-0 md:mr-4 p-3 bg-primary/10 rounded-full">
                        {benefit.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2 font-heading">{benefit.title}</h3>
                        <p className="text-gray-medium">{benefit.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing section */}
        <section className="py-16 bg-light">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">
                Simple, Transparent Pricing
              </h2>
              <p className="text-gray-medium max-w-2xl mx-auto">
                Choose the plan that works best for your business and budget
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {pricingPlans.map((plan, index) => (
                <Card 
                  key={index} 
                  className={`overflow-hidden ${plan.recommended ? 'border-2 border-primary shadow-lg relative' : 'border shadow-md'}`}
                >
                  {plan.recommended && (
                    <div className="absolute top-0 left-0 right-0 bg-primary text-white text-center py-1 text-sm font-medium">
                      Most Popular
                    </div>
                  )}
                  <CardContent className={`p-6 ${plan.recommended ? 'pt-8' : 'pt-6'}`}>
                    <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                    <div className="mb-4">
                      <span className="text-3xl font-bold">{plan.price}</span>
                    </div>
                    <p className="text-gray-medium mb-4">{plan.description}</p>
                    <ul className="space-y-2 mb-6">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start">
                          <Check className="text-primary mt-1 mr-2 h-4 w-4 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className={`w-full ${plan.recommended ? 'bg-primary text-white' : 'bg-white border border-primary text-primary'}`}
                    >
                      {plan.buttonText}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Feature tabs */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">
                Business Tools & Features
              </h2>
              <p className="text-gray-medium max-w-2xl mx-auto">
                Everything you need to grow your service business in one platform
              </p>
            </div>

            <Tabs defaultValue="profile" className="max-w-4xl mx-auto">
              <TabsList className="grid grid-cols-3 mb-8">
                <TabsTrigger value="profile">Business Profile</TabsTrigger>
                <TabsTrigger value="leads">Lead Management</TabsTrigger>
                <TabsTrigger value="reviews">Reviews & Reputation</TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile" className="p-6 bg-light rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-2xl font-semibold mb-4">Professional Business Profile</h3>
                    <p className="text-gray-medium mb-4">
                      Create a comprehensive profile that showcases your services, expertise, and highlights
                      what makes your business special.
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <Check className="text-primary mt-1 mr-3 h-5 w-5" />
                        <span>Upload photos and videos of your work</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="text-primary mt-1 mr-3 h-5 w-5" />
                        <span>Display licenses, certifications and insurance</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="text-primary mt-1 mr-3 h-5 w-5" />
                        <span>Highlight your areas of specialty</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="text-primary mt-1 mr-3 h-5 w-5" />
                        <span>Set your service area and available hours</span>
                      </li>
                    </ul>
                    <Button className="mt-6 bg-primary text-white">
                      Learn More <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                  <div className="bg-white rounded-lg shadow-md p-6">
                    {/* Placeholder for profile preview image */}
                    <div className="bg-gray-200 w-full h-64 rounded-md mb-4 flex items-center justify-center text-gray-500">
                      Profile Preview Image
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="leads" className="p-6 bg-light rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-2xl font-semibold mb-4">Efficient Lead Management</h3>
                    <p className="text-gray-medium mb-4">
                      Receive, respond to, and track customer leads all in one place. Never miss an opportunity.
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <Check className="text-primary mt-1 mr-3 h-5 w-5" />
                        <span>Real-time lead notifications</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="text-primary mt-1 mr-3 h-5 w-5" />
                        <span>Mobile app for on-the-go responses</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="text-primary mt-1 mr-3 h-5 w-5" />
                        <span>Lead qualification and tracking</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="text-primary mt-1 mr-3 h-5 w-5" />
                        <span>Conversion analytics and insights</span>
                      </li>
                    </ul>
                    <Button className="mt-6 bg-primary text-white">
                      Learn More <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                  <div className="bg-white rounded-lg shadow-md p-6">
                    {/* Placeholder for leads dashboard image */}
                    <div className="bg-gray-200 w-full h-64 rounded-md mb-4 flex items-center justify-center text-gray-500">
                      Leads Dashboard Preview
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="reviews" className="p-6 bg-light rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-2xl font-semibold mb-4">Reputation Management</h3>
                    <p className="text-gray-medium mb-4">
                      Build and manage your online reputation with verified reviews from real customers.
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <Check className="text-primary mt-1 mr-3 h-5 w-5" />
                        <span>Collect verified customer reviews</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="text-primary mt-1 mr-3 h-5 w-5" />
                        <span>Respond to reviews professionally</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="text-primary mt-1 mr-3 h-5 w-5" />
                        <span>Showcase your best testimonials</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="text-primary mt-1 mr-3 h-5 w-5" />
                        <span>Get insights on review sentiment</span>
                      </li>
                    </ul>
                    <Button className="mt-6 bg-primary text-white">
                      Learn More <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                  <div className="bg-white rounded-lg shadow-md p-6">
                    {/* Placeholder for reviews dashboard image */}
                    <div className="bg-gray-200 w-full h-64 rounded-md mb-4 flex items-center justify-center text-gray-500">
                      Reviews Management Preview
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* CTA section */}
        <section className="py-16 bg-gradient-to-r from-primary to-secondary text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Grow Your Business?
            </h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Join thousands of service professionals who are growing their business with HomeProsAfrica.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button className="bg-white text-primary hover:bg-white/90 px-8 py-6 text-lg font-semibold rounded-full">
                Sign Up Now
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg font-semibold rounded-full">
                Schedule a Demo
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}