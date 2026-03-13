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

  const fieldClass = "bg-secondary/60 border-border/70 rounded-xl focus-visible:ring-primary/40 focus-visible:border-primary/40 text-sm";

  return (
    <div className="p-8 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-1">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-bg shadow-md shadow-primary/20">
          <Code2 size={17} className="text-white" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">
          Developer <span className="gradient-text">Dashboard</span>
        </h1>
      </div>
      <p className="text-muted-foreground mt-1.5 ml-12">Submit your AI agent to the marketplace</p>

      {/* Info Banner */}
      <div className="mt-7 rounded-xl border border-primary/20 bg-primary/5 p-4 flex items-start gap-3">
        <Info size={16} className="text-primary mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-medium text-foreground">How it works</p>
          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
            Fill in your agent details below. Use <code className="bg-secondary px-1 py-0.5 rounded text-primary text-[11px]">{"{input}"}</code> in your prompt template as a placeholder for user input. After review, your agent will appear in the marketplace.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div className="rounded-2xl border border-border bg-card p-6 space-y-5">

          {/* Agent Name */}
          <div>
            <label className="text-sm font-semibold text-foreground mb-2 block">Agent Name</label>
            <Input
              placeholder="e.g. Resume Builder AI"
              className={fieldClass}
              value={formData.name}
              onChange={(e) => update("name", e.target.value)}
              maxLength={100}
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-semibold text-foreground mb-2 block">Description</label>
            <Textarea
              placeholder="Describe what your agent does and how it helps users..."
              className={`${fieldClass} resize-none`}
              rows={3}
              value={formData.description}
              onChange={(e) => update("description", e.target.value)}
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground mt-1.5">{formData.description.length}/500</p>
          </div>

          {/* Category */}
          <div>
            <label className="text-sm font-semibold text-foreground mb-2 block">Category</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <Button
                  key={cat}
                  type="button"
                  size="sm"
                  variant={formData.category === cat ? "default" : "outline"}
                  className={`rounded-lg text-xs h-8 ${
                    formData.category === cat
                      ? "gradient-bg border-0 text-white shadow-sm shadow-primary/20"
                      : "border-border/70 text-muted-foreground hover:border-primary/30 hover:text-foreground"
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
            <label className="text-sm font-semibold text-foreground mb-2 block">Developer Name</label>
            <Input
              placeholder="Your name or company"
              className={fieldClass}
              value={formData.developer_name}
              onChange={(e) => update("developer_name", e.target.value)}
              maxLength={100}
            />
          </div>

          {/* Prompt Template */}
          <div>
            <label className="text-sm font-semibold text-foreground mb-2 block">Prompt Template</label>
            <Textarea
              placeholder={`e.g. "You are a professional resume writer. Create a tailored resume for: {input}"`}
              className={`${fieldClass} resize-none font-mono text-[13px]`}
              rows={4}
              value={formData.prompt_template}
              onChange={(e) => update("prompt_template", e.target.value)}
              maxLength={2000}
            />
            <p className="text-xs text-muted-foreground mt-1.5">
              Use <code className="bg-secondary px-1 py-0.5 rounded text-primary text-[11px]">{"{input}"}</code> as placeholder for user input.
              {" "}{formData.prompt_template.length}/2000
            </p>
          </div>

          {/* Demo Example */}
          <div>
            <label className="text-sm font-semibold text-foreground mb-2 block">
              Demo Example <span className="font-normal text-muted-foreground">(optional)</span>
            </label>
            <Input
              placeholder="Example prompt users can try with your agent"
              className={fieldClass}
              value={formData.demo_example}
              onChange={(e) => update("demo_example", e.target.value)}
              maxLength={500}
            />
          </div>
        </div>

        <Button
          type="submit"
          size="lg"
          className="gradient-bg border-0 text-white hover:opacity-90 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all hover:shadow-primary/30 hover:scale-[1.01]"
        >
          <Plus size={17} className="mr-2" /> Submit Agent to Marketplace
        </Button>
      </form>
    </div>
  );
};

export default DeveloperPage;
