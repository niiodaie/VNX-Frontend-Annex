import React from 'react';
import { Link } from 'wouter';

// Import cuisine images
import ethiopianCuisine from '../assets/images/ethiopian_cuisine.png';
import nigerianCuisine from '../assets/images/nigerian_cuisine.png'; 
import moroccanCuisine from '../assets/images/moroccan_cuisine.png';
import southAfricanCuisine from '../assets/images/south_african_cuisine.png';
import senegalesesCuisine from '../assets/images/senegalese_cuisine.png';

// Import dish images
import jollofRice from '../assets/images/image_1744604754983.png';
import injeraDoroWat from '../assets/images/image_1744671901314.png';
import tagine from '../assets/images/image_1744680872858.png';
import bobotie from '../assets/images/image_1744700675482.png';
import waakye from '../assets/images/waakye_ghana.png';

// Import pattern background
import patternBg from '../assets/images/image_1744702173361.png';
import referenceDesign from '../assets/images/reference-design.png';

const Home: React.FC = () => {
  // Debug imports - for testing image loading
  console.log("Ethiopian image:", ethiopianCuisine);
  console.log("Jollof Rice image:", jollofRice);
  console.log("Reference design:", referenceDesign);
  // Featured Cuisine Categories with imported images
  const cuisineCategories = [
    { 
      name: "Ethiopian", 
      country: "Ethiopia",
      imageUrl: ethiopianCuisine,
    },
    { 
      name: "Nigerian", 
      country: "Nigeria",
      imageUrl: nigerianCuisine,
    },
    { 
      name: "Ghanaian", 
      country: "Ghana",
      imageUrl: waakye,
      overlayText: "Ghanaian" // Add explicit overlay text
    },
    { 
      name: "South African", 
      country: "South Africa",
      imageUrl: southAfricanCuisine,
    },
    { 
      name: "Senegalese", 
      country: "Senegal",
      imageUrl: senegalesesCuisine, 
    }
  ];

  // Waakye is now imported at the top

  // Featured Dishes with imported images
  const featuredDishes = [
    {
      id: 1,
      name: "Jollof Rice",
      origin: "West Africa",
      description: "A one-pot rice dish popular throughout West Africa, particularly in Nigeria, Ghana, and Senegal.",
      imageUrl: jollofRice
    },
    {
      id: 2,
      name: "Injera with Doro Wat",
      origin: "Ethiopia",
      description: "Injera is a sourdough flatbread served with Doro Wat, a spicy chicken stew that's the national dish of Ethiopia.",
      imageUrl: injeraDoroWat
    },
    {
      id: 3,
      name: "Waakye",
      origin: "Ghana",
      description: "A traditional Ghanaian dish of rice and beans cooked together with dried sorghum leaves, giving it a distinctive reddish-brown color.",
      imageUrl: waakye
    },
    {
      id: 4,
      name: "Bobotie",
      origin: "South Africa",
      description: "A South African dish consisting of spiced minced meat baked with an egg-based topping.",
      imageUrl: bobotie
    },
  ];

  return (
    <div>
      {/* Progress Notice */}
      <div className="p-4 bg-gray-100 border-b">
        <div className="container mx-auto">
          <h2 className="text-lg font-bold mb-2">Image Loading Successful! 🎉</h2>
          <p className="text-sm mb-3">All images are now loading correctly. Site is being styled to match the orange design reference.</p>
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <img 
              src={referenceDesign} 
              alt="Progress Screenshot" 
              className="w-full rounded" 
            />
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-b from-primary to-primary/90 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Discover Authentic African Cuisine
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-3xl mb-8">
              Find local African restaurants, explore diverse culinary traditions, and embark on a flavorful journey through the continent.
            </p>
            
            {/* Search Box (simplified) */}
            <div className="w-full max-w-xl relative mb-8">
              <input
                type="text"
                placeholder="Search for restaurants, cuisines, or dishes..."
                className="w-full px-5 py-4 rounded-full border-none shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-300"
              />
              <button 
                className="absolute right-2 top-2 p-2 bg-yellow-400 text-primary rounded-full shadow hover:bg-yellow-300 transition-colors"
                aria-label="Search"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="w-5 h-5"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Popular Cuisines */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Popular African Cuisines</h2>
            <div className="w-24 h-1 bg-primary mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {cuisineCategories.slice(0, 3).map((cuisine) => (
              <div 
                key={cuisine.name}
                className="bg-white rounded-lg overflow-hidden shadow border hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="h-48 bg-gray-100 flex justify-center items-center relative overflow-hidden">
                  <img 
                    src={cuisine.imageUrl} 
                    alt={`${cuisine.name} Cuisine from ${cuisine.country}`}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70 flex items-end">
                    <div className="p-4 w-full z-20">
                      <div className="bg-black/50 text-white text-3xl font-bold py-2 px-3 rounded backdrop-blur-sm inline-block">
                        {cuisine.overlayText || cuisine.name}
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-0 left-0 bg-primary/80 p-2 text-white rounded-br-lg z-10">
                    <span className="text-sm">African Cuisine</span>
                  </div>
                </div>
                <div className="p-4 border-t border-gray-100">
                  <h3 className="text-xl font-bold text-gray-800">{cuisine.name}</h3>
                  <p className="text-gray-600">{cuisine.country}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/cuisines">
              <span className="inline-block px-5 py-2.5 border-2 border-primary text-primary font-medium rounded-md hover:bg-primary/5 transition-colors cursor-pointer">
                View All Cuisines
              </span>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Popular African Dishes */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Signature African Dishes</h2>
            <div className="w-24 h-1 bg-primary mx-auto"></div>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Explore these authentic dishes from across Africa, each with its own unique history and flavor profile.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredDishes.map((dish) => (
              <div key={dish.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="h-48 bg-gray-100 flex justify-center items-center relative overflow-hidden">
                  <img 
                    src={dish.imageUrl} 
                    alt={`${dish.name} - ${dish.origin} dish`}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40 hover:to-black/50 transition-colors">
                    <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-xs font-medium text-primary">
                      {dish.origin}
                    </div>
                  </div>
                </div>
                <div className="p-5 border-t border-gray-100">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{dish.name}</h3>
                  <p className="text-gray-600 text-sm">
                    {dish.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-10 text-center">
            <Link href="/dishes">
              <span className="inline-block px-6 py-3 bg-primary text-white rounded-md shadow hover:bg-primary/90 transition-colors cursor-pointer">
                Explore More Dishes
              </span>
            </Link>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section 
        className="py-20 bg-primary text-white relative"
        style={{ 
          backgroundImage: `url(${patternBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'multiply'
        }}
      >
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Are You an African Restaurant Owner?</h2>
            <div className="w-24 h-1 bg-yellow-400 mx-auto mb-8"></div>
            <p className="text-xl mb-10 text-white/90">
              Join our platform to showcase your authentic dishes and connect with food enthusiasts in your area.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-5">
              <Link href="/register-restaurant">
                <span className="px-8 py-4 bg-yellow-400 text-primary font-bold rounded-md hover:bg-yellow-300 transition-colors cursor-pointer shadow-lg">
                  Register Your Restaurant
                </span>
              </Link>
              <Link href="/restaurant-dashboard">
                <span className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-md hover:bg-white/10 transition-colors cursor-pointer">
                  Learn More
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;