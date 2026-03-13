import { useState } from "react";
import { Code2, Plus, Info } from "lucide-react";
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
        <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-bg shadow-lg shadow-primary/20">
          <Code2 className="h-5 w-5 text-white" />
        </div>
        <h1 className="text-3xl font-bold">
          Developer <span className="gradient-text">Dashboard</span>
        </h1>
      </div>
      <p className="text-muted-foreground mb-8 ml-[52px]">Submit your AI agent to the marketplace</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-xl border border-border bg-card p-6 space-y-6">
          {/* Agent Name */}
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Agent Name</label>
            <Input
              placeholder="e.g. Resume Builder AI"
              className="rounded-lg bg-secondary/80 border-border focus:ring-2 focus:ring-primary/20"
              value={formData.name}
              onChange={(e) => update("name", e.target.value)}
              maxLength={100}
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Description</label>
            <Textarea
              placeholder="Describe what your agent does..."
              className="rounded-lg bg-secondary/80 border-border resize-none focus:ring-2 focus:ring-primary/20"
              rows={3}
              value={formData.description}
              onChange={(e) => update("description", e.target.value)}
              maxLength={500}
            />
            <p className="mt-1 text-xs text-muted-foreground">{formData.description.length}/500</p>
          </div>

          {/* Category */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Category</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <Button
                  key={cat}
                  type="button"
                  size="sm"
                  variant={formData.category === cat ? "default" : "outline"}
                  className={`rounded-lg text-xs ${
                    formData.category === cat
                      ? "gradient-bg border-0 text-primary-foreground"
                      : "border-border/60 hover:border-primary/30 text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => update("category", cat)}
                >
                  {CATEGORY_LABELS[cat]}
                </Button>
              ))}
            </div>
          </div>

          {/* Developer Name */}
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Developer Name</label>
            <Input
              placeholder="Your name or company"
              className="rounded-lg bg-secondary/80 border-border focus:ring-2 focus:ring-primary/20"
              value={formData.developer_name}
              onChange={(e) => update("developer_name", e.target.value)}
              maxLength={100}
            />
          </div>

          {/* Prompt Template */}
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">
              Prompt Template
            </label>
            <div className="mb-2 flex items-start gap-2 rounded-lg bg-primary/5 border border-primary/10 p-3">
              <Info size={13} className="text-primary mt-0.5 shrink-0" />
              <p className="text-xs text-muted-foreground">
                Use <code className="text-primary bg-primary/10 px-1 rounded">{"{input}"}</code> as a placeholder where the user's message will be inserted.
              </p>
            </div>
            <Textarea
              placeholder="The system prompt for your agent. Use {input} as placeholder for user input."
              className="rounded-lg bg-secondary/80 border-border resize-none focus:ring-2 focus:ring-primary/20"
              rows={4}
              value={formData.prompt_template}
              onChange={(e) => update("prompt_template", e.target.value)}
              maxLength={2000}
            />
            <p className="mt-1 text-xs text-muted-foreground">{formData.prompt_template.length}/2000</p>
          </div>

          {/* Demo Example */}
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">
              Demo Example <span className="text-muted-foreground font-normal">(optional)</span>
            </label>
            <Input
              placeholder="Example prompt users can try"
              className="rounded-lg bg-secondary/80 border-border focus:ring-2 focus:ring-primary/20"
              value={formData.demo_example}
              onChange={(e) => update("demo_example", e.target.value)}
              maxLength={500}
            />
          </div>
        </div>

        <Button
          type="submit"
          size="lg"
          className="rounded-xl gradient-bg border-0 text-primary-foreground glow-btn font-semibold"
        >
          <Plus size={17} className="mr-2" /> Submit Agent
        </Button>
      </form>
    </div>
  );
};

export default DeveloperPage;
