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
    return null;
  };

  return (
    <div className="p-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/10 ring-1 ring-amber-400/30">
          <Trophy className="h-5 w-5 text-amber-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">
            Agent <span className="gradient-text">Leaderboard</span>
          </h1>
          <p className="text-sm text-muted-foreground">Top AI agents ranked by user ratings</p>
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="mt-8 grid grid-cols-3 gap-3 mb-6">
        {sorted.slice(0, 3).map((agent, i) => (
          <div
            key={agent.id}
            onClick={() => navigate(`/agents/${agent.id}`)}
            className={`rounded-2xl border bg-card p-5 text-center cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg glow-card ${
              i === 0
                ? "border-amber-400/40 shadow-amber-400/10 shadow-md"
                : i === 1
                ? "border-slate-400/30"
                : "border-orange-700/30"
            }`}
          >
            <span className="text-3xl">{getMedal(i)}</span>
            <div className="mt-3 text-3xl">{agent.icon}</div>
            <p className="mt-2 font-bold text-sm text-foreground truncate">{agent.name}</p>
            <p className="mt-1 text-2xl font-bold gradient-text">{agent.rating.toFixed(1)}</p>
            <p className="text-xs text-muted-foreground mt-0.5">({agent.rating_count} ratings)</p>
          </div>
        ))}
      </div>

      {/* Full list */}
      <div className="space-y-2">
        {sorted.map((agent, i) => (
          <div
            key={agent.id}
            onClick={() => navigate(`/agents/${agent.id}`)}
            className={`group flex items-center gap-4 rounded-2xl border bg-card px-5 py-4 cursor-pointer transition-all duration-200 hover:border-primary/30 hover:bg-secondary/50 hover:-translate-x-0.5 ${
              i < 3 ? "border-primary/20 gradient-bg-subtle" : "border-border"
            }`}
          >
            <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
              i < 3 ? "gradient-bg text-white shadow-sm" : "bg-secondary text-muted-foreground"
            }`}>
              {getMedal(i) ?? `${i + 1}`}
            </span>
            <span className="text-2xl">{agent.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground group-hover:text-white transition-colors">{agent.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="rounded-full text-xs px-2">{CATEGORY_LABELS[agent.category]}</Badge>
                <span className="text-xs text-muted-foreground">by {agent.developer_name}</span>
              </div>
            </div>
            <StarRating rating={agent.rating} count={agent.rating_count} size="md" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeaderboardPage;
