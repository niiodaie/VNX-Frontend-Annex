import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

type Country = {
  name: string;
  code: string;
  currency: {
    code: string;
    name: string;
    symbol: string;
  };
};

// List of African countries with their currency information
const africanCountries: Country[] = [
  { name: "Algeria", code: "DZ", currency: { code: "DZD", name: "Algerian Dinar", symbol: "دج" } },
  { name: "Angola", code: "AO", currency: { code: "AOA", name: "Angolan Kwanza", symbol: "Kz" } },
  { name: "Benin", code: "BJ", currency: { code: "XOF", name: "West African CFA Franc", symbol: "CFA" } },
  { name: "Botswana", code: "BW", currency: { code: "BWP", name: "Botswana Pula", symbol: "P" } },
  { name: "Burkina Faso", code: "BF", currency: { code: "XOF", name: "West African CFA Franc", symbol: "CFA" } },
  { name: "Burundi", code: "BI", currency: { code: "BIF", name: "Burundian Franc", symbol: "FBu" } },
  { name: "Cabo Verde", code: "CV", currency: { code: "CVE", name: "Cape Verdean Escudo", symbol: "Esc" } },
  { name: "Cameroon", code: "CM", currency: { code: "XAF", name: "Central African CFA Franc", symbol: "FCFA" } },
  { name: "Central African Republic", code: "CF", currency: { code: "XAF", name: "Central African CFA Franc", symbol: "FCFA" } },
  { name: "Chad", code: "TD", currency: { code: "XAF", name: "Central African CFA Franc", symbol: "FCFA" } },
  { name: "Comoros", code: "KM", currency: { code: "KMF", name: "Comorian Franc", symbol: "CF" } },
  { name: "Democratic Republic of the Congo", code: "CD", currency: { code: "CDF", name: "Congolese Franc", symbol: "FC" } },
  { name: "Republic of the Congo", code: "CG", currency: { code: "XAF", name: "Central African CFA Franc", symbol: "FCFA" } },
  { name: "Côte d'Ivoire", code: "CI", currency: { code: "XOF", name: "West African CFA Franc", symbol: "CFA" } },
  { name: "Djibouti", code: "DJ", currency: { code: "DJF", name: "Djiboutian Franc", symbol: "Fdj" } },
  { name: "Egypt", code: "EG", currency: { code: "EGP", name: "Egyptian Pound", symbol: "E£" } },
  { name: "Equatorial Guinea", code: "GQ", currency: { code: "XAF", name: "Central African CFA Franc", symbol: "FCFA" } },
  { name: "Eritrea", code: "ER", currency: { code: "ERN", name: "Eritrean Nakfa", symbol: "Nfk" } },
  { name: "Eswatini", code: "SZ", currency: { code: "SZL", name: "Swazi Lilangeni", symbol: "L" } },
  { name: "Ethiopia", code: "ET", currency: { code: "ETB", name: "Ethiopian Birr", symbol: "Br" } },
  { name: "Gabon", code: "GA", currency: { code: "XAF", name: "Central African CFA Franc", symbol: "FCFA" } },
  { name: "Gambia", code: "GM", currency: { code: "GMD", name: "Gambian Dalasi", symbol: "D" } },
  { name: "Ghana", code: "GH", currency: { code: "GHS", name: "Ghanaian Cedi", symbol: "₵" } },
  { name: "Guinea", code: "GN", currency: { code: "GNF", name: "Guinean Franc", symbol: "FG" } },
  { name: "Guinea-Bissau", code: "GW", currency: { code: "XOF", name: "West African CFA Franc", symbol: "CFA" } },
  { name: "Kenya", code: "KE", currency: { code: "KES", name: "Kenyan Shilling", symbol: "KSh" } },
  { name: "Lesotho", code: "LS", currency: { code: "LSL", name: "Lesotho Loti", symbol: "L" } },
  { name: "Liberia", code: "LR", currency: { code: "LRD", name: "Liberian Dollar", symbol: "L$" } },
  { name: "Libya", code: "LY", currency: { code: "LYD", name: "Libyan Dinar", symbol: "ل.د" } },
  { name: "Madagascar", code: "MG", currency: { code: "MGA", name: "Malagasy Ariary", symbol: "Ar" } },
  { name: "Malawi", code: "MW", currency: { code: "MWK", name: "Malawian Kwacha", symbol: "MK" } },
  { name: "Mali", code: "ML", currency: { code: "XOF", name: "West African CFA Franc", symbol: "CFA" } },
  { name: "Mauritania", code: "MR", currency: { code: "MRU", name: "Mauritanian Ouguiya", symbol: "UM" } },
  { name: "Mauritius", code: "MU", currency: { code: "MUR", name: "Mauritian Rupee", symbol: "₨" } },
  { name: "Morocco", code: "MA", currency: { code: "MAD", name: "Moroccan Dirham", symbol: "د.م." } },
  { name: "Mozambique", code: "MZ", currency: { code: "MZN", name: "Mozambican Metical", symbol: "MT" } },
  { name: "Namibia", code: "NA", currency: { code: "NAD", name: "Namibian Dollar", symbol: "N$" } },
  { name: "Niger", code: "NE", currency: { code: "XOF", name: "West African CFA Franc", symbol: "CFA" } },
  { name: "Nigeria", code: "NG", currency: { code: "NGN", name: "Nigerian Naira", symbol: "₦" } },
  { name: "Rwanda", code: "RW", currency: { code: "RWF", name: "Rwandan Franc", symbol: "FRw" } },
  { name: "São Tomé and Príncipe", code: "ST", currency: { code: "STN", name: "São Tomé and Príncipe Dobra", symbol: "Db" } },
  { name: "Senegal", code: "SN", currency: { code: "XOF", name: "West African CFA Franc", symbol: "CFA" } },
  { name: "Seychelles", code: "SC", currency: { code: "SCR", name: "Seychellois Rupee", symbol: "₨" } },
  { name: "Sierra Leone", code: "SL", currency: { code: "SLL", name: "Sierra Leonean Leone", symbol: "Le" } },
  { name: "Somalia", code: "SO", currency: { code: "SOS", name: "Somali Shilling", symbol: "Sh.So." } },
  { name: "South Africa", code: "ZA", currency: { code: "ZAR", name: "South African Rand", symbol: "R" } },
  { name: "South Sudan", code: "SS", currency: { code: "SSP", name: "South Sudanese Pound", symbol: "£" } },
  { name: "Sudan", code: "SD", currency: { code: "SDG", name: "Sudanese Pound", symbol: "ج.س." } },
  { name: "Tanzania", code: "TZ", currency: { code: "TZS", name: "Tanzanian Shilling", symbol: "TSh" } },
  { name: "Togo", code: "TG", currency: { code: "XOF", name: "West African CFA Franc", symbol: "CFA" } },
  { name: "Tunisia", code: "TN", currency: { code: "TND", name: "Tunisian Dinar", symbol: "د.ت" } },
  { name: "Uganda", code: "UG", currency: { code: "UGX", name: "Ugandan Shilling", symbol: "USh" } },
  { name: "Zambia", code: "ZM", currency: { code: "ZMW", name: "Zambian Kwacha", symbol: "ZK" } },
  { name: "Zimbabwe", code: "ZW", currency: { code: "ZWL", name: "Zimbabwean Dollar", symbol: "Z$" } },
  // Island nations
  { name: "Cape Verde", code: "CV", currency: { code: "CVE", name: "Cape Verdean Escudo", symbol: "Esc" } },
  { name: "Comoros", code: "KM", currency: { code: "KMF", name: "Comorian Franc", symbol: "CF" } },
  { name: "Madagascar", code: "MG", currency: { code: "MGA", name: "Malagasy Ariary", symbol: "Ar" } },
  { name: "Mauritius", code: "MU", currency: { code: "MUR", name: "Mauritian Rupee", symbol: "₨" } },
  { name: "Seychelles", code: "SC", currency: { code: "SCR", name: "Seychellois Rupee", symbol: "₨" } },
  { name: "São Tomé and Príncipe", code: "ST", currency: { code: "STN", name: "São Tomé and Príncipe Dobra", symbol: "Db" } },
];

export default function LocationCurrencySelector() {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const { toast } = useToast();

  // Detect user's location and find the closest African country
  const detectLocation = () => {
    setIsLocating(true);
    setGpsError(null);

    if (!navigator.geolocation) {
      setGpsError("Geolocation is not supported by your browser");
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          // In a real implementation, you would use the coordinates to determine the closest country
          // Here we're just demonstrating the concept
          const { latitude, longitude } = position.coords;
          toast({
            title: "Location detected",
            description: `Coordinates: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
          });

          // Simulate determining a country from coordinates
          // In a real implementation, you'd use a geolocation API service
          setTimeout(() => {
            // For demo, just pick Nigeria
            const detectedCountry = africanCountries.find(country => country.code === "NG");
            if (detectedCountry) {
              setSelectedCountry(detectedCountry);
              toast({
                title: "Location set",
                description: `You're in ${detectedCountry.name}`,
              });
            }
            setIsLocating(false);
          }, 1000);
        } catch (error) {
          setGpsError("Error detecting location. Please select manually.");
          setIsLocating(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        setGpsError(
          error.code === 1
            ? "Location access denied. Please enable location services."
            : "Error detecting location. Please select manually."
        );
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  };

  const handleCountryChange = (countryCode: string) => {
    const country = africanCountries.find((c) => c.code === countryCode);
    if (country) {
      setSelectedCountry(country);
    }
  };

  // Filter out duplicate entries that might exist in our list
  const uniqueCountries = africanCountries.filter(
    (country, index, self) => index === self.findIndex((c) => c.code === country.code)
  );

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
        <Select value={selectedCountry?.code} onValueChange={handleCountryChange}>
          <SelectTrigger className="w-full sm:w-[220px]">
            <SelectValue placeholder="Select a country" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {uniqueCountries.map((country) => (
                <SelectItem key={country.code} value={country.code}>
                  {country.name} ({country.currency.code})
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          className="flex items-center justify-center"
          onClick={detectLocation}
          disabled={isLocating}
        >
          <MapPin className="mr-2 h-4 w-4" />
          {isLocating ? "Detecting..." : "Detect Location"}
        </Button>
      </div>

      {gpsError && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Location Error</AlertTitle>
          <AlertDescription>{gpsError}</AlertDescription>
        </Alert>
      )}

      {selectedCountry && (
        <div className="px-3 py-2 bg-muted rounded-md text-sm">
          <p>
            <span className="font-medium">Location:</span> {selectedCountry.name}
          </p>
          <p>
            <span className="font-medium">Currency:</span> {selectedCountry.currency.name} ({selectedCountry.currency.symbol} {selectedCountry.currency.code})
          </p>
        </div>
      )}
    </div>
  );
}