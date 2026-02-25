import { useState } from "react";
import { 
  Card,
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { 
  Input 
} from "@/components/ui/input";
import { 
  Button 
} from "@/components/ui/button";
import {
  ArrowLeftRight,
  Calculator
} from "lucide-react";

type Currency = {
  code: string;
  name: string;
  symbol: string;
};

const africanCurrencies: Currency[] = [
  { code: "NGN", name: "Nigerian Naira", symbol: "₦" },
  { code: "ZAR", name: "South African Rand", symbol: "R" },
  { code: "KES", name: "Kenyan Shilling", symbol: "KSh" },
  { code: "GHS", name: "Ghanaian Cedi", symbol: "₵" },
  { code: "EGP", name: "Egyptian Pound", symbol: "E£" },
  { code: "MAD", name: "Moroccan Dirham", symbol: "DH" },
  { code: "TZS", name: "Tanzanian Shilling", symbol: "TSh" },
  { code: "UGX", name: "Ugandan Shilling", symbol: "USh" },
  { code: "XOF", name: "West African CFA Franc", symbol: "CFA" },
  { code: "XAF", name: "Central African CFA Franc", symbol: "FCFA" },
  { code: "MUR", name: "Mauritian Rupee", symbol: "Rs" },
  { code: "ETB", name: "Ethiopian Birr", symbol: "Br" },
  { code: "RWF", name: "Rwandan Franc", symbol: "RF" },
  { code: "ZMW", name: "Zambian Kwacha", symbol: "ZK" },
  { code: "BWP", name: "Botswanan Pula", symbol: "P" },
  { code: "NAD", name: "Namibian Dollar", symbol: "N$" },
  { code: "MZN", name: "Mozambican Metical", symbol: "MT" },
  { code: "DZD", name: "Algerian Dinar", symbol: "DA" },
];

export default function CurrencyConverter() {
  const [fromCurrency, setFromCurrency] = useState<string>("NGN");
  const [toCurrency, setToCurrency] = useState<string>("GHS");
  const [amount, setAmount] = useState<string>("1000");
  const [result, setResult] = useState<string>("");
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);

  // In a real application, you would fetch real rates from an API
  // For this prototype, we'll use static rates relative to USD
  const mockExchangeRates: Record<string, number> = {
    "NGN": 0.0022,  // 1 NGN = 0.0022 USD
    "ZAR": 0.055,   // 1 ZAR = 0.055 USD
    "KES": 0.0079,  // 1 KES = 0.0079 USD
    "GHS": 0.088,   // 1 GHS = 0.088 USD
    "EGP": 0.064,   // 1 EGP = 0.064 USD
    "MAD": 0.10,    // 1 MAD = 0.10 USD
    "TZS": 0.00040, // 1 TZS = 0.00040 USD
    "UGX": 0.00027, // 1 UGX = 0.00027 USD
    "XOF": 0.0017,  // 1 XOF = 0.0017 USD
    "XAF": 0.0017,  // 1 XAF = 0.0017 USD
    "MUR": 0.022,   // 1 MUR = 0.022 USD
    "ETB": 0.018,   // 1 ETB = 0.018 USD
    "RWF": 0.00085, // 1 RWF = 0.00085 USD
    "ZMW": 0.037,   // 1 ZMW = 0.037 USD
    "BWP": 0.073,   // 1 BWP = 0.073 USD
    "NAD": 0.055,   // 1 NAD = 0.055 USD
    "MZN": 0.016,   // 1 MZN = 0.016 USD
    "DZD": 0.0074,  // 1 DZD = 0.0074 USD
  };

  const handleConvert = () => {
    if (!fromCurrency || !toCurrency || !amount) return;

    // Get rates for both currencies (relative to USD)
    const fromRate = mockExchangeRates[fromCurrency];
    const toRate = mockExchangeRates[toCurrency];

    if (!fromRate || !toRate) return;

    // Calculate cross rate
    const rate = toRate / fromRate;
    setExchangeRate(rate);

    // Calculate result
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum)) return;

    const convertedAmount = amountNum * rate;
    
    // Get the currency symbols
    const fromCurrencyObj = africanCurrencies.find(c => c.code === fromCurrency);
    const toCurrencyObj = africanCurrencies.find(c => c.code === toCurrency);
    
    setResult(
      `${fromCurrencyObj?.symbol || ''}${amountNum.toLocaleString()} ${fromCurrency} = ${toCurrencyObj?.symbol || ''}${convertedAmount.toLocaleString(undefined, { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
      })} ${toCurrency}`
    );
  };

  const handleSwapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
    setResult("");
    setExchangeRate(null);
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center">
          <Calculator className="mr-2 h-5 w-5" />
          Currency Converter
        </CardTitle>
        <CardDescription>
          Convert between African currencies
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid grid-cols-4 gap-3 items-end">
            <div className="col-span-2">
              <label className="text-sm font-medium mb-1 block">Amount</label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setResult("");
                  setExchangeRate(null);
                }}
                placeholder="Enter amount"
              />
            </div>
            <div className="col-span-2">
              <label className="text-sm font-medium mb-1 block">From</label>
              <Select
                value={fromCurrency}
                onValueChange={(value) => {
                  setFromCurrency(value);
                  setResult("");
                  setExchangeRate(null);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>African Currencies</SelectLabel>
                    {africanCurrencies.map((currency) => (
                      <SelectItem key={currency.code} value={currency.code}>
                        {currency.code} - {currency.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-center my-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleSwapCurrencies}
              className="rounded-full"
            >
              <ArrowLeftRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-4 gap-3 items-end">
            <div className="col-span-2">
              <label className="text-sm font-medium mb-1 block">To</label>
              <Select
                value={toCurrency}
                onValueChange={(value) => {
                  setToCurrency(value);
                  setResult("");
                  setExchangeRate(null);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>African Currencies</SelectLabel>
                    {africanCurrencies.map((currency) => (
                      <SelectItem key={currency.code} value={currency.code}>
                        {currency.code} - {currency.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2">
              <Button 
                className="w-full bg-primary text-white" 
                onClick={handleConvert}
              >
                Convert
              </Button>
            </div>
          </div>

          {result && (
            <div className="mt-4 p-3 bg-light rounded-lg">
              <div className="text-xl font-medium text-center">{result}</div>
              {exchangeRate && (
                <div className="text-sm text-gray-medium text-center mt-1">
                  1 {fromCurrency} = {exchangeRate.toFixed(4)} {toCurrency}
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}