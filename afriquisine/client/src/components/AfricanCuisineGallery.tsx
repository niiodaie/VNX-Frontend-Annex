import React, { useState, useEffect } from 'react';
import { Upload, Camera, FileVideo, X, Heart, MessageSquare, Share2, Info } from 'lucide-react';

interface AfricanCuisineGalleryProps {
  dishName?: string;
  region?: string;
}

const AfricanCuisineGallery: React.FC<AfricanCuisineGalleryProps> = ({ 
  dishName, 
  region
}) => {
  const [userUploads, setUserUploads] = useState<UserUpload[]>([
    {
      id: '1',
      user: 'Sarah K.',
      location: 'Lagos, Nigeria',
      dishName: 'Jollof Rice with Plantains',
      description: 'Made this for my family dinner. Authentic Nigerian style with lots of spices! Served with sweet fried plantains.',
      imageUrl: '/images/jollof_rice.png',
      likes: 24,
      comments: 5,
      timestamp: '2 hours ago'
    },
    {
      id: '2',
      user: 'Mohamed A.',
      location: 'Marrakech, Morocco',
      dishName: 'Lamb Tagine with Couscous',
      description: 'Weekend special - slow cooked for 5 hours with dried fruits, almonds and authentic Moroccan spices. Served over fluffy couscous.',
      imageUrl: '/images/lamb_tagine.png',
      likes: 42,
      comments: 8,
      timestamp: '5 hours ago'
    },
    {
      id: '3',
      user: 'Amara T.',
      location: 'Addis Ababa, Ethiopia',
      dishName: 'Injera with Doro Wat',
      description: 'Family recipe passed down for generations. The secret is in the berbere spice blend! Spicy chicken stew with hard-boiled eggs, full of complex spices and flavors.',
      imageUrl: '/images/doro_wat.png',
      likes: 36,
      comments: 12,
      timestamp: '1 day ago'
    }
  ]);
  
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [newUpload, setNewUpload] = useState<{
    dishName: string;
    location: string;
    description: string;
    file: File | null;
    previewUrl: string | null;
  }>({
    dishName: '',
    location: '',
    description: '',
    file: null,
    previewUrl: null
  });

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewUpload({
        ...newUpload,
        file,
        previewUrl: URL.createObjectURL(file)
      });
    }
  };

  // Handle upload submit
  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUpload.dishName || !newUpload.file) return;

    const newUserUpload: UserUpload = {
      id: Date.now().toString(),
      user: 'You', // In a real app, this would be the current user's name
      location: newUpload.location || 'Unknown Location',
      dishName: newUpload.dishName,
      description: newUpload.description,
      imageUrl: newUpload.previewUrl || '',
      likes: 0,
      comments: 0,
      timestamp: 'Just now'
    };

    setUserUploads([newUserUpload, ...userUploads]);
    setUploadModalOpen(false);
    setNewUpload({
      dishName: '',
      location: '',
      description: '',
      file: null,
      previewUrl: null
    });
  };

  // Handle like button click
  const handleLike = (id: string) => {
    setUserUploads(userUploads.map(upload => 
      upload.id === id ? { ...upload, likes: upload.likes + 1 } : upload
    ));
  };

  return (
    <div className="bg-gray-50 p-4 md:p-6 rounded-lg max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">African Cuisine Gallery</h2>
        <button 
          onClick={() => setUploadModalOpen(true)}
          className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 flex items-center gap-2"
        >
          <Upload size={18} />
          <span className="hidden sm:inline">Share Your Dish</span>
        </button>
      </div>

      <div className="mb-8 bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
        <h3 className="text-lg font-semibold text-orange-800 flex items-center gap-2">
          <Info size={20} />
          Community Gallery
        </h3>
        <p className="text-orange-700 mt-1">
          Share photos and videos of your favorite African dishes! Whether it's homemade or from a restaurant, 
          show us your culinary experiences and inspire others.
        </p>
      </div>

      {/* User uploads feed */}
      <div className="space-y-6">
        {userUploads.map(upload => (
          <div key={upload.id} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold">
                  {upload.user.charAt(0)}
                </div>
                <div>
                  <h3 className="font-medium">{upload.user}</h3>
                  <p className="text-xs text-gray-500">{upload.location}</p>
                </div>
                <div className="ml-auto text-xs text-gray-400">{upload.timestamp}</div>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src={upload.imageUrl} 
                alt={upload.dishName}
                className="w-full h-auto max-h-[500px] object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <h4 className="text-xl font-bold text-white">{upload.dishName}</h4>
              </div>
            </div>
            
            <div className="p-4">
              <p className="text-gray-700 mb-4">{upload.description}</p>
              
              <div className="flex gap-6 border-t pt-4">
                <button 
                  className="flex items-center gap-1 text-gray-500 hover:text-orange-500" 
                  onClick={() => handleLike(upload.id)}
                >
                  <Heart size={18} className={upload.likes > 0 ? "fill-orange-500 text-orange-500" : ""} />
                  <span>{upload.likes}</span>
                </button>
                <button className="flex items-center gap-1 text-gray-500 hover:text-orange-500">
                  <MessageSquare size={18} />
                  <span>{upload.comments}</span>
                </button>
                <button className="flex items-center gap-1 text-gray-500 hover:text-orange-500 ml-auto">
                  <Share2 size={18} />
                  <span className="hidden sm:inline">Share</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upload modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full shadow-xl overflow-hidden">
            <div className="flex justify-between items-center border-b p-4">
              <h3 className="text-lg font-bold">Share Your African Dish</h3>
              <button 
                onClick={() => setUploadModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleUploadSubmit} className="p-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dish Name*
                </label>
                <input 
                  type="text"
                  value={newUpload.dishName}
                  onChange={(e) => setNewUpload({...newUpload, dishName: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="e.g., Jollof Rice, Tagine, Injera..."
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input 
                  type="text"
                  value={newUpload.location}
                  onChange={(e) => setNewUpload({...newUpload, location: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="e.g., Lagos, Morocco, Home Kitchen..."
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea 
                  value={newUpload.description}
                  onChange={(e) => setNewUpload({...newUpload, description: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent h-20"
                  placeholder="Tell us about this dish..."
                ></textarea>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload Photo or Video*
                </label>
                {!newUpload.previewUrl ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input 
                      type="file"
                      id="file-upload"
                      className="hidden"
                      accept="image/*,video/*"
                      onChange={handleFileSelect}
                    />
                    <label 
                      htmlFor="file-upload"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <div className="flex gap-2 mb-2">
                        <Camera size={24} className="text-gray-400" />
                        <FileVideo size={24} className="text-gray-400" />
                      </div>
                      <span className="text-gray-500">Click to upload image or video</span>
                      <span className="text-sm text-gray-400 mt-1">Maximum file size: 10MB</span>
                    </label>
                  </div>
                ) : (
                  <div className="relative">
                    <img 
                      src={newUpload.previewUrl}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setNewUpload({...newUpload, file: null, previewUrl: null})}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newUpload.dishName || !newUpload.file}
                  className="flex-1 py-2 px-4 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Share
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {userUploads.length === 0 && (
        <div className="bg-yellow-50 text-amber-800 p-6 rounded-lg text-center">
          <p className="font-medium">No dishes have been shared yet.</p>
          <p className="text-sm mt-2">Be the first to share your favorite African dish!</p>
          <button 
            onClick={() => setUploadModalOpen(true)}
            className="mt-4 bg-amber-500 text-white px-4 py-2 rounded-md hover:bg-amber-600"
          >
            Share a Dish
          </button>
        </div>
      )}
    </div>
  );
};

// Type definition for user uploads
interface UserUpload {
  id: string;
  user: string;
  location: string;
  dishName: string;
  description: string;
  imageUrl: string;
  likes: number;
  comments: number;
  timestamp: string;
}

export default AfricanCuisineGallery;