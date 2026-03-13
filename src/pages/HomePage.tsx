import { useNavigate } from "react-router-dom";
import { Search, ArrowRight, Sparkles, Zap, Users, Star, TrendingUp } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AgentCard from "@/components/AgentCard";
import { getFeaturedAgents, getTopRatedAgents, getRecommendedAgents } from "@/lib/agents-data";
import { CATEGORY_LABELS, CATEGORY_ICONS, AgentCategory } from "@/lib/types";
import StarRating from "@/components/StarRating";

const CATEGORIES: AgentCategory[] = ["study", "coding", "writing", "marketing", "productivity", "creative"];

const STATS = [
  { icon: Zap, label: "AI Agents", value: "50+" },
  { icon: Users, label: "Active Users", value: "10K+" },
  { icon: Star, label: "Avg Rating", value: "4.8" },
  { icon: TrendingUp, label: "Tasks Run", value: "1M+" },
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
      <section className="relative overflow-hidden px-8 pt-16 pb-20">
        {/* Background blobs */}
        <div className="hero-glow w-96 h-96 opacity-20" style={{ background: "hsl(var(--gradient-start))", top: "-4rem", right: "10%", position: "absolute" }} />
        <div className="hero-glow w-80 h-80 opacity-15" style={{ background: "hsl(var(--gradient-mid))", bottom: "0", left: "5%", position: "absolute" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/0 to-background pointer-events-none" />

        <div className="relative mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            <Sparkles size={13} className="text-primary" />
            Discover the best AI agents
          </div>

          {/* Headline */}
          <h1 className="text-5xl font-extrabold leading-[1.15] tracking-tight sm:text-6xl">
            Discover and Use{" "}
            <span className="gradient-text">AI Agents</span>{" "}
            in One Platform
          </h1>
          <p className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            The central hub to discover, compare, and run AI agents — like an App Store for AI.
            Find the perfect agent for any task.
          </p>

          {/* Search */}
          <form onSubmit={handleSearch} className="mt-9 flex items-center gap-2.5 mx-auto max-w-xl">
            <div className="relative flex-1">
              <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search AI agents... (e.g. prepare for math exam)"
                className="h-12 pl-11 bg-card border-border text-foreground placeholder:text-muted-foreground rounded-xl focus-visible:ring-primary/50 focus-visible:border-primary/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                maxLength={200}
              />
            </div>
            <Button
              type="submit"
              className="h-12 px-7 gradient-bg border-0 text-white hover:opacity-90 rounded-xl font-semibold shadow-lg shadow-primary/20 transition-all hover:shadow-primary/30 hover:scale-[1.02]"
            >
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
                  className="rounded-full bg-secondary/80 border border-border px-3.5 py-1 text-sm text-foreground hover:bg-secondary hover:border-primary/30 transition-all"
                >
                  {agent.icon} {agent.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Stats Row */}
        <div className="relative mt-14 mx-auto max-w-2xl grid grid-cols-2 gap-3 sm:grid-cols-4">
          {STATS.map(({ icon: Icon, label, value }) => (
            <div key={label} className="stat-card text-center">
              <div className="flex justify-center mb-2">
                <Icon size={18} className="text-primary opacity-80" />
              </div>
              <p className="text-xl font-bold gradient-text">{value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Section divider */}
      <div className="section-divider mx-8" />

      {/* Categories */}
      <section className="px-8 py-12">
        <div className="flex items-baseline gap-3 mb-6">
          <h2 className="text-2xl font-bold">Browse by Category</h2>
          <span className="text-sm text-muted-foreground">Choose a category to explore</span>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => navigate(`/marketplace?category=${cat}`)}
              className="group flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-5 transition-all duration-250 hover:border-primary/40 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10 glow-card gradient-border"
            >
              <span className="text-3xl transition-transform duration-200 group-hover:scale-110">{CATEGORY_ICONS[cat]}</span>
              <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">{CATEGORY_LABELS[cat]}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Section divider */}
      <div className="section-divider mx-8" />

      {/* Featured Agents */}
      <section className="px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Featured Agents</h2>
            <p className="text-sm text-muted-foreground mt-0.5">Hand-picked by our team</p>
          </div>
          <Button
            variant="ghost"
            onClick={() => navigate("/marketplace")}
            className="text-muted-foreground hover:text-foreground gap-1.5 rounded-xl"
          >
            View all <ArrowRight size={15} />
          </Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      </section>

      {/* Section divider */}
      <div className="section-divider mx-8" />

      {/* Top Rated */}
      <section className="px-8 py-12">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Top Rated Agents</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Ranked by community ratings</p>
        </div>
        <div className="space-y-2.5">
          {topRated.map((agent, i) => (
            <div
              key={agent.id}
              onClick={() => navigate(`/agents/${agent.id}`)}
              className="group flex items-center gap-4 rounded-xl border border-border bg-card px-5 py-4 cursor-pointer transition-all duration-200 hover:border-primary/30 hover:bg-secondary/50 hover:-translate-y-0.5"
            >
              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${i < 3 ? "gradient-bg text-white" : "bg-secondary text-muted-foreground"}`}>
                {i < 3 ? ["1", "2", "3"][i] : `${i + 1}`}
              </span>
              <span className="text-2xl">{agent.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">{agent.name}</p>
                <p className="text-sm text-muted-foreground truncate">{agent.description}</p>
              </div>
              <StarRating rating={agent.rating} count={agent.rating_count} />
            </div>
          ))}
        </div>
      </section>

      {/* Section divider */}
      <div className="section-divider mx-8" />

      {/* CTA */}
      <section className="px-8 py-16">
        <div className="mx-auto max-w-2xl rounded-2xl gradient-bg p-px shadow-2xl shadow-primary/20">
          <div className="rounded-2xl gradient-bg p-10 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/80 mb-4">
              <Sparkles size={11} />
              Get started for free
            </div>
            <h2 className="text-3xl font-extrabold text-white">Ready to explore?</h2>
            <p className="mt-3 text-white/70 max-w-md mx-auto">
              Browse our marketplace of AI agents and find the perfect one for your needs.
            </p>
            <Button
              size="lg"
              className="mt-7 bg-white text-gray-900 hover:bg-white/90 font-bold rounded-xl shadow-lg transition-all hover:scale-[1.02]"
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
