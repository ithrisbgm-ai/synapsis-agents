import { Link, useLocation } from "react-router-dom";
import { Home, Store, Layers, Code2, Trophy, Bot, Sparkles } from "lucide-react";

const NAV_ITEMS = [
  { path: "/", label: "Home", icon: Home },
  { path: "/marketplace", label: "Marketplace", icon: Store },
  { path: "/multi-agent", label: "Multi-Agent", icon: Layers },
  { path: "/developer", label: "Developers", icon: Code2 },
  { path: "/leaderboard", label: "Leaderboard", icon: Trophy },
];

const AppSidebar = () => {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-full w-60 flex-col border-r border-border sidebar-gradient">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-5 border-b border-border/50">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-bg shadow-lg">
          <Bot className="h-4.5 w-4.5 text-white" size={18} />
        </div>
        <span className="text-lg font-bold gradient-text">AgentHub</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-0.5 px-3 py-5">
        <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
          Navigation
        </p>
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "nav-item-active text-foreground pl-[10px]"
                  : "text-muted-foreground nav-item-hover hover:text-foreground"
              }`}
            >
              <item.icon
                size={16}
                className={isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground transition-colors"}
              />
              {item.label}
              {isActive && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full gradient-bg" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-border/50 p-4">
        <div className="rounded-xl gradient-bg-subtle border border-primary/10 p-3.5">
          <div className="flex items-center gap-2 mb-1.5">
            <Sparkles size={12} className="text-primary" />
            <p className="text-xs font-semibold text-foreground">AI Agents Platform</p>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Discover & run powerful AI agents
          </p>
          <div className="mt-2 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] text-emerald-400/80 font-medium">Online</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;
