import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { type Product } from "@shared/schema";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Heart, ShoppingCart } from "lucide-react";

export default function ProductDetail() {
  const [match, params] = useRoute("/product/:id");
  const productId = params?.id ? parseInt(params.id) : null;

  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: ['/api/products', productId],
    queryFn: async () => {
      if (!productId) throw new Error('No product ID');
      const response = await fetch(`/api/products/${productId}`);
      if (!response.ok) throw new Error('Product not found');
      return response.json();
    },
    enabled: !!productId,
  });

  if (!match || !productId) {
    return <div>Invalid product URL</div>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="space-y-6">
              <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded w-24 animate-pulse"></div>
              <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="text-center py-12">
            <CardContent>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
              <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
              <Button onClick={() => window.history.back()}>Go Back</Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  const categoryNames = {
    equipment: 'Equipment',
    studio: 'Studio Setup',
    accessories: 'Accessories',
    merchandise: 'Merchandise',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="aspect-square overflow-hidden rounded-lg bg-white shadow-sm">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <Badge variant="secondary" className="mb-2">
                {categoryNames[product.category as keyof typeof categoryNames] || product.category}
              </Badge>
              {product.podcastShow && (
                <Badge variant="outline" className="mb-2 ml-2 border-primary text-primary">
                  Used by: {product.podcastShow}
                </Badge>
              )}
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(parseFloat(product.rating || "0"))
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600">
                  {product.rating} ({product.reviewCount} reviews)
                </span>
              </div>
              <p className="text-gray-600 text-lg">{product.description}</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl font-bold text-primary">${product.price}</span>
                <Badge variant={product.inStock ? "default" : "destructive"}>
                  {product.inStock ? "In Stock" : "Out of Stock"}
                </Badge>
              </div>
              
              {product.brand && (
                <div className="mb-4">
                  <span className="text-sm text-gray-600">Brand: </span>
                  <span className="font-medium">{product.brand}</span>
                </div>
              )}

              <div className="flex space-x-4">
                {product.amazonUrl ? (
                  <Button
                    size="lg"
                    className="flex-1 bg-orange-500 hover:bg-orange-600"
                    disabled={!product.inStock}
                    onClick={() => window.open(product.amazonUrl!, '_blank')}
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Buy on Amazon
                  </Button>
                ) : (
                  <Button
                    size="lg"
                    className="flex-1"
                    disabled={!product.inStock}
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Add to Cart
                  </Button>
                )}
                <Button variant="outline" size="lg">
                  <Heart className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Product Features */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg mb-4">Product Features</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• High-quality construction and materials</li>
                  <li>• Perfect for professional podcast recording</li>
                  <li>• Easy to set up and use</li>
                  <li>• Compatible with most recording software</li>
                  <li>• Backed by manufacturer warranty</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Related Products Section */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Products</h2>
          <div className="text-center py-8 text-gray-500">
            Related products would be displayed here based on category and visual similarity.
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
