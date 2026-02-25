"use client";

import { useState } from "react";
import type { Metadata } from "next";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { 
  Globe, 
  Shield, 
  Info, 
  Route,
  MapPin,
  Layers,
  Loader2,
  Search,
  Activity
} from "lucide-react";

interface ScanResult {
  type: string;
  data: any;
  timestamp: string;
}

const scanTools = [
  {
    id: 'ip-lookup',
    name: 'IP Lookup',
    description: 'Basic IP information',
    icon: Globe,
    color: 'bg-blue-500 hover:bg-blue-600',
    iconColor: 'text-blue-600'
  },
  {
    id: 'geo-info',
    name: 'Geo Info',
    description: 'Location & ISP details',
    icon: MapPin,
    color: 'bg-emerald-500 hover:bg-emerald-600',
    iconColor: 'text-emerald-600'
  },
  {
    id: 'port-scan',
    name: 'Port Scan',
    description: 'Check open ports',
    icon: Shield,
    color: 'bg-orange-500 hover:bg-orange-600',
    iconColor: 'text-orange-600',
    comingSoon: true
  },
  {
    id: 'whois',
    name: 'WHOIS',
    description: 'Domain registration info',
    icon: Info,
    color: 'bg-purple-500 hover:bg-purple-600',
    iconColor: 'text-purple-600',
    comingSoon: true
  },
  {
    id: 'traceroute',
    name: 'Traceroute',
    description: 'Network path analysis',
    icon: Route,
    color: 'bg-red-500 hover:bg-red-600',
    iconColor: 'text-red-600',
    comingSoon: true
  },
  {
    id: 'bulk',
    name: 'Bulk Scan',
    description: 'All tools at once',
    icon: Layers,
    color: 'bg-indigo-500 hover:bg-indigo-600',
    iconColor: 'text-indigo-600'
  }
];

export default function NetscanPage() {
  const [target, setTarget] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [currentScan, setCurrentScan] = useState<string | null>(null);
  const [results, setResults] = useState<ScanResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const performScan = async (scanType: string) => {
    if (!target.trim()) {
      setError("Please enter an IP address or domain");
      return;
    }

    setIsScanning(true);
    setCurrentScan(scanType);
    setError(null);

    try {
      let result: any = null;

      if (scanType === 'ip-lookup' || scanType === 'geo-info') {
        const response = await fetch(`https://ipapi.co/${target}/json/`);
        if (!response.ok) {
          throw new Error(`Lookup failed: ${response.statusText}`);
        }
        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.reason || 'Invalid IP address or domain');
        }
        
        result = data;
      } else if (scanType === 'bulk') {
        const response = await fetch(`https://ipapi.co/${target}/json/`);
        if (!response.ok) {
          throw new Error(`Bulk scan failed: ${response.statusText}`);
        }
        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.reason || 'Invalid IP address or domain');
        }
        
        result = {
          ipLookup: data,
          geoInfo: data,
          note: "Port scan, WHOIS, and Traceroute require server-side implementation"
        };
      } else {
        throw new Error(`${scanType} requires server-side implementation. Coming soon!`);
      }

      const newResult: ScanResult = {
        type: scanType,
        data: result,
        timestamp: new Date().toISOString()
      };

      setResults(prev => [newResult, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Scan failed');
    } finally {
      setIsScanning(false);
      setCurrentScan(null);
    }
  };

  const detectMyIP = async () => {
    setIsScanning(true);
    setError(null);

    try {
      const response = await fetch('https://ipapi.co/json/');
      if (!response.ok) {
        throw new Error('Failed to detect IP');
      }
      const data = await response.json();
      setTarget(data.ip);
    } catch (err) {
      setError('Failed to detect your IP address');
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-blue-600 to-cyan-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <Activity className="w-16 h-16 mx-auto mb-6 text-white" />
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              VNX Netscan
            </h1>
            <p className="text-xl text-white/90 mb-10">
              Comprehensive network diagnostic tool for IP lookup, geolocation, and security analysis
            </p>
          </div>
        </div>
      </section>

      {/* Scanner Section */}
      <section className="py-12 -mt-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {/* Input Section */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    placeholder="Enter IP address or domain (e.g., 8.8.8.8 or google.com)"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isScanning}
                  />
                </div>
                <button
                  onClick={detectMyIP}
                  disabled={isScanning}
                  className="px-6 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <MapPin className="w-5 h-5" />
                  Detect My IP
                </button>
              </div>
              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  {error}
                </div>
              )}
            </div>

            {/* Diagnostic Tools Grid */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                <Shield className="w-6 h-6 mr-2 text-blue-600" />
                Diagnostic Tools
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {scanTools.map((tool) => {
                  const Icon = tool.icon;
                  const isCurrentScan = currentScan === tool.id;
                  
                  return (
                    <div key={tool.id} className="group">
                      <div className="h-full transition-all hover:shadow-md rounded-xl border border-slate-200 p-4 hover:border-slate-300">
                        <div className="flex items-center mb-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                            isCurrentScan ? 'bg-blue-100' : 'bg-slate-50'
                          } group-hover:bg-slate-100 transition-colors`}>
                            {isCurrentScan ? (
                              <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                            ) : (
                              <Icon className={`w-5 h-5 ${tool.iconColor}`} />
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                              {tool.name}
                              {tool.comingSoon && (
                                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                                  Soon
                                </span>
                              )}
                            </h3>
                            <p className="text-sm text-slate-600">{tool.description}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => performScan(tool.id)}
                          disabled={isScanning || !target.trim() || tool.comingSoon}
                          className={`w-full py-2 rounded-lg text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${tool.color}`}
                        >
                          {tool.comingSoon ? 'Coming Soon' : 'Scan'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Results Section */}
            {results.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                  <Search className="w-6 h-6 mr-2 text-blue-600" />
                  Scan Results
                </h2>
                <div className="space-y-6">
                  {results.map((result, index) => (
                    <div key={index} className="border border-slate-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-slate-800 capitalize">
                          {result.type.replace('-', ' ')}
                        </h3>
                        <span className="text-sm text-slate-500">
                          {new Date(result.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-4 overflow-x-auto">
                        <pre className="text-sm text-slate-700">
                          {JSON.stringify(result.data, null, 2)}
                        </pre>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

