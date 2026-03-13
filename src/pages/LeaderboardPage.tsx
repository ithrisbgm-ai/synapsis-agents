import { useNavigate } from "react-router-dom";
import { Trophy, ArrowRight } from "lucide-react";
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
    return `#${i + 1}`;
  };

  const getMedalBg = (i: number) => {
    if (i === 0) return "bg-amber-500/10 border-amber-500/30 text-amber-400";
    if (i === 1) return "bg-slate-400/10 border-slate-400/30 text-slate-300";
    if (i === 2) return "bg-orange-600/10 border-orange-600/30 text-orange-400";
    return "bg-secondary border-border text-muted-foreground";
  };

  return (
    <div className="p-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20">
          <Trophy className="h-5 w-5 text-amber-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">
            Agent <span className="gradient-text">Leaderboard</span>
          </h1>
        </div>
      </div>
      <p className="text-muted-foreground mb-8 ml-[52px]">Top AI agents ranked by user ratings</p>

      {/* Top 3 podium */}
      {sorted.length >= 3 && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[sorted[1], sorted[0], sorted[2]].map((agent, podiumIdx) => {
            const rank = podiumIdx === 0 ? 1 : podiumIdx === 1 ? 0 : 2;
            const heights = ["h-28", "h-36", "h-24"];
            const medals = ["🥈", "🥇", "🥉"];
            return (
              <div
                key={agent.id}
                onClick={() => navigate(`/agents/${agent.id}`)}
                className={`flex flex-col items-center justify-end rounded-xl border p-4 cursor-pointer transition-all duration-200 hover:-translate-y-1 ${
                  rank === 0
                    ? "border-amber-500/30 bg-amber-500/5 shadow-lg shadow-amber-500/10"
                    : "border-border bg-card"
                }`}
              >
                <span className="text-3xl mb-2">{agent.icon}</span>
                <span className="text-xl mb-1">{medals[podiumIdx]}</span>
                <p className="text-sm font-semibold text-center text-foreground truncate w-full">{agent.name}</p>
                <StarRating rating={agent.rating} count={agent.rating_count} />
              </div>
            );
          })}
        </div>
      )}

      {/* Full list */}
      <div className="space-y-2.5">
        {sorted.map((agent, i) => (
          <div
            key={agent.id}
            onClick={() => navigate(`/agents/${agent.id}`)}
            className={`group flex items-center gap-4 rounded-xl border bg-card p-4 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 ${
              i < 3
                ? "border-primary/20 gradient-bg-subtle"
                : "border-border hover:border-border/80 hover:bg-secondary/50"
            }`}
          >
            <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border text-sm font-bold ${getMedalBg(i)}`}>
              {getMedal(i)}
            </span>
            <span className="text-2xl">{agent.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">{agent.name}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <Badge variant="secondary" className="text-xs rounded-full px-2">{CATEGORY_LABELS[agent.category]}</Badge>
                <span className="text-xs text-muted-foreground">by {agent.developer_name}</span>
              </div>
            </div>
            <StarRating rating={agent.rating} count={agent.rating_count} size="md" />
            <ArrowRight size={14} className="text-muted-foreground/30 group-hover:text-primary/50 group-hover:translate-x-0.5 transition-all shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeaderboardPage;
