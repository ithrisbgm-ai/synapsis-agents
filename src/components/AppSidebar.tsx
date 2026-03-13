import { Link, useLocation } from "react-router-dom";
import { Home, Store, Layers, Code2, Trophy, Bot } from "lucide-react";

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
    <aside className="fixed left-0 top-0 z-40 flex h-full w-60 flex-col border-r border-border bg-sidebar">
      <div className="flex h-16 items-center gap-2.5 border-b border-border px-5">
        <Bot className="h-7 w-7 text-primary" />
        <span className="text-lg font-bold gradient-text">AgentHub</span>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-sidebar-accent text-foreground gradient-bg-subtle"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-4">
        <div className="rounded-lg gradient-bg-subtle p-3">
          <p className="text-xs font-medium text-foreground">AI Agents Platform</p>
          <p className="mt-1 text-xs text-muted-foreground">Discover & run AI agents</p>
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;
