import { useState } from "react";
import { Layers, Play, CheckCircle, Circle, Loader2 } from "lucide-react";
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

  const completedCount = agents.filter((a) => a.status === "done").length;
  const progress = isRunning || finalResult ? Math.round((completedCount / agents.length) * 100) : 0;

  return (
    <div className="p-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-bg shadow-lg shadow-primary/25">
          <Layers className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">
            Multi-Agent <span className="gradient-text">Collaboration</span>
          </h1>
          <p className="text-sm text-muted-foreground">Multiple AI agents collaborate to solve complex tasks</p>
        </div>
      </div>

      {/* Agent badges */}
      <div className="mt-6 flex items-center gap-2 flex-wrap">
        {MULTI_AGENTS.map((a) => (
          <div key={a.name} className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
            <span>{a.icon}</span>
            <span>{a.name}</span>
          </div>
        ))}
        <span className="text-xs text-muted-foreground">→ Combined Solution</span>
      </div>

      {/* Input card */}
      <div className="mt-6 rounded-2xl border border-border bg-card p-6">
        <label className="text-sm font-semibold text-foreground mb-2 block">Your complex task</label>
        <Textarea
          placeholder='Enter a complex task (e.g. "Start a new startup business")'
          className="min-h-[100px] bg-secondary border-border resize-none rounded-xl focus-visible:ring-primary/50"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          maxLength={2000}
        />

        <div className="mt-4 flex items-center gap-4">
          <Button
            className="rounded-full gradient-bg border-0 text-white hover:opacity-90 font-semibold px-6"
            onClick={runMultiAgent}
            disabled={isRunning}
          >
            {isRunning ? (
              <><Loader2 size={15} className="mr-2 animate-spin" /> Running Agents...</>
            ) : (
              <><Play size={15} className="mr-2" /> Run Multi-Agent Task</>
            )}
          </Button>

          {(isRunning || finalResult) && (
            <div className="flex items-center gap-2 flex-1 max-w-xs">
              <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
                <div
                  className="h-full rounded-full gradient-bg transition-all duration-500"
                  style={{ width: `${finalResult ? 100 : progress}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground">{finalResult ? "100" : progress}%</span>
            </div>
          )}
        </div>
      </div>

      {/* Agent Progress */}
      <div className="mt-6 space-y-3">
        {agents.map((agent, i) => (
          <div
            key={i}
            className={`rounded-2xl border bg-card p-5 transition-all duration-300 ${
              agent.status === "running"
                ? "border-primary/50 shadow-md shadow-primary/10"
                : agent.status === "done"
                ? "border-emerald-500/30"
                : "border-border opacity-50"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{agent.icon}</span>
              <div className="flex-1">
                <span className="font-semibold text-foreground">{agent.name}</span>
                {agent.status === "running" && (
                  <span className="ml-2 text-xs text-primary font-medium animate-pulse">Processing...</span>
                )}
              </div>
              {agent.status === "pending" && <Circle size={16} className="text-muted-foreground/40" />}
              {agent.status === "running" && <Loader2 size={16} className="text-primary animate-spin" />}
              {agent.status === "done" && <CheckCircle size={16} className="text-emerald-400" />}
            </div>
            {agent.result && (
              <p className="mt-3 text-sm text-muted-foreground line-clamp-3 leading-relaxed">{agent.result}</p>
            )}
          </div>
        ))}
      </div>

      {/* Final Result */}
      {finalResult && (
        <div className="mt-6 rounded-2xl border border-primary/30 bg-card p-6 gradient-bg-subtle">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <CheckCircle size={18} className="text-emerald-400" />
            Combined Solution
          </h2>
          <div className="prose prose-invert prose-sm max-w-none text-foreground">
            <ReactMarkdown>{finalResult}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiAgentPage;
