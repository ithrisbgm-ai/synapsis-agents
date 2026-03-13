import { useNavigate } from "react-router-dom";
import { Search, ArrowRight, Sparkles } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AgentCard from "@/components/AgentCard";
import { getFeaturedAgents, getTopRatedAgents, getRecommendedAgents } from "@/lib/agents-data";
import { CATEGORY_LABELS, CATEGORY_ICONS, AgentCategory } from "@/lib/types";
import StarRating from "@/components/StarRating";

const CATEGORIES: AgentCategory[] = ["study", "coding", "writing", "marketing", "productivity", "creative"];

const HomePage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const featured = getFeaturedAgents();
  const topRated = getTopRatedAgents(5);
  const recommendations = getRecommendedAgents(searchQuery);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/marketplace?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-8 py-20">
        <div className="absolute inset-0 gradient-bg opacity-[0.03]" />
        <div className="relative mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5 text-sm text-muted-foreground">
            <Sparkles size={14} className="text-primary" />
            Discover the best AI agents
          </div>
          <h1 className="text-5xl font-extrabold leading-tight tracking-tight">
            Discover and Use{" "}
            <span className="gradient-text">AI Agents</span>{" "}
            in One Platform
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            The central hub to discover, compare, and run AI agents — like an App Store for AI.
          </p>

          <form onSubmit={handleSearch} className="mt-8 flex items-center gap-3 mx-auto max-w-xl">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search AI agents... (e.g. prepare for math exam)"
                className="h-12 pl-11 bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                maxLength={200}
              />
            </div>
            <Button type="submit" className="h-12 px-6 gradient-bg border-0 text-primary-foreground hover:opacity-90">
              Search
            </Button>
          </form>

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <span className="text-sm text-muted-foreground">Recommended:</span>
              {recommendations.map((agent) => (
                <button
                  key={agent.id}
                  onClick={() => navigate(`/agents/${agent.id}`)}
                  className="rounded-full bg-secondary px-3 py-1 text-sm text-foreground hover:bg-muted transition-colors"
                >
                  {agent.icon} {agent.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="px-8 py-12">
        <h2 className="text-2xl font-bold">Categories</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => navigate(`/marketplace?category=${cat}`)}
              className="group flex flex-col items-center gap-3 rounded-lg border border-border bg-card p-5 transition-all hover:border-primary/50 glow-card gradient-border"
            >
              <span className="text-3xl">{CATEGORY_ICONS[cat]}</span>
              <span className="text-sm font-medium text-foreground">{CATEGORY_LABELS[cat]}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Featured Agents */}
      <section className="px-8 py-12">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Featured Agents</h2>
          <Button variant="ghost" onClick={() => navigate("/marketplace")} className="text-muted-foreground hover:text-foreground">
            View all <ArrowRight size={16} className="ml-1" />
          </Button>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      </section>

      {/* Top Rated */}
      <section className="px-8 py-12">
        <h2 className="text-2xl font-bold">Top Rated Agents</h2>
        <div className="mt-6 space-y-3">
          {topRated.map((agent, i) => (
            <div
              key={agent.id}
              onClick={() => navigate(`/agents/${agent.id}`)}
              className="flex items-center gap-4 rounded-lg border border-border bg-card p-4 cursor-pointer transition-colors hover:bg-secondary"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-sm font-bold text-foreground">
                #{i + 1}
              </span>
              <span className="text-2xl">{agent.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground truncate">{agent.name}</p>
                <p className="text-sm text-muted-foreground truncate">{agent.description}</p>
              </div>
              <StarRating rating={agent.rating} count={agent.rating_count} />
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-8 py-16">
        <div className="mx-auto max-w-2xl rounded-xl gradient-bg p-10 text-center">
          <h2 className="text-3xl font-bold text-primary-foreground">Ready to explore?</h2>
          <p className="mt-3 text-primary-foreground/80">
            Browse our marketplace of AI agents and find the perfect one for your needs.
          </p>
          <Button
            size="lg"
            className="mt-6 bg-background text-foreground hover:bg-background/90"
            onClick={() => navigate("/marketplace")}
          >
            Explore AI Agents <ArrowRight size={18} className="ml-2" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
