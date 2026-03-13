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
  { icon: Zap, label: "AI Agents", value: "50+", color: "text-primary" },
  { icon: Users, label: "Active Users", value: "10K+", color: "text-violet-400" },
  { icon: Star, label: "Avg Rating", value: "4.8★", color: "text-amber-400" },
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
        {/* Background gradient layers */}
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full gradient-bg opacity-[0.06] blur-3xl pointer-events-none" />
        <div className="absolute top-10 left-1/4 w-[200px] h-[200px] rounded-full bg-violet-500/10 blur-3xl pointer-events-none animate-float" />
        <div className="absolute top-20 right-1/4 w-[150px] h-[150px] rounded-full bg-blue-500/10 blur-3xl pointer-events-none animate-float [animation-delay:1.5s]" />

        <div className="relative mx-auto max-w-3xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary animate-fade-in">
            <Sparkles size={13} />
            <span className="font-medium">Discover the best AI agents</span>
          </div>

          <h1 className="text-5xl font-extrabold leading-[1.15] tracking-tight animate-slide-up">
            Discover and Use{" "}
            <span className="gradient-text">AI Agents</span>{" "}
            in One Platform
          </h1>

          <p className="mt-5 text-lg text-muted-foreground leading-relaxed animate-slide-up stagger-2">
            The central hub to discover, compare, and run AI agents —{" "}
            <span className="text-foreground/70">like an App Store for AI.</span>
          </p>

          <form onSubmit={handleSearch} className="mt-8 flex items-center gap-3 mx-auto max-w-xl animate-slide-up stagger-3">
            <div className="relative flex-1">
              <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search AI agents... (e.g. prepare for math exam)"
                className="h-12 pl-11 rounded-xl bg-secondary/80 border-border text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                maxLength={200}
              />
            </div>
            <Button
              type="submit"
              className="h-12 px-6 rounded-xl gradient-bg border-0 text-primary-foreground glow-btn font-medium"
            >
              Search
            </Button>
          </form>

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <div className="mt-4 flex flex-wrap justify-center gap-2 animate-fade-in stagger-4">
              <span className="text-sm text-muted-foreground">Recommended:</span>
              {recommendations.map((agent) => (
                <button
                  key={agent.id}
                  onClick={() => navigate(`/agents/${agent.id}`)}
                  className="rounded-full bg-secondary/80 border border-border/50 px-3 py-1 text-sm text-foreground hover:bg-primary/10 hover:border-primary/30 transition-all duration-200"
                >
                  {agent.icon} {agent.name}
                </button>
              ))}
            </div>
          )}

          {/* Stats */}
          <div className="mt-10 flex items-center justify-center gap-8 animate-fade-in stagger-5">
            {STATS.map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-1.5">
                  <Icon size={14} className={color} />
                  <span className={`text-xl font-bold ${color}`}>{value}</span>
                </div>
                <span className="text-xs text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Browse <span className="gradient-text">Categories</span></h2>
            <p className="mt-1 text-sm text-muted-foreground">Find agents by use case</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {CATEGORIES.map((cat, i) => (
            <button
              key={cat}
              onClick={() => navigate(`/marketplace?category=${cat}`)}
              className={`group flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:border-primary/40 hover:bg-secondary/50 hover:-translate-y-1 glow-card gradient-border animate-fade-in stagger-${Math.min(i + 1, 6)}`}
            >
              <span className="text-3xl group-hover:scale-110 transition-transform duration-200">
                {CATEGORY_ICONS[cat]}
              </span>
              <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                {CATEGORY_LABELS[cat]}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Featured Agents */}
      <section className="px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Featured <span className="gradient-text">Agents</span></h2>
            <p className="mt-1 text-sm text-muted-foreground">Hand-picked top performers</p>
          </div>
          <Button
            variant="ghost"
            onClick={() => navigate("/marketplace")}
            className="text-muted-foreground hover:text-foreground rounded-lg"
          >
            View all <ArrowRight size={15} className="ml-1.5" />
          </Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      </section>

      {/* Top Rated */}
      <section className="px-8 py-12">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Top <span className="gradient-text">Rated</span></h2>
          <p className="mt-1 text-sm text-muted-foreground">Highest rated by the community</p>
        </div>
        <div className="space-y-2.5">
          {topRated.map((agent, i) => (
            <div
              key={agent.id}
              onClick={() => navigate(`/agents/${agent.id}`)}
              className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 cursor-pointer transition-all duration-200 hover:border-primary/30 hover:bg-secondary/50 hover:-translate-y-0.5 animate-fade-in"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-sm font-bold text-foreground/80 group-hover:bg-primary/10 group-hover:text-primary transition-all duration-200">
                #{i + 1}
              </span>
              <span className="text-2xl">{agent.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                  {agent.name}
                </p>
                <p className="text-sm text-muted-foreground truncate">{agent.description}</p>
              </div>
              <StarRating rating={agent.rating} count={agent.rating_count} />
              <ArrowRight size={14} className="text-muted-foreground/40 group-hover:text-primary/60 group-hover:translate-x-0.5 transition-all duration-200 shrink-0" />
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-8 py-16">
        <div className="relative mx-auto max-w-2xl rounded-2xl overflow-hidden">
          <div className="absolute inset-0 gradient-bg" />
          <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 70% 30%, rgba(255,255,255,0.15) 0%, transparent 60%)" }} />
          <div className="relative px-10 py-12 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm text-white/80">
              <Sparkles size={13} />
              <span>Ready to get started?</span>
            </div>
            <h2 className="text-3xl font-bold text-white">Explore the AI Agent Marketplace</h2>
            <p className="mt-3 text-white/75 leading-relaxed">
              Browse hundreds of AI agents and find the perfect one for your needs.
            </p>
            <Button
              size="lg"
              className="mt-7 rounded-xl bg-white text-gray-900 font-semibold hover:bg-white/90 shadow-lg shadow-black/20 transition-all duration-200 hover:-translate-y-0.5"
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
