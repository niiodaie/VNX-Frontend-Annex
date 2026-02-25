import { Link } from "wouter";
import { type Product } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/product/${product.id}`}>
      <Card className="product-card-hover cursor-pointer group">
        <div className="aspect-square overflow-hidden rounded-t-lg bg-gray-100">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover image-hover-scale"
          />
        </div>
        <CardContent className="p-4">
          <h3 className="font-medium text-gray-900 mb-1 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          {product.podcastShow && (
            <p className="text-xs text-primary font-medium mb-1">
              Used by: {product.podcastShow}
            </p>
          )}
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
            {product.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="font-bold text-lg text-primary">
              ${product.price}
            </span>
            <div className="flex items-center text-sm text-gray-500">
              <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
              <span>{product.rating} ({product.reviewCount})</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
