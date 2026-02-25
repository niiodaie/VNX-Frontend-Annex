import { BrowserRouter, Routes, Route } from "react-router-dom";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import Tools from "@/pages/tools";
import Platforms from "@/pages/platforms";
import Directories from "@/pages/directories";
import Resources from "@/pages/resources";
import Community from "@/pages/community";
import Marketplace from "@/pages/marketplace";
import Insights from "@/pages/insights";
import Experiences from "@/pages/experiences";
import Trends from "@/pages/trends";
import Ventures from "@/pages/ventures";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tools" element={<Tools />} />
        <Route path="/platforms" element={<Platforms />} />
        <Route path="/directories" element={<Directories />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/community" element={<Community />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/experiences" element={<Experiences />} />
        <Route path="/trends" element={<Trends />} />
        <Route path="/ventures" element={<Ventures />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
