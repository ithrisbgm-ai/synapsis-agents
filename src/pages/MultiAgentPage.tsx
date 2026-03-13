import { useState } from "react";
import { Layers, Play, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface AgentResult {
  name: string;
  icon: string;
  status: "pending" | "running" | "done";
  result: string;
}

const MULTI_AGENTS: AgentResult[] = [
  { name: "Research Agent", icon: "🔬", status: "pending", result: "" },
  { name: "Finance Agent", icon: "💰", status: "pending", result: "" },
  { name: "Marketing Agent", icon: "📣", status: "pending", result: "" },
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
    setAgents(MULTI_AGENTS.map((a) => ({ ...a, status: "pending", result: "" })));

    for (let i = 0; i < MULTI_AGENTS.length; i++) {
      setAgents((prev) =>
        prev.map((a, idx) => (idx === i ? { ...a, status: "running" } : a))
      );
      await new Promise((r) => setTimeout(r, 1200));
      const result = `Analysis from ${MULTI_AGENTS[i].name} for task: "${task}". This is a simulated response. Connect Lovable Cloud to get real AI-powered results.`;
      setAgents((prev) =>
        prev.map((a, idx) => (idx === i ? { ...a, status: "done", result } : a))
      );
    }

    await new Promise((r) => setTimeout(r, 800));
    setFinalResult(
      `## Combined Multi-Agent Solution\n\n` +
      `**Task:** ${task}\n\n` +
      `Three specialized agents analyzed your request and produced a comprehensive solution.\n\n` +
      `In production, each agent would use Lovable AI to generate domain-specific insights, ` +
      `then a coordinator agent would synthesize the results into a unified plan.\n\n` +
      `*Enable Lovable Cloud to power real multi-agent collaboration.*`
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
