import { Button } from "@/components/ui/button";
import { Mic, Home, Headphones, Shirt } from "lucide-react";

interface CategoryFiltersProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories = [
  { id: 'all', name: 'All Products', icon: null },
  { id: 'equipment', name: 'Equipment', icon: Mic },
  { id: 'studio', name: 'Studio Setup', icon: Home },
  { id: 'accessories', name: 'Accessories', icon: Headphones },
  { id: 'merchandise', name: 'Merchandise', icon: Shirt },
];

export default function CategoryFilters({ selectedCategory, onCategoryChange }: CategoryFiltersProps) {
  return (
    <section className="bg-white py-8 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center gap-4">
          {categories.map((category) => {
            const Icon = category.icon;
            const isSelected = selectedCategory === category.id;
            
            return (
              <Button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                variant={isSelected ? "default" : "secondary"}
                className={`px-6 py-2 rounded-full font-medium transition-colors ${
                  isSelected 
                    ? "bg-primary text-white hover:bg-primary/90" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {Icon && <Icon className="w-4 h-4 mr-2" />}
                {category.name}
              </Button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
