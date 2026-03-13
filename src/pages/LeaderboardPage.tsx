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
    return `#${i + 1}`;
  };

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center gap-3 mb-2">
        <Trophy className="h-8 w-8 text-amber-400" />
        <h1 className="text-3xl font-bold">
          Agent <span className="gradient-text">Leaderboard</span>
        </h1>
      </div>
      <p className="text-muted-foreground">Top AI agents ranked by user ratings</p>

      <div className="mt-8 space-y-3">
        {sorted.map((agent, i) => (
          <div
            key={agent.id}
            onClick={() => navigate(`/agents/${agent.id}`)}
            className={`flex items-center gap-4 rounded-lg border bg-card p-5 cursor-pointer transition-all hover:bg-secondary ${
              i < 3 ? "border-primary/30 gradient-bg-subtle" : "border-border"
            }`}
          >
            <span className="flex h-10 w-10 items-center justify-center text-xl font-bold">
              {getMedal(i)}
            </span>
            <span className="text-3xl">{agent.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground">{agent.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">{CATEGORY_LABELS[agent.category]}</Badge>
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
