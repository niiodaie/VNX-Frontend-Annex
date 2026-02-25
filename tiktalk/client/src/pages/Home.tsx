import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { type Product } from "@shared/schema";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import VisualSearchBar from "@/components/VisualSearchBar";
import CategoryFilters from "@/components/CategoryFilters";
import ProductFilters from "@/components/ProductFilters";
import ProductCard from "@/components/ProductCard";
import Newsletter from "@/components/Newsletter";
import { Button } from "@/components/ui/button";

interface ProductFilters {
  category: string;
  brands: string[];
  priceRange: { min: number; max: number } | null;
  rating: number | null;
  search: string;
}

export default function Home() {
  const [filters, setFilters] = useState<ProductFilters>({
    category: 'all',
    brands: [],
    priceRange: null,
    rating: null,
    search: '',
  });
  const [currentPage, setCurrentPage] = useState(0);
  const [sortBy, setSortBy] = useState('relevant');

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ['/api/products', filters, currentPage, sortBy],
    queryFn: async () => {
      const params = new URLSearchParams();
      
      if (filters.category !== 'all') {
        params.set('category', filters.category);
      }
      
      if (filters.brands.length > 0) {
        filters.brands.forEach(brand => params.append('brand', brand));
      }
      
      if (filters.priceRange) {
        params.set('minPrice', filters.priceRange.min.toString());
        params.set('maxPrice', filters.priceRange.max.toString());
      }
      
      if (filters.rating) {
        params.set('rating', filters.rating.toString());
      }
      
      if (filters.search) {
        params.set('search', filters.search);
      }
      
      params.set('limit', '20');
      params.set('offset', (currentPage * 20).toString());

      const response = await fetch(`/api/products?${params}`);
      if (!response.ok) throw new Error('Failed to fetch products');
      return response.json();
    },
  });

  const handleFilterChange = (newFilters: Partial<ProductFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(0);
  };

  const handleLoadMore = () => {
    setCurrentPage(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative gradient-primary text-white py-20 overflow-hidden min-h-[500px]">
        {/* Multiple Background Images for Studio Effect */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-15"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')"
          }}
        ></div>
        
        <div 
          className="absolute right-0 top-0 w-1/2 h-full bg-cover bg-left opacity-10"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600')"
          }}
        ></div>
        
        <div 
          className="absolute left-0 bottom-0 w-1/3 h-2/3 bg-cover bg-right opacity-12"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1590602847861-f357a9332bbc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600')"
          }}
        ></div>
        
        {/* Enhanced Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/70 via-purple-600/60 to-blue-700/70"></div>
        
        {/* Floating Elements for Visual Interest */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/5 rounded-full blur-sm animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-16 h-16 bg-white/3 rounded-full blur-sm animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 right-1/4 w-12 h-12 bg-white/4 rounded-full blur-sm animate-pulse delay-500"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col justify-center min-h-[500px]">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 drop-shadow-2xl leading-tight">
            Shop What Your 
            <span className="text-yellow-300"> Favorite Podcasters</span> Use
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-indigo-100 drop-shadow-lg max-w-3xl mx-auto leading-relaxed">
            Discover the exact gear behind your favorite shows. From Joe Rogan's legendary mic to Marc Maron's studio headphones.
          </p>
          <div className="transform hover:scale-105 transition-transform duration-300">
            <VisualSearchBar onSearch={(query) => handleFilterChange({ search: query })} />
          </div>
        </div>
      </section>

      {/* Category Filters */}
      <CategoryFilters 
        selectedCategory={filters.category}
        onCategoryChange={(category) => handleFilterChange({ category })}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="lg:flex lg:gap-8">
          {/* Sidebar Filters */}
          <ProductFilters 
            filters={filters}
            onFiltersChange={handleFilterChange}
          />

          {/* Product Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <div>
                <span className="text-gray-600">
                  {products.length} products found
                </span>
              </div>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="relevant">Most Relevant</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest</option>
                <option value="rating">Best Rating</option>
              </select>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-sm p-4 animate-pulse">
                    <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-4"></div>
                    <div className="flex justify-between">
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                      <div className="h-4 bg-gray-200 rounded w-12"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {products.length === 20 && (
                  <div className="text-center mt-12">
                    <Button 
                      onClick={handleLoadMore}
                      className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-indigo-600 transition-colors font-medium"
                    >
                      Load More Products
                    </Button>
                  </div>
                )}
              </>
            )}

            {products.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
                <Button 
                  onClick={() => setFilters({
                    category: 'all',
                    brands: [],
                    priceRange: null,
                    rating: null,
                    search: '',
                  })}
                  className="mt-4"
                  variant="outline"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Newsletter />
      <Footer />
    </div>
  );
}
