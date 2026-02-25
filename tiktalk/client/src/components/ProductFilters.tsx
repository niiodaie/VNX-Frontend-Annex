import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";

interface ProductFiltersProps {
  filters: {
    category: string;
    brands: string[];
    priceRange: { min: number; max: number } | null;
    rating: number | null;
    search: string;
  };
  onFiltersChange: (filters: any) => void;
}

const priceRanges = [
  { id: 'under-50', label: 'Under $50', min: 0, max: 50 },
  { id: '50-200', label: '$50 - $200', min: 50, max: 200 },
  { id: 'over-200', label: '$200+', min: 200, max: 10000 },
];

const brands = ['Audio-Technica', 'Shure', 'Blue Yeti', 'Rode', 'Focusrite', 'Sennheiser'];

export default function ProductFilters({ filters, onFiltersChange }: ProductFiltersProps) {
  const handleBrandChange = (brand: string, checked: boolean) => {
    const newBrands = checked
      ? [...filters.brands, brand]
      : filters.brands.filter(b => b !== brand);
    onFiltersChange({ brands: newBrands });
  };

  const handlePriceRangeChange = (range: { min: number; max: number }, checked: boolean) => {
    onFiltersChange({ 
      priceRange: checked ? range : null 
    });
  };

  const handleRatingChange = (rating: number, checked: boolean) => {
    onFiltersChange({ 
      rating: checked ? rating : null 
    });
  };

  return (
    <aside className="lg:w-64 mb-8 lg:mb-0">
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Filters</h3>
          
          <div className="space-y-6">
            {/* Price Range */}
            <div>
              <h4 className="font-medium text-gray-700 mb-3">Price Range</h4>
              <div className="space-y-2">
                {priceRanges.map((range) => (
                  <div key={range.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={range.id}
                      checked={filters.priceRange?.min === range.min && filters.priceRange?.max === range.max}
                      onCheckedChange={(checked) => 
                        handlePriceRangeChange({ min: range.min, max: range.max }, checked as boolean)
                      }
                    />
                    <Label htmlFor={range.id} className="text-sm text-gray-600">
                      {range.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Brand */}
            <div>
              <h4 className="font-medium text-gray-700 mb-3">Brand</h4>
              <div className="space-y-2">
                {brands.map((brand) => (
                  <div key={brand} className="flex items-center space-x-2">
                    <Checkbox
                      id={brand}
                      checked={filters.brands.includes(brand)}
                      onCheckedChange={(checked) => 
                        handleBrandChange(brand, checked as boolean)
                      }
                    />
                    <Label htmlFor={brand} className="text-sm text-gray-600">
                      {brand}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Rating */}
            <div>
              <h4 className="font-medium text-gray-700 mb-3">Rating</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="5-stars"
                    checked={filters.rating === 5}
                    onCheckedChange={(checked) => 
                      handleRatingChange(5, checked as boolean)
                    }
                  />
                  <Label htmlFor="5-stars" className="text-sm text-gray-600 flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                    ))}
                    <span className="ml-1">5 Stars</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="4-stars"
                    checked={filters.rating === 4}
                    onCheckedChange={(checked) => 
                      handleRatingChange(4, checked as boolean)
                    }
                  />
                  <Label htmlFor="4-stars" className="text-sm text-gray-600">
                    4+ Stars
                  </Label>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </aside>
  );
}
