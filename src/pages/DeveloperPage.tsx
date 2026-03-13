import { useState } from "react";
import { Code2, Plus, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AgentCategory, CATEGORY_LABELS } from "@/lib/types";
import { toast } from "sonner";
import { z } from "zod";

const agentSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  description: z.string().trim().min(1, "Description is required").max(500),
  category: z.string().min(1, "Category is required"),
  developer_name: z.string().trim().min(1, "Developer name is required").max(100),
  prompt_template: z.string().trim().min(1, "Prompt template is required").max(2000),
  demo_example: z.string().max(500).optional(),
});

const CATEGORIES: AgentCategory[] = ["study", "coding", "writing", "marketing", "productivity", "creative"];

const DeveloperPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    developer_name: "",
    prompt_template: "",
    demo_example: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = agentSchema.safeParse(formData);
    if (!result.success) {
      toast.error(result.error.errors[0].message);
      return;
    }
    toast.success("Agent submitted! It will appear in the marketplace after review.");
    setFormData({ name: "", description: "", category: "", developer_name: "", prompt_template: "", demo_example: "" });
  };

  const update = (field: string, value: string) => setFormData((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="p-8 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-bg shadow-lg shadow-primary/25">
          <Code2 className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">
            Developer <span className="gradient-text">Dashboard</span>
          </h1>
          <p className="text-sm text-muted-foreground">Submit your AI agent to the marketplace</p>
        </div>
      </div>

      {/* Info banner */}
      <div className="mt-6 rounded-2xl border border-primary/20 gradient-bg-subtle p-4 flex items-start gap-3">
        <Lightbulb size={16} className="text-primary mt-0.5 shrink-0" />
        <p className="text-sm text-muted-foreground leading-relaxed">
          Create powerful AI agents by defining a clear system prompt. Use <code className="text-primary bg-secondary px-1 rounded text-xs">{"{input}"}</code> as placeholder for the user's input.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
          <div>
            <label className="text-sm font-semibold text-foreground mb-1.5 block">Agent Name</label>
            <Input
              placeholder="e.g. Resume Builder AI"
              className="bg-secondary border-border rounded-xl focus-visible:ring-primary/50"
              value={formData.name}
              onChange={(e) => update("name", e.target.value)}
              maxLength={100}
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-foreground mb-1.5 block">Description</label>
            <Textarea
              placeholder="Describe what your agent does..."
              className="bg-secondary border-border resize-none rounded-xl focus-visible:ring-primary/50"
              rows={3}
              value={formData.description}
              onChange={(e) => update("description", e.target.value)}
              maxLength={500}
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-foreground mb-2 block">Category</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => update("category", cat)}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                    formData.category === cat
                      ? "gradient-bg text-white shadow-sm"
                      : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-muted border border-border"
                  }`}
                >
                  {CATEGORY_LABELS[cat]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-foreground mb-1.5 block">Developer Name</label>
            <Input
              placeholder="Your name or company"
              className="bg-secondary border-border rounded-xl focus-visible:ring-primary/50"
              value={formData.developer_name}
              onChange={(e) => update("developer_name", e.target.value)}
              maxLength={100}
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-foreground mb-1.5 block">Prompt Template</label>
            <Textarea
              placeholder="The system prompt for your agent. Use {input} as placeholder for user input."
              className="bg-secondary border-border resize-none rounded-xl focus-visible:ring-primary/50 font-mono text-sm"
              rows={5}
              value={formData.prompt_template}
              onChange={(e) => update("prompt_template", e.target.value)}
              maxLength={2000}
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-foreground mb-1.5 block">
              Demo Example <span className="text-muted-foreground font-normal">(optional)</span>
            </label>
            <Input
              placeholder="Example prompt users can try"
              className="bg-secondary border-border rounded-xl focus-visible:ring-primary/50"
              value={formData.demo_example}
              onChange={(e) => update("demo_example", e.target.value)}
              maxLength={500}
            />
          </div>
        </div>

        <Button type="submit" size="lg" className="rounded-full gradient-bg border-0 text-white hover:opacity-90 font-semibold px-8 shadow-lg shadow-primary/20">
          <Plus size={17} className="mr-2" /> Submit Agent
        </Button>
      </form>
    </div>
  );
};

export default DeveloperPage;
