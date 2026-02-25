import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useLocation } from "@/hooks/useLocation";

interface SearchFilterProps {
  onSearch: (filters: {
    query: string;
    continent: string;
    type: string;
  }) => void;
}

export default function SearchFilter({ onSearch }: SearchFilterProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContinent, setSelectedContinent] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [nearbySearch, setNearbySearch] = useState(false);
  const { t } = useTranslation();
  const { location } = useLocation();

  // Auto-suggest based on user location
  useEffect(() => {
    if (location?.country && !selectedContinent) {
      const country = location.country.toLowerCase();
      if (country.includes('spain') || country.includes('france') || country.includes('italy')) {
        setSelectedContinent('europe');
      } else if (country.includes('japan') || country.includes('china') || country.includes('thailand')) {
        setSelectedContinent('asia');
      } else if (country.includes('usa') || country.includes('canada') || country.includes('mexico')) {
        setSelectedContinent('north-america');
      }
    }
  }, [location, selectedContinent]);

  const handleSearch = () => {
    onSearch({
      query: searchQuery,
      continent: selectedContinent,
      type: selectedType,
    });
  };

  return (
    <section className="bg-white shadow-lg -mt-12 relative z-20 mx-4 sm:mx-6 lg:mx-8 rounded-2xl p-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="destination-search" className="text-sm font-medium text-gray-700">
              {t('whereTo')}
            </Label>
            <Input
              id="destination-search"
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-gray-300 focus:ring-vnx-blue-500 focus:border-vnx-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              {t('continent')}
            </Label>
            <Select value={selectedContinent} onValueChange={setSelectedContinent}>
              <SelectTrigger className="border-gray-300 focus:ring-vnx-blue-500 focus:border-vnx-blue-500">
                <SelectValue placeholder={t('allContinents')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('allContinents')}</SelectItem>
                <SelectItem value="asia">{t('asia')}</SelectItem>
                <SelectItem value="europe">{t('europe')}</SelectItem>
                <SelectItem value="africa">{t('africa')}</SelectItem>
                <SelectItem value="north-america">{t('northAmerica')}</SelectItem>
                <SelectItem value="south-america">{t('southAmerica')}</SelectItem>
                <SelectItem value="oceania">{t('oceania')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              {t('experienceType')}
            </Label>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="border-gray-300 focus:ring-vnx-blue-500 focus:border-vnx-blue-500">
                <SelectValue placeholder={t('allTypes')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('allTypes')}</SelectItem>
                <SelectItem value="nature">{t('nature')}</SelectItem>
                <SelectItem value="heritage">{t('heritage')}</SelectItem>
                <SelectItem value="culture">{t('culture')}</SelectItem>
                <SelectItem value="adventure">{t('adventure')}</SelectItem>
                <SelectItem value="food">{t('food')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex flex-col gap-2">
            {location && (
              <Button
                variant="outline"
                onClick={() => {
                  setNearbySearch(!nearbySearch);
                  if (!nearbySearch) {
                    setSearchQuery(location.city || '');
                  }
                }}
                className="w-full border-vnx-blue-200 text-vnx-blue-600 hover:bg-vnx-blue-50"
              >
                <MapPin className="w-4 h-4 mr-2" />
                {nearbySearch ? 'Show all destinations' : 'Find nearby'}
              </Button>
            )}
            <Button 
              onClick={handleSearch}
              className="w-full bg-vnx-blue-600 hover:bg-vnx-blue-700 text-white font-semibold"
            >
              <Search className="w-4 h-4 mr-2" />
              {t('search')}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
