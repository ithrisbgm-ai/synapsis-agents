import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Play, Star, User, Cpu } from "lucide-react";
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
        <div className="text-5xl mb-4">🤖</div>
        <p className="text-lg font-semibold text-foreground">Agent not found</p>
        <p className="mt-1 text-sm text-muted-foreground">This agent doesn't exist or has been removed</p>
        <Button variant="outline" className="mt-6 rounded-xl" onClick={() => navigate("/marketplace")}>
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
        className="mb-7 text-muted-foreground hover:text-foreground rounded-xl -ml-2 gap-2"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={16} /> Back
      </Button>

      {/* Agent Header */}
      <div className="rounded-2xl border border-border bg-card p-6 gradient-border glow-card">
        <div className="flex items-start gap-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-bg-subtle border border-primary/20 text-4xl shadow-inner">
            {agent.icon}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-extrabold tracking-tight">{agent.name}</h1>
            <div className="mt-2.5 flex flex-wrap items-center gap-3">
              <Badge variant="secondary" className="rounded-lg border-border/70 bg-secondary/60 text-muted-foreground">
                {CATEGORY_LABELS[agent.category]}
              </Badge>
              <StarRating rating={agent.rating} count={agent.rating_count} size="md" />
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <User size={13} /> {agent.developer_name}
              </span>
            </div>
            <p className="mt-3.5 text-muted-foreground leading-relaxed text-sm">{agent.description}</p>
          </div>
        </div>
      </div>

      {/* Run Agent Section */}
      <div className="mt-5 rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg gradient-bg">
            <Cpu size={14} className="text-white" />
          </div>
          <h2 className="text-lg font-bold">Run this Agent</h2>
        </div>
        <Textarea
          placeholder={`Enter your prompt (e.g. "${agent.prompt_template.replace("You are", "").split(":")[1]?.trim() || "Type your request here..."}")`}
          className="min-h-[120px] bg-secondary/60 border-border/70 resize-none rounded-xl focus-visible:ring-primary/40 focus-visible:border-primary/40 text-sm"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          maxLength={2000}
        />
        <Button
          className="mt-4 gradient-bg border-0 text-white hover:opacity-90 rounded-xl font-semibold shadow-md shadow-primary/20 transition-all hover:shadow-primary/30"
          onClick={handleRun}
          disabled={isRunning}
        >
          {isRunning ? (
            <><span className="animate-pulse">●</span> Running...</>
          ) : (
            <><Play size={15} className="mr-2" /> Run Agent</>
          )}
        </Button>

        {response && (
          <div className="mt-6 rounded-xl border border-border bg-background/50 p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">AI Response</h3>
            </div>
            <div className="prose prose-invert prose-sm max-w-none text-foreground">
              <ReactMarkdown>{response}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>

      {/* Rate Agent */}
      <div className="mt-5 rounded-2xl border border-border bg-card p-6">
        <h2 className="text-lg font-bold mb-4">Rate this Agent</h2>
        <div className="flex items-center gap-2.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => handleRate(star)}
              className="transition-transform hover:scale-115 active:scale-95"
            >
              <Star
                size={28}
                className={
                  star <= userRating
                    ? "fill-amber-400 text-amber-400"
                    : "text-muted-foreground/20 hover:text-amber-400/60 transition-colors"
                }
              />
            </button>
          ))}
          {userRating > 0 && (
            <span className="ml-2 text-sm text-muted-foreground bg-secondary/60 border border-border/50 rounded-lg px-3 py-1">
              You rated this agent <span className="font-semibold text-foreground">{userRating}/5</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentDetailPage;
