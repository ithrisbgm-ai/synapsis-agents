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
      <h1 className="text-3xl font-bold">AI Agents <span className="gradient-text">Marketplace</span></h1>
      <p className="mt-2 text-muted-foreground">Browse and discover AI agents for every need</p>

      {/* Search & Filters */}
      <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search agents..."
            className="h-11 pl-11 bg-secondary border-border"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            maxLength={200}
          />
        </div>
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-muted-foreground" />
          {RATING_FILTERS.map((f) => (
            <Button
              key={f.value}
              size="sm"
              variant={minRating === f.value ? "default" : "outline"}
              className={minRating === f.value ? "gradient-bg border-0 text-primary-foreground" : ""}
              onClick={() => setMinRating(f.value)}
            >
              {f.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Category tabs */}
      <div className="mt-4 flex flex-wrap gap-2">
        {ALL_CATEGORIES.map((cat) => (
          <Button
            key={cat}
            size="sm"
            variant={category === cat ? "default" : "outline"}
            className={category === cat ? "gradient-bg border-0 text-primary-foreground" : ""}
            onClick={() => {
              setCategory(cat);
              const params = new URLSearchParams();
              if (query) params.set("q", query);
              if (cat !== "all") params.set("category", cat);
              setSearchParams(params, { replace: true });
            }}
          >
            {cat === "all" ? "All" : CATEGORY_LABELS[cat]}
          </Button>
        ))}
      </div>

      {/* Results */}
      <div className="mt-8">
        <p className="text-sm text-muted-foreground mb-4">{agents.length} agent{agents.length !== 1 ? "s" : ""} found</p>
        {agents.length === 0 ? (
          <div className="rounded-lg border border-border bg-card p-12 text-center">
            <p className="text-lg font-medium text-foreground">No agents found</p>
            <p className="mt-2 text-muted-foreground">Try adjusting your search or filters</p>
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
