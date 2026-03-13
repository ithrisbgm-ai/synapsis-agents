import { Agent } from "./types";

export const DEMO_AGENTS: Agent[] = [
  {
    id: "1",
    name: "Resume Builder AI",
    description: "Generate professional resumes tailored to any job role. Provide your details and get a polished resume in seconds.",
    category: "writing",
    developer_name: "AgentForge",
    rating: 4.8,
    rating_count: 342,
    icon: "📄",
    prompt_template: "You are a professional resume writer. Create a detailed, well-formatted resume based on the following request: {input}",
    featured: true,
    created_at: "2025-12-01",
  },
  {
    id: "2",
    name: "Study Planner AI",
    description: "Create personalized study plans with schedules, resources, and milestones for any subject or exam.",
    category: "study",
    developer_name: "EduTech Labs",
    rating: 4.6,
    rating_count: 218,
    icon: "📅",
    prompt_template: "You are an expert study planner. Create a comprehensive study plan for: {input}",
    featured: true,
    created_at: "2025-11-15",
  },
  {
    id: "3",
    name: "Coding Helper AI",
    description: "Get help with coding problems, debugging, code reviews, and learning new programming concepts.",
    category: "coding",
    developer_name: "DevStack",
    rating: 4.9,
    rating_count: 567,
    icon: "🧑‍💻",
    prompt_template: "You are a senior software engineer. Help with the following coding task: {input}",
    featured: true,
    created_at: "2025-10-20",
  },
  {
    id: "4",
    name: "Travel Planner AI",
    description: "Plan your dream vacation with personalized itineraries, budget estimates, and local recommendations.",
    category: "productivity",
    developer_name: "WanderTech",
    rating: 4.5,
    rating_count: 189,
    icon: "✈️",
    prompt_template: "You are a travel planning expert. Create a detailed travel plan for: {input}",
    featured: true,
    created_at: "2025-09-10",
  },
  {
    id: "5",
    name: "Marketing Copy AI",
    description: "Generate compelling marketing copy for ads, social media, emails, and landing pages.",
    category: "marketing",
    developer_name: "GrowthLab",
    rating: 4.7,
    rating_count: 295,
    icon: "🎯",
    prompt_template: "You are a marketing copywriting expert. Generate compelling marketing copy for: {input}",
    created_at: "2025-08-05",
  },
  {
    id: "6",
    name: "Quiz Generator AI",
    description: "Create quizzes and practice tests on any topic with varying difficulty levels.",
    category: "study",
    developer_name: "EduTech Labs",
    rating: 4.4,
    rating_count: 156,
    icon: "❓",
    prompt_template: "You are a quiz master. Generate a quiz with questions and answers on: {input}",
    created_at: "2025-07-22",
  },
  {
    id: "7",
    name: "Blog Writer AI",
    description: "Write engaging blog posts with SEO optimization on any topic.",
    category: "writing",
    developer_name: "ContentAI",
    rating: 4.3,
    rating_count: 201,
    icon: "📝",
    prompt_template: "You are an expert blog writer. Write an engaging, SEO-optimized blog post about: {input}",
    created_at: "2025-06-18",
  },
  {
    id: "8",
    name: "Concept Explainer AI",
    description: "Break down complex concepts into simple, easy-to-understand explanations with examples.",
    category: "study",
    developer_name: "LearnSphere",
    rating: 4.7,
    rating_count: 312,
    icon: "💡",
    prompt_template: "You are an expert educator. Explain the following concept in simple terms with examples: {input}",
    created_at: "2025-05-30",
  },
  {
    id: "9",
    name: "Logo Idea Generator",
    description: "Generate creative logo concepts and detailed descriptions for any brand or project.",
    category: "creative",
    developer_name: "DesignAI Studio",
    rating: 4.2,
    rating_count: 98,
    icon: "🎨",
    prompt_template: "You are a creative logo designer. Generate detailed logo concepts for: {input}",
    created_at: "2025-04-12",
  },
  {
    id: "10",
    name: "API Architect AI",
    description: "Design REST API architectures with endpoints, schemas, and best practices.",
    category: "coding",
    developer_name: "DevStack",
    rating: 4.6,
    rating_count: 178,
    icon: "🔗",
    prompt_template: "You are an API architecture expert. Design a REST API for: {input}",
    created_at: "2025-03-25",
  },
  {
    id: "11",
    name: "SEO Optimizer AI",
    description: "Analyze and optimize content for search engines with keyword suggestions and meta tags.",
    category: "marketing",
    developer_name: "GrowthLab",
    rating: 4.5,
    rating_count: 167,
    icon: "🔍",
    prompt_template: "You are an SEO expert. Analyze and optimize the following for search engines: {input}",
    created_at: "2025-02-14",
  },
  {
    id: "12",
    name: "Email Campaign AI",
    description: "Draft email marketing campaigns with subject lines, body content, and CTAs.",
    category: "marketing",
    developer_name: "MailGenius",
    rating: 4.4,
    rating_count: 134,
    icon: "📧",
    prompt_template: "You are an email marketing expert. Create an email campaign for: {input}",
    created_at: "2025-01-08",
  },
];

export function getAgentById(id: string): Agent | undefined {
  return DEMO_AGENTS.find((a) => a.id === id);
}

export function getFeaturedAgents(): Agent[] {
  return DEMO_AGENTS.filter((a) => a.featured);
}

export function getTopRatedAgents(limit = 5): Agent[] {
  return [...DEMO_AGENTS].sort((a, b) => b.rating - a.rating).slice(0, limit);
}

export function searchAgents(query: string, category?: string): Agent[] {
  let results = DEMO_AGENTS;
  if (category && category !== "all") {
    results = results.filter((a) => a.category === category);
  }
  if (query.trim()) {
    const q = query.toLowerCase();
    results = results.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q)
    );
  }
  return results;
}

export function getRecommendedAgents(query: string): Agent[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  return DEMO_AGENTS.filter(
    (a) =>
      a.name.toLowerCase().includes(q) ||
      a.description.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q) ||
      a.prompt_template.toLowerCase().includes(q)
  ).slice(0, 3);
}
