import { useState } from "react";
import { Code2, Plus } from "lucide-react";
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
      <div className="flex items-center gap-3 mb-2">
        <Code2 className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">
          Developer <span className="gradient-text">Dashboard</span>
        </h1>
      </div>
      <p className="text-muted-foreground">Submit your AI agent to the marketplace</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div className="rounded-lg border border-border bg-card p-6 space-y-5">
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Agent Name</label>
            <Input
              placeholder="e.g. Resume Builder AI"
              className="bg-secondary border-border"
              value={formData.name}
              onChange={(e) => update("name", e.target.value)}
              maxLength={100}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Description</label>
            <Textarea
              placeholder="Describe what your agent does..."
              className="bg-secondary border-border resize-none"
              rows={3}
              value={formData.description}
              onChange={(e) => update("description", e.target.value)}
              maxLength={500}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Category</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <Button
                  key={cat}
                  type="button"
                  size="sm"
                  variant={formData.category === cat ? "default" : "outline"}
                  className={formData.category === cat ? "gradient-bg border-0 text-primary-foreground" : ""}
                  onClick={() => update("category", cat)}
                >
                  {CATEGORY_LABELS[cat]}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Developer Name</label>
            <Input
              placeholder="Your name or company"
              className="bg-secondary border-border"
              value={formData.developer_name}
              onChange={(e) => update("developer_name", e.target.value)}
              maxLength={100}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Prompt Template</label>
            <Textarea
              placeholder="The system prompt for your agent. Use {input} as placeholder for user input."
              className="bg-secondary border-border resize-none"
              rows={4}
              value={formData.prompt_template}
              onChange={(e) => update("prompt_template", e.target.value)}
              maxLength={2000}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Demo Example (optional)</label>
            <Input
              placeholder="Example prompt users can try"
              className="bg-secondary border-border"
              value={formData.demo_example}
              onChange={(e) => update("demo_example", e.target.value)}
              maxLength={500}
            />
          </div>
        </div>

        <Button type="submit" size="lg" className="gradient-bg border-0 text-primary-foreground hover:opacity-90">
          <Plus size={18} className="mr-2" /> Submit Agent
        </Button>
      </form>
    </div>
  );
};

export default DeveloperPage;
