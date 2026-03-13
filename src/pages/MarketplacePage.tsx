import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AgentCard from "@/components/AgentCard";
import { searchAgents } from "@/lib/agents-data";
import { CATEGORY_LABELS, AgentCategory } from "@/lib/types";

const ALL_CATEGORIES: (AgentCategory | "all")[] = ["all", "study", "coding", "writing", "marketing", "productivity", "creative"];
const RATING_FILTERS = [
  { label: "All", value: 0 },
  { label: "4+ ★", value: 4 },
  { label: "4.5+ ★", value: 4.5 },
];

const MarketplacePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQ = searchParams.get("q") || "";
  const initialCat = (searchParams.get("category") || "all") as AgentCategory | "all";

  const [query, setQuery] = useState(initialQ);
  const [category, setCategory] = useState<AgentCategory | "all">(initialCat);
  const [minRating, setMinRating] = useState(0);

  const agents = useMemo(() => {
    let results = searchAgents(query, category === "all" ? undefined : category);
    if (minRating > 0) {
      results = results.filter((a) => a.rating >= minRating);
    }
    return results;
  }, [query, category, minRating]);

  const handleSearch = (value: string) => {
    setQuery(value);
    const params = new URLSearchParams();
    if (value) params.set("q", value);
    if (category !== "all") params.set("category", category);
    setSearchParams(params, { replace: true });
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">AI Agents <span className="gradient-text">Marketplace</span></h1>
        <p className="mt-2 text-muted-foreground">Browse and discover AI agents for every need</p>
      </div>

      {/* Search & Filters */}
      <div className="rounded-2xl border border-border bg-card p-4 mb-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search agents..."
              className="h-10 pl-11 rounded-full bg-secondary border-border focus-visible:ring-primary/50"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              maxLength={200}
            />
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <SlidersHorizontal size={15} className="text-muted-foreground" />
            <span className="text-xs text-muted-foreground mr-1">Rating:</span>
            {RATING_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setMinRating(f.value)}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                  minRating === f.value
                    ? "gradient-bg text-white"
                    : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category pills */}
        <div className="mt-3 flex flex-wrap gap-2 pt-3 border-t border-border">
          {ALL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setCategory(cat);
                const params = new URLSearchParams();
                if (query) params.set("q", query);
                if (cat !== "all") params.set("category", cat);
                setSearchParams(params, { replace: true });
              }}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                category === cat
                  ? "gradient-bg text-white shadow-sm"
                  : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-muted border border-border"
              }`}
            >
              {cat === "all" ? "All Agents" : CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div>
        <p className="text-sm text-muted-foreground mb-4 font-medium">{agents.length} agent{agents.length !== 1 ? "s" : ""} found</p>
        {agents.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-16 text-center">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-lg font-semibold text-foreground">No agents found</p>
            <p className="mt-2 text-muted-foreground">Try adjusting your search or filters</p>
            <Button variant="outline" className="mt-4 rounded-full" onClick={() => { setQuery(""); setCategory("all"); setMinRating(0); }}>
              Clear filters
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {agents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketplacePage;
