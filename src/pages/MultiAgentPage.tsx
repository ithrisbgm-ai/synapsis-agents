import { useState } from "react";
import { Layers, Play, CheckCircle, Loader2 } from "lucide-react";
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

  return (
    <div className="p-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-bg shadow-lg shadow-primary/20">
          <Layers className="h-5 w-5 text-white" />
        </div>
        <h1 className="text-3xl font-bold">
          Multi-Agent <span className="gradient-text">Collaboration</span>
        </h1>
      </div>
      <p className="text-muted-foreground mb-8 ml-[52px]">
        Enter a complex task and multiple AI agents will collaborate to solve it.
      </p>

      {/* Task input */}
      <div className="rounded-xl border border-border bg-card p-6 mb-8">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">Your Task</h2>
        <Textarea
          placeholder='Enter a complex task (e.g. "Start a new startup business")'
          className="min-h-[100px] rounded-lg bg-secondary/80 border-border resize-none focus:ring-2 focus:ring-primary/20"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          maxLength={2000}
        />
        <Button
          className="mt-4 rounded-lg gradient-bg border-0 text-primary-foreground glow-btn"
          onClick={runMultiAgent}
          disabled={isRunning}
        >
          {isRunning ? (
            <span className="flex items-center gap-2">
              <Loader2 size={15} className="animate-spin" />
              Running Agents...
            </span>
          ) : (
            <>
              <Play size={15} className="mr-2" />
              Run Multi-Agent Task
            </>
          )}
        </Button>
      </div>

      {/* Agent Progress */}
      <div className="space-y-3 mb-8">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Agent Pipeline</h2>
        {agents.map((agent, i) => (
          <div
            key={i}
            className={`rounded-xl border bg-card p-5 transition-all duration-300 ${
              agent.status === "running"
                ? "border-primary/40 shadow-md shadow-primary/10"
                : agent.status === "done"
                ? "border-emerald-500/20"
                : "border-border opacity-50"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{agent.icon}</span>
              <div className="flex-1">
                <span className="font-semibold text-foreground">{agent.name}</span>
                {agent.status === "pending" && (
                  <p className="text-xs text-muted-foreground mt-0.5">Waiting...</p>
                )}
              </div>
              {agent.status === "running" && (
                <span className="flex items-center gap-1.5 text-sm text-primary">
                  <Loader2 size={13} className="animate-spin" />
                  Processing...
                </span>
              )}
              {agent.status === "done" && (
                <CheckCircle size={18} className="text-emerald-400" />
              )}
            </div>
            {agent.result && (
              <p className="mt-3 text-sm text-muted-foreground line-clamp-3 leading-relaxed border-t border-border/50 pt-3">
                {agent.result}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Final Result */}
      {finalResult && (
        <div className="rounded-xl border border-primary/20 bg-card p-6 gradient-bg-subtle">
          <h2 className="text-lg font-semibold mb-4 gradient-text">Final Combined Solution</h2>
          <div className="prose prose-invert prose-sm max-w-none text-foreground">
            <ReactMarkdown>{finalResult}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiAgentPage;
