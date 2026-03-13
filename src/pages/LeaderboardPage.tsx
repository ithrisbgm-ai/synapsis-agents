import { useNavigate } from "react-router-dom";
import { Trophy } from "lucide-react";
import { DEMO_AGENTS } from "@/lib/agents-data";
import { CATEGORY_LABELS } from "@/lib/types";
import StarRating from "@/components/StarRating";
import { Badge } from "@/components/ui/badge";

const LeaderboardPage = () => {
  const navigate = useNavigate();
  const sorted = [...DEMO_AGENTS].sort((a, b) => b.rating - a.rating);

  const getMedal = (i: number) => {
    if (i === 0) return "🥇";
    if (i === 1) return "🥈";
    if (i === 2) return "🥉";
    return `${i + 1}`;
  };

  return (
    <div className="p-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-1">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400/10 border border-amber-400/20">
          <Trophy className="h-5 w-5 text-amber-400" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">
          Agent <span className="gradient-text">Leaderboard</span>
        </h1>
      </div>
      <p className="text-muted-foreground mt-1.5 ml-12">Top AI agents ranked by community ratings</p>

      <div className="mt-8 space-y-2.5">
        {sorted.map((agent, i) => (
          <div
            key={agent.id}
            onClick={() => navigate(`/agents/${agent.id}`)}
            className={`group flex items-center gap-4 rounded-xl border bg-card px-5 py-4 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 ${
              i === 0
                ? "border-amber-400/40 bg-amber-400/5 hover:border-amber-400/60 hover:shadow-lg hover:shadow-amber-400/10"
                : i === 1
                ? "border-slate-400/30 bg-slate-400/5 hover:border-slate-400/50 hover:shadow-md"
                : i === 2
                ? "border-orange-400/30 bg-orange-400/5 hover:border-orange-400/50 hover:shadow-md"
                : "border-border hover:border-primary/30 hover:bg-secondary/30"
            }`}
          >
            {/* Rank */}
            <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg font-bold ${
              i < 3
                ? "text-xl"
                : "bg-secondary text-muted-foreground text-sm border border-border"
            }`}>
              {getMedal(i)}
            </span>

            {/* Icon */}
            <span className="text-3xl">{agent.icon}</span>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">{agent.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs rounded-lg border-border/50 bg-secondary/60 text-muted-foreground">
                  {CATEGORY_LABELS[agent.category]}
                </Badge>
                <span className="text-xs text-muted-foreground">by {agent.developer_name}</span>
              </div>
            </div>

            {/* Rating */}
            <StarRating rating={agent.rating} count={agent.rating_count} size="md" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeaderboardPage;
