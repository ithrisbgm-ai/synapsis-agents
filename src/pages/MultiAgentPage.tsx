import { useState } from "react";
import { Layers, Play, CheckCircle } from "lucide-react";
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
      <div className="flex items-center gap-3 mb-2">
        <Layers className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">
          Multi-Agent <span className="gradient-text">Collaboration</span>
        </h1>
      </div>
      <p className="text-muted-foreground">
        Enter a complex task and multiple AI agents will collaborate to solve it.
      </p>

      <div className="mt-8 rounded-lg border border-border bg-card p-6">
        <Textarea
          placeholder='Enter a complex task (e.g. "Start a new startup business")'
          className="min-h-[100px] bg-secondary border-border resize-none"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          maxLength={2000}
        />
        <Button
          className="mt-4 gradient-bg border-0 text-primary-foreground hover:opacity-90"
          onClick={runMultiAgent}
          disabled={isRunning}
        >
          <Play size={16} className="mr-2" />
          {isRunning ? "Running Agents..." : "Run Multi-Agent Task"}
        </Button>
      </div>

      {/* Agent Progress */}
      <div className="mt-8 space-y-4">
        {agents.map((agent, i) => (
          <div
            key={i}
            className={`rounded-lg border bg-card p-5 transition-all ${
              agent.status === "running"
                ? "border-primary animate-pulse"
                : agent.status === "done"
                ? "border-border"
                : "border-border opacity-60"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{agent.icon}</span>
              <span className="font-semibold text-foreground">{agent.name}</span>
              {agent.status === "running" && (
                <span className="ml-auto text-sm text-primary">Processing...</span>
              )}
              {agent.status === "done" && (
                <CheckCircle size={18} className="ml-auto text-emerald-400" />
              )}
            </div>
            {agent.result && (
              <p className="mt-3 text-sm text-muted-foreground">{agent.result}</p>
            )}
          </div>
        ))}
      </div>

      {/* Final Result */}
      {finalResult && (
        <div className="mt-8 rounded-lg border border-primary/30 bg-card p-6 gradient-bg-subtle">
          <h2 className="text-xl font-semibold mb-4">Final Combined Solution</h2>
          <div className="prose prose-invert prose-sm max-w-none text-foreground whitespace-pre-wrap">
            {finalResult}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiAgentPage;
