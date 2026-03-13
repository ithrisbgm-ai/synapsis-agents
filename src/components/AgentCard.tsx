import { useNavigate } from "react-router-dom";
import { Agent, CATEGORY_LABELS } from "@/lib/types";
import StarRating from "./StarRating";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, ArrowRight } from "lucide-react";

interface AgentCardProps {
  agent: Agent;
}

const AgentCard = ({ agent }: AgentCardProps) => {
  const navigate = useNavigate();

  return (
    <div
      className="group relative rounded-lg border border-border bg-card p-5 glow-card gradient-border cursor-pointer animate-fade-in"
      onClick={() => navigate(`/agents/${agent.id}`)}
    >
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-secondary text-2xl">
          {agent.icon}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-foreground truncate">{agent.name}</h3>
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{agent.description}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <Badge variant="secondary" className="text-xs">
          {CATEGORY_LABELS[agent.category]}
        </Badge>
        <StarRating rating={agent.rating} count={agent.rating_count} />
      </div>

      <div className="mt-4 flex items-center gap-2">
        <Button
          size="sm"
          className="flex-1 gradient-bg border-0 text-primary-foreground hover:opacity-90"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/agents/${agent.id}`);
          }}
        >
          <Play size={14} className="mr-1" /> Run Agent
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="flex-1"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/agents/${agent.id}`);
          }}
        >
          Details <ArrowRight size={14} className="ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default AgentCard;
