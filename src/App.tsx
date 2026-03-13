import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppLayout from "./components/AppLayout";
import HomePage from "./pages/HomePage";
import MarketplacePage from "./pages/MarketplacePage";
import AgentDetailPage from "./pages/AgentDetailPage";
import MultiAgentPage from "./pages/MultiAgentPage";
import DeveloperPage from "./pages/DeveloperPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/marketplace" element={<MarketplacePage />} />
            <Route path="/agents/:id" element={<AgentDetailPage />} />
            <Route path="/multi-agent" element={<MultiAgentPage />} />
            <Route path="/developer" element={<DeveloperPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
