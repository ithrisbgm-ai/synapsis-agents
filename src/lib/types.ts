export interface Agent {
  id: string;
  name: string;
  description: string;
  category: AgentCategory;
  developer_name: string;
  rating: number;
  rating_count: number;
  icon: string;
  prompt_template: string;
  featured?: boolean;
  created_at: string;
}

export type AgentCategory = "study" | "coding" | "writing" | "marketing" | "productivity" | "creative";

export interface Rating {
  id: string;
  agent_id: string;
  user_rating: number;
  comment?: string;
}

export const CATEGORY_LABELS: Record<AgentCategory, string> = {
  study: "Study AI",
  coding: "Coding AI",
  writing: "Writing AI",
  marketing: "Marketing AI",
  productivity: "Productivity AI",
  creative: "Creative AI",
};

export const CATEGORY_ICONS: Record<AgentCategory, string> = {
  study: "📚",
  coding: "💻",
  writing: "✍️",
  marketing: "📈",
  productivity: "⚡",
  creative: "🎨",
};
