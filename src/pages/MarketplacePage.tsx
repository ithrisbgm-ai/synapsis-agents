import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, Store } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AgentCard from "@/components/AgentCard";
import { searchAgents } from "@/lib/agents-data";
import { CATEGORY_LABELS, AgentCategory } from "@/lib/types";

const ALL_CATEGORIES: (AgentCategory | "all")[] = ["all", "study", "coding", "writing", "marketing", "productivity", "creative"];
const RATING_FILTERS = [
  { label: "All Ratings", value: 0 },
  { label: "4+ Stars", value: 4 },
  { label: "4.5+ Stars", value: 4.5 },
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
      {/* Page Header */}
      <div className="flex items-center gap-3 mb-1">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-bg shadow-md shadow-primary/20">
          <Store size={17} className="text-white" />
        </div>
        <h1 className="text-3xl font-bold">
          AI Agents <span className="gradient-text">Marketplace</span>
        </h1>
      </div>
      <p className="mt-1.5 text-muted-foreground ml-12">Browse and discover AI agents for every need</p>

      {/* Search & Filters */}
      <div className="mt-7 rounded-xl border border-border bg-card p-4 space-y-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search agents..."
              className="h-10 pl-11 bg-secondary/60 border-border/70 rounded-xl focus-visible:ring-primary/40 focus-visible:border-primary/40"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              maxLength={200}
            />
          </div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={15} className="text-muted-foreground shrink-0" />
            {RATING_FILTERS.map((f) => (
              <Button
                key={f.value}
                size="sm"
                variant={minRating === f.value ? "default" : "outline"}
                className={`rounded-lg text-xs h-8 ${
                  minRating === f.value
                    ? "gradient-bg border-0 text-white shadow-sm shadow-primary/20"
                    : "border-border/70 hover:border-primary/30"
                }`}
                onClick={() => setMinRating(f.value)}
              >
                {f.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-2 pt-1 border-t border-border/50">
          {ALL_CATEGORIES.map((cat) => (
            <Button
              key={cat}
              size="sm"
              variant={category === cat ? "default" : "outline"}
              className={`rounded-lg text-xs h-8 ${
                category === cat
                  ? "gradient-bg border-0 text-white shadow-sm shadow-primary/20"
                  : "border-border/70 text-muted-foreground hover:border-primary/30 hover:text-foreground"
              }`}
              onClick={() => {
                setCategory(cat);
                const params = new URLSearchParams();
                if (query) params.set("q", query);
                if (cat !== "all") params.set("category", cat);
                setSearchParams(params, { replace: true });
              }}
            >
              {cat === "all" ? "All Categories" : CATEGORY_LABELS[cat]}
            </Button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="mt-6">
        <p className="text-sm text-muted-foreground mb-4">
          <span className="font-semibold text-foreground">{agents.length}</span>{" "}
          agent{agents.length !== 1 ? "s" : ""} found
        </p>
        {agents.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-14 text-center">
            <div className="text-4xl mb-4">🔍</div>
            <p className="text-lg font-semibold text-foreground">No agents found</p>
            <p className="mt-2 text-muted-foreground text-sm">Try adjusting your search or filters</p>
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
