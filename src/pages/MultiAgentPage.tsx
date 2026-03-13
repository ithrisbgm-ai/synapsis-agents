import { useState } from "react";
import { Layers, Play, CheckCircle, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { streamAgentResponse } from "@/lib/stream-chat";
import ReactMarkdown from "react-markdown";

interface AgentResult {
  name: string;
  icon: string;
  promptTemplate: string;
  status: "pending" | "running" | "done";
  result: string;
}

const MULTI_AGENTS: AgentResult[] = [
  { name: "Research Agent", icon: "🔬", promptTemplate: "You are a research analyst. Provide thorough research and analysis for: {input}", status: "pending", result: "" },
  { name: "Finance Agent", icon: "💰", promptTemplate: "You are a financial advisor. Provide financial analysis, budgeting, and funding strategies for: {input}", status: "pending", result: "" },
  { name: "Marketing Agent", icon: "📣", promptTemplate: "You are a marketing strategist. Create a marketing plan and strategy for: {input}", status: "pending", result: "" },
];

const MultiAgentPage = () => {
  const [task, setTask] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [agents, setAgents] = useState<AgentResult[]>(MULTI_AGENTS);
  const [finalResult, setFinalResult] = useState("");

  const runMultiAgent = async () => {
    if (!task.trim()) {
      toast.error("Please enter a task");
      return;
    }
    setIsRunning(true);
    setFinalResult("");
    const freshAgents = MULTI_AGENTS.map((a) => ({ ...a, status: "pending" as const, result: "" }));
    setAgents(freshAgents);

    const results: string[] = [];

    for (let i = 0; i < freshAgents.length; i++) {
      setAgents((prev) =>
        prev.map((a, idx) => (idx === i ? { ...a, status: "running" as const } : a))
      );

      let agentResult = "";
      await streamAgentResponse({
        prompt: task,
        promptTemplate: freshAgents[i].promptTemplate,
        agentName: freshAgents[i].name,
        onDelta: (text) => {
          agentResult += text;
          setAgents((prev) =>
            prev.map((a, idx) => (idx === i ? { ...a, result: agentResult } : a))
          );
        },
        onDone: () => {
          setAgents((prev) =>
            prev.map((a, idx) => (idx === i ? { ...a, status: "done" as const } : a))
          );
        },
        onError: (error) => {
          toast.error(`${freshAgents[i].name}: ${error}`);
          setAgents((prev) =>
            prev.map((a, idx) => (idx === i ? { ...a, status: "done" as const, result: `Error: ${error}` } : a))
          );
        },
      });
      results.push(agentResult);
    }

    setFinalResult(
      `## Combined Multi-Agent Solution\n\n**Task:** ${task}\n\n` +
      results.map((r, i) => `### ${freshAgents[i].icon} ${freshAgents[i].name}\n\n${r}`).join("\n\n---\n\n")
    );
    setIsRunning(false);
  };

  const doneCount = agents.filter((a) => a.status === "done").length;
  const progress = isRunning || doneCount > 0 ? Math.round((doneCount / agents.length) * 100) : 0;

  return (
    <div className="p-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-1">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-bg shadow-md shadow-primary/20">
          <Layers size={17} className="text-white" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">
          Multi-Agent <span className="gradient-text">Collaboration</span>
        </h1>
      </div>
      <p className="text-muted-foreground mt-1.5 ml-12">
        Enter a complex task and multiple AI agents will collaborate to solve it.
      </p>

      {/* Task Input */}
      <div className="mt-8 rounded-2xl border border-border bg-card p-6">
        <label className="text-sm font-semibold text-foreground mb-2 block">Your Task</label>
        <Textarea
          placeholder='e.g. "Start a new startup business in the EdTech space"'
          className="min-h-[100px] bg-secondary/60 border-border/70 resize-none rounded-xl focus-visible:ring-primary/40 focus-visible:border-primary/40 text-sm"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          maxLength={2000}
        />
        <div className="mt-4 flex items-center gap-4">
          <Button
            className="gradient-bg border-0 text-white hover:opacity-90 rounded-xl font-semibold shadow-md shadow-primary/20 transition-all hover:shadow-primary/30"
            onClick={runMultiAgent}
            disabled={isRunning}
          >
            <Play size={15} className="mr-2" />
            {isRunning ? "Running Agents..." : "Run Multi-Agent Task"}
          </Button>
          {(isRunning || doneCount > 0) && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="h-1.5 w-24 rounded-full bg-secondary overflow-hidden">
                <div
                  className="h-full gradient-bg rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span>{progress}%</span>
            </div>
          )}
        </div>
      </div>

      {/* Agent Progress */}
      <div className="mt-6 space-y-3">
        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Agent Pipeline</p>
        {agents.map((agent, i) => (
          <div
            key={i}
            className={`rounded-2xl border bg-card p-5 transition-all duration-300 ${
              agent.status === "running"
                ? "border-primary/50 shadow-lg shadow-primary/10"
                : agent.status === "done"
                ? "border-emerald-500/30"
                : "border-border opacity-50"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{agent.icon}</span>
              <div className="flex-1">
                <span className="font-semibold text-foreground text-sm">{agent.name}</span>
                {agent.status === "running" && (
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="h-1 w-1 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="h-1 w-1 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="h-1 w-1 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
                    <span className="text-xs text-primary ml-1">Processing...</span>
                  </div>
                )}
              </div>
              {agent.status === "pending" && <Circle size={16} className="text-muted-foreground/30" />}
              {agent.status === "running" && (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/10 border border-primary/20 rounded-lg px-2.5 py-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                  Active
                </span>
              )}
              {agent.status === "done" && (
                <CheckCircle size={18} className="text-emerald-400" />
              )}
            </div>
            {agent.result && (
              <div className="mt-3 pl-11">
                <p className="text-xs text-muted-foreground line-clamp-2">{agent.result}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Final Result */}
      {finalResult && (
        <div className="mt-6 rounded-2xl border border-emerald-500/30 bg-card p-6 shadow-lg shadow-emerald-500/5">
          <div className="flex items-center gap-2.5 mb-5">
            <CheckCircle size={18} className="text-emerald-400" />
            <h2 className="text-lg font-bold">Combined Solution</h2>
          </div>
          <div className="prose prose-invert prose-sm max-w-none text-foreground">
            <ReactMarkdown>{finalResult}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiAgentPage;
