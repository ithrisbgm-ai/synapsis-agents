import { useNavigate } from "react-router-dom";
import { Search, ArrowRight, Sparkles, Zap, Users, Star } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AgentCard from "@/components/AgentCard";
import { getFeaturedAgents, getTopRatedAgents, getRecommendedAgents } from "@/lib/agents-data";
import { CATEGORY_LABELS, CATEGORY_ICONS, AgentCategory } from "@/lib/types";
import StarRating from "@/components/StarRating";

const CATEGORIES: AgentCategory[] = ["study", "coding", "writing", "marketing", "productivity", "creative"];

const STATS = [
  { label: "AI Agents", value: "50+", icon: Zap },
  { label: "Active Users", value: "12K+", icon: Users },
  { label: "Avg. Rating", value: "4.7", icon: Star },
];

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
      <section className="relative overflow-hidden px-8 py-24">
        {/* Background glows */}
        <div className="hero-glow w-[500px] h-[500px] top-[-100px] left-[10%] bg-primary/15" />
        <div className="hero-glow w-[400px] h-[400px] top-[50px] right-[5%] bg-accent/10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,hsl(var(--primary)/0.12),transparent)]" />

        <div className="relative mx-auto max-w-3xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/80 px-4 py-1.5 text-sm text-muted-foreground backdrop-blur-sm">
            <Sparkles size={13} className="text-primary" />
            <span>Discover the best AI agents</span>
          </div>

          <h1 className="text-5xl font-extrabold leading-[1.15] tracking-tight sm:text-6xl">
            Discover & Deploy{" "}
            <span className="gradient-text">AI Agents</span>{" "}
            in One Platform
          </h1>

          <p className="mt-5 text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            The central hub to discover, compare, and run AI agents — like an App Store for AI.
          </p>

          <form onSubmit={handleSearch} className="mt-8 flex items-center gap-3 mx-auto max-w-xl">
            <div className="relative flex-1">
              <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search AI agents... (e.g. prepare for math exam)"
                className="h-12 pl-11 rounded-full bg-secondary border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                maxLength={200}
              />
            </div>
            <Button type="submit" className="h-12 px-7 rounded-full gradient-bg border-0 text-white hover:opacity-90 font-semibold">
              Search
            </Button>
          </form>

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <span className="text-sm text-muted-foreground">Try:</span>
              {recommendations.map((agent) => (
                <button
                  key={agent.id}
                  onClick={() => navigate(`/agents/${agent.id}`)}
                  className="rounded-full bg-secondary/80 border border-border px-3 py-1 text-sm text-foreground hover:bg-muted hover:border-primary/30 transition-all"
                >
                  {agent.icon} {agent.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Stats Row */}
        <div className="relative mx-auto mt-14 max-w-lg grid grid-cols-3 gap-4">
          {STATS.map(({ label, value, icon: Icon }) => (
            <div key={label} className="flex flex-col items-center gap-1 rounded-2xl border border-border bg-card/60 backdrop-blur-sm px-4 py-4">
              <Icon size={16} className="text-primary mb-1" />
              <span className="text-xl font-bold gradient-text">{value}</span>
              <span className="text-xs text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Browse Categories</h2>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => navigate(`/marketplace?category=${cat}`)}
              className="group flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-5 transition-all duration-200 hover:border-primary/40 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10 glow-card gradient-border"
            >
              <span className="text-3xl transition-transform duration-200 group-hover:scale-110">{CATEGORY_ICONS[cat]}</span>
              <span className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors">{CATEGORY_LABELS[cat]}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Featured Agents */}
      <section className="px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Featured Agents</h2>
          <Button variant="ghost" onClick={() => navigate("/marketplace")} className="rounded-full text-muted-foreground hover:text-foreground gap-1.5">
            View all <ArrowRight size={15} />
          </Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      </section>

      {/* Top Rated */}
      <section className="px-8 py-10">
        <h2 className="text-2xl font-bold mb-6">Top Rated Agents</h2>
        <div className="space-y-2">
          {topRated.map((agent, i) => (
            <div
              key={agent.id}
              onClick={() => navigate(`/agents/${agent.id}`)}
              className="group flex items-center gap-4 rounded-2xl border border-border bg-card px-5 py-4 cursor-pointer transition-all duration-200 hover:border-primary/30 hover:bg-secondary/50 hover:-translate-x-0.5"
            >
              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${i < 3 ? "gradient-bg text-white" : "bg-secondary text-foreground"}`}>
                {i < 3 ? ["1","2","3"][i] : `${i+1}`}
              </span>
              <span className="text-2xl">{agent.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground truncate group-hover:text-white transition-colors">{agent.name}</p>
                <p className="text-sm text-muted-foreground truncate">{agent.description}</p>
              </div>
              <StarRating rating={agent.rating} count={agent.rating_count} />
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-8 py-16 pb-20">
        <div className="mx-auto max-w-2xl rounded-3xl gradient-bg p-[1px]">
          <div className="rounded-3xl bg-background/90 backdrop-blur-sm px-10 py-12 text-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full gradient-bg-subtle border border-primary/20 px-4 py-1 text-sm text-primary font-medium">
              <Sparkles size={13} />
              Ready to get started?
            </div>
            <h2 className="text-3xl font-bold mt-3">Explore the AI Agent Marketplace</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Browse our collection of AI agents and find the perfect one for your needs.
            </p>
            <Button
              size="lg"
              className="mt-7 rounded-full gradient-bg border-0 text-white hover:opacity-90 px-8 font-semibold shadow-lg shadow-primary/25"
              onClick={() => navigate("/marketplace")}
            >
              Explore AI Agents <ArrowRight size={17} className="ml-2" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
