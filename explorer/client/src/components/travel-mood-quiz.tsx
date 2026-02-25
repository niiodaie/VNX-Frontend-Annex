import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { MapPin, Compass, Heart, Star } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

interface QuizQuestion {
  id: string;
  question: string;
  options: Array<{
    text: string;
    value: string;
    icon: React.ReactNode;
  }>;
}

interface TravelRecommendation {
  destination: string;
  reason: string;
  type: string;
  continent: string;
  matchPercentage: number;
  highlights: string[];
}

export default function TravelMoodQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [recommendations, setRecommendations] = useState<TravelRecommendation[]>([]);
  const { t } = useTranslation();

  const questions: QuizQuestion[] = [
    {
      id: "travelStyle",
      question: "What's your ideal travel style?",
      options: [
        { text: "Adventure & Exploration", value: "adventure", icon: <Compass className="w-5 h-5" /> },
        { text: "Relaxation & Wellness", value: "relaxation", icon: <Heart className="w-5 h-5" /> },
        { text: "Cultural Immersion", value: "culture", icon: <Star className="w-5 h-5" /> },
        { text: "City Discovery", value: "urban", icon: <MapPin className="w-5 h-5" /> }
      ]
    },
    {
      id: "climate",
      question: "What climate do you prefer?",
      options: [
        { text: "Tropical & Warm", value: "tropical", icon: <span>🌴</span> },
        { text: "Temperate & Mild", value: "temperate", icon: <span>🌸</span> },
        { text: "Cool & Crisp", value: "cool", icon: <span>🏔️</span> },
        { text: "Desert & Dry", value: "desert", icon: <span>🏜️</span> }
      ]
    },
    {
      id: "budget",
      question: "What's your travel budget range?",
      options: [
        { text: "Budget-Friendly", value: "budget", icon: <span>💰</span> },
        { text: "Mid-Range", value: "midrange", icon: <span>💸</span> },
        { text: "Luxury", value: "luxury", icon: <span>💎</span> },
        { text: "Ultra-Premium", value: "premium", icon: <span>👑</span> }
      ]
    },
    {
      id: "duration",
      question: "How long do you prefer to travel?",
      options: [
        { text: "Weekend Getaway (2-3 days)", value: "short", icon: <span>⚡</span> },
        { text: "Week-long Trip (4-7 days)", value: "medium", icon: <span>📅</span> },
        { text: "Extended Journey (1-2 weeks)", value: "long", icon: <span>🗓️</span> },
        { text: "Epic Adventure (3+ weeks)", value: "extended", icon: <span>🌍</span> }
      ]
    },
    {
      id: "companions",
      question: "Who are you traveling with?",
      options: [
        { text: "Solo Adventure", value: "solo", icon: <span>🚶</span> },
        { text: "Romantic Partner", value: "couple", icon: <span>💕</span> },
        { text: "Family & Kids", value: "family", icon: <span>👨‍👩‍👧‍👦</span> },
        { text: "Friends Group", value: "friends", icon: <span>👥</span> }
      ]
    }
  ];

  const handleAnswer = (value: string) => {
    const newAnswers = { ...answers, [questions[currentQuestion].id]: value };
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      generateRecommendations(newAnswers);
    }
  };

  const generateRecommendations = (userAnswers: Record<string, string>) => {
    // AI-powered recommendation logic based on user preferences
    const recommendationMatrix: Record<string, TravelRecommendation[]> = {
      adventure: [
        {
          destination: "Patagonia, Chile",
          reason: "Epic hiking trails and pristine wilderness",
          type: "adventure",
          continent: "south-america",
          matchPercentage: 95,
          highlights: ["Torres del Paine", "Glacier trekking", "Wildlife photography"]
        },
        {
          destination: "Nepal Himalayas",
          reason: "World-class mountaineering and cultural richness",
          type: "adventure",
          continent: "asia",
          matchPercentage: 92,
          highlights: ["Everest Base Camp", "Sherpa culture", "Mountain temples"]
        }
      ],
      relaxation: [
        {
          destination: "Maldives",
          reason: "Pristine beaches and luxury resorts",
          type: "relaxation",
          continent: "asia",
          matchPercentage: 96,
          highlights: ["Overwater bungalows", "Spa treatments", "Crystal clear waters"]
        },
        {
          destination: "Tuscany, Italy",
          reason: "Rolling hills and wine country serenity",
          type: "relaxation",
          continent: "europe",
          matchPercentage: 88,
          highlights: ["Wine tastings", "Countryside villas", "Thermal springs"]
        }
      ],
      culture: [
        {
          destination: "Kyoto, Japan",
          reason: "Ancient temples and traditional culture",
          type: "culture",
          continent: "asia",
          matchPercentage: 94,
          highlights: ["Temple complexes", "Tea ceremonies", "Geisha districts"]
        },
        {
          destination: "Marrakech, Morocco",
          reason: "Vibrant souks and Islamic architecture",
          type: "culture",
          continent: "africa",
          matchPercentage: 90,
          highlights: ["Medina exploration", "Tagine cooking", "Desert excursions"]
        }
      ],
      urban: [
        {
          destination: "Tokyo, Japan",
          reason: "Cutting-edge technology meets tradition",
          type: "urban",
          continent: "asia",
          matchPercentage: 93,
          highlights: ["Shibuya crossing", "Street food", "Modern architecture"]
        },
        {
          destination: "New York City, USA",
          reason: "The ultimate urban playground",
          type: "urban",
          continent: "north-america",
          matchPercentage: 91,
          highlights: ["Broadway shows", "Museums", "Central Park"]
        }
      ]
    };

    const baseRecommendations = recommendationMatrix[userAnswers.travelStyle] || [];
    
    // Adjust recommendations based on other factors
    const adjustedRecommendations = baseRecommendations.map(rec => {
      let adjustedMatch = rec.matchPercentage;
      
      // Budget adjustments
      if (userAnswers.budget === 'luxury' && rec.destination.includes('Maldives')) {
        adjustedMatch += 5;
      }
      if (userAnswers.budget === 'budget' && rec.destination.includes('Nepal')) {
        adjustedMatch += 3;
      }
      
      // Duration adjustments
      if (userAnswers.duration === 'extended' && rec.type === 'adventure') {
        adjustedMatch += 4;
      }
      
      return { ...rec, matchPercentage: Math.min(100, adjustedMatch) };
    });

    setRecommendations(adjustedRecommendations.sort((a, b) => b.matchPercentage - a.matchPercentage));
    setShowResults(true);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setRecommendations([]);
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (showResults) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Your Personalized Travel Recommendations
            </h2>
            <p className="text-lg text-gray-600">
              Based on your preferences, here are perfect destinations for you
            </p>
          </div>

          <div className="grid gap-6 mb-8">
            {recommendations.map((rec, index) => (
              <Card key={index} className="relative overflow-hidden">
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {rec.matchPercentage}% Match
                  </Badge>
                </div>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    {rec.destination}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{rec.reason}</p>
                  <div className="flex flex-wrap gap-2">
                    {rec.highlights.map((highlight, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {highlight}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button onClick={resetQuiz} variant="outline" className="mr-4">
              Retake Quiz
            </Button>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              Explore These Destinations
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Discover Your Perfect Destination
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Take our AI-powered quiz to get personalized travel recommendations
          </p>
          <Progress value={progress} className="w-full h-2" />
          <p className="text-sm text-gray-500 mt-2">
            Question {currentQuestion + 1} of {questions.length}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-center">
              {questions[currentQuestion].question}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {questions[currentQuestion].options.map((option, index) => (
                <Button
                  key={index}
                  variant="outline"
                  onClick={() => handleAnswer(option.value)}
                  className="flex items-center gap-3 h-auto p-4 text-left justify-start hover:bg-blue-50 hover:border-blue-300"
                >
                  {option.icon}
                  <span>{option.text}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}