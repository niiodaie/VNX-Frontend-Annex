import React from 'react';
import AfricanCuisineGallery from '@/components/AfricanCuisineGallery';
import { Camera, Upload, Users } from 'lucide-react';

const CuisineGalleryPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-3">African Cuisine Community Gallery</h1>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Share and discover authentic African dishes from across the continent. 
            This community-driven gallery lets you upload your own photos and videos of your favorite 
            African meals, whether homemade or from restaurants.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-orange-50 rounded-lg p-6 shadow-sm text-center">
            <div className="inline-flex items-center justify-center bg-orange-100 rounded-full w-16 h-16 mb-4">
              <Upload className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Share Your Dishes</h3>
            <p className="text-gray-700">
              Upload photos and videos of your homemade African dishes or meals from your favorite 
              African restaurants.
            </p>
          </div>
          
          <div className="bg-orange-50 rounded-lg p-6 shadow-sm text-center">
            <div className="inline-flex items-center justify-center bg-orange-100 rounded-full w-16 h-16 mb-4">
              <Camera className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Showcase Variety</h3>
            <p className="text-gray-700">
              From West African jollof rice to Ethiopian injera, showcase 
              the rich diversity of African cuisines.
            </p>
          </div>
          
          <div className="bg-orange-50 rounded-lg p-6 shadow-sm text-center">
            <div className="inline-flex items-center justify-center bg-orange-100 rounded-full w-16 h-16 mb-4">
              <Users className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Build Community</h3>
            <p className="text-gray-700">
              Connect with other African cuisine enthusiasts, share recipes, cooking tips, 
              and restaurant recommendations.
            </p>
          </div>
        </div>
        
        {/* Render the community gallery component */}
        <AfricanCuisineGallery />
        
        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <h2 className="text-2xl font-bold mb-4">About African Cuisine</h2>
          <p className="mb-4">
            African cuisine is incredibly diverse, with each region offering its own distinct flavors, 
            ingredients, and cooking techniques. From the spicy jollof rice of West Africa to the injera 
            bread of Ethiopia, the continent's food culture is rich and varied.
          </p>
          <p className="mb-4">
            Common ingredients across African cuisines include various starches like cassava, yams, 
            plantains, and different types of millet; proteins such as goat, beef, fish, and chicken; 
            and flavorful spices and herbs that create the distinctive taste profiles of each region.
          </p>
          <p>
            By sharing photos and videos of different African dishes, we hope to promote and celebrate 
            these culinary traditions, fostering greater appreciation and understanding of Africa's rich 
            food culture.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CuisineGalleryPage;