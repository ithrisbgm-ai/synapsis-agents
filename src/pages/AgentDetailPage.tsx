import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Play, Star, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { getAgentById } from "@/lib/agents-data";
import { CATEGORY_LABELS } from "@/lib/types";
import StarRating from "@/components/StarRating";
import { toast } from "sonner";
import { streamAgentResponse } from "@/lib/stream-chat";
import ReactMarkdown from "react-markdown";

const AgentDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const agent = getAgentById(id || "");
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [userRating, setUserRating] = useState(0);

  if (!agent) {
    return (
      <div className="flex flex-col items-center justify-center p-20">
        <p className="text-5xl mb-4">🤖</p>
        <p className="text-lg font-semibold text-foreground">Agent not found</p>
        <p className="mt-1 text-sm text-muted-foreground">This agent may have been removed</p>
        <Button variant="outline" className="mt-5 rounded-lg" onClick={() => navigate("/marketplace")}>
          Back to Marketplace
        </Button>
      </div>
    );
  }

  const handleRun = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }
    setIsRunning(true);
    setResponse("");

    await streamAgentResponse({
      prompt,
      promptTemplate: agent.prompt_template,
      agentName: agent.name,
      onDelta: (text) => setResponse((prev) => prev + text),
      onDone: () => setIsRunning(false),
      onError: (error) => {
        toast.error(error);
        setIsRunning(false);
      },
    });
  };

  const handleRate = (rating: number) => {
    setUserRating(rating);
    toast.success(`Rated ${agent.name} ${rating} stars!`);
  };

  return (
    <div className="p-8 max-w-4xl">
      <Button
        variant="ghost"
        className="mb-6 text-muted-foreground hover:text-foreground rounded-lg -ml-1"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={16} className="mr-2" /> Back
      </Button>

      {/* Agent Header */}
      <div className="rounded-xl border border-border bg-card p-6 mb-6">
        <div className="flex items-start gap-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary text-4xl ring-1 ring-border">
            {agent.icon}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold gradient-text">{agent.name}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <Badge variant="secondary" className="rounded-full px-3">{CATEGORY_LABELS[agent.category]}</Badge>
              <StarRating rating={agent.rating} count={agent.rating_count} size="md" />
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <User size={13} /> {agent.developer_name}
              </span>
            </div>
          </div>
        </div>
        <p className="mt-5 text-muted-foreground leading-relaxed border-t border-border/50 pt-5">
          {agent.description}
        </p>
      </div>

      {/* Run Agent Section */}
      <div className="rounded-xl border border-border bg-card p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Play size={16} className="text-primary" /> Run this Agent
        </h2>
        <Textarea
          placeholder={`Enter your prompt (e.g. "${agent.prompt_template.replace("You are", "").split(":")[1]?.trim() || "Type your request here..."}")`}
          className="min-h-[120px] rounded-lg bg-secondary/80 border-border resize-none focus:ring-2 focus:ring-primary/20"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          maxLength={2000}
        />
        <Button
          className="mt-4 rounded-lg gradient-bg border-0 text-primary-foreground glow-btn"
          onClick={handleRun}
          disabled={isRunning}
        >
          {isRunning ? (
            <span className="flex items-center gap-2">
              <span className="h-3.5 w-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              Running...
            </span>
          ) : (
            <>
              <Play size={15} className="mr-2" /> Run Agent
            </>
          )}
        </Button>

        {response && (
          <div className="mt-6 rounded-xl border border-border bg-background/50 p-5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">AI Response</h3>
            <div className="prose prose-invert prose-sm max-w-none text-foreground">
              <ReactMarkdown>{response}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>

      {/* Rate Agent */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold mb-4">Rate this Agent</h2>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => handleRate(star)}
              className="transition-all duration-150 hover:scale-110 active:scale-95"
            >
              <Star
                size={28}
                className={
                  star <= userRating
                    ? "fill-amber-400 text-amber-400"
                    : "text-muted-foreground/30 hover:text-amber-400/60 transition-colors"
                }
              />
            </button>
          ))}
          {userRating > 0 && (
            <span className="ml-3 text-sm text-muted-foreground">
              You rated this agent <span className="text-amber-400 font-medium">{userRating}/5</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentDetailPage;
