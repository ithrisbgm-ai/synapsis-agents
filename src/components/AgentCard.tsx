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
      className="group relative rounded-2xl border border-border bg-card p-5 glow-card gradient-border cursor-pointer animate-fade-in overflow-hidden"
      onClick={() => navigate(`/agents/${agent.id}`)}
    >
      {/* Subtle top gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-px gradient-bg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary text-2xl ring-1 ring-border group-hover:ring-primary/30 transition-all duration-200">
          {agent.icon}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-foreground truncate group-hover:text-white transition-colors">{agent.name}</h3>
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2 leading-relaxed">{agent.description}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <Badge variant="secondary" className="rounded-full text-xs font-medium px-2.5">
          {CATEGORY_LABELS[agent.category]}
        </Badge>
        <StarRating rating={agent.rating} count={agent.rating_count} />
      </div>

      <div className="mt-4 flex items-center gap-2">
        <Button
          size="sm"
          className="flex-1 rounded-full gradient-bg border-0 text-white hover:opacity-90 transition-all"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/agents/${agent.id}`);
          }}
        >
          <Play size={13} className="mr-1.5" /> Run Agent
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="flex-1 rounded-full border-border hover:border-primary/40 hover:bg-secondary transition-all"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/agents/${agent.id}`);
          }}
        >
          Details <ArrowRight size={13} className="ml-1.5" />
        </Button>
      </div>
    </div>
  );
};

export default AgentCard;
