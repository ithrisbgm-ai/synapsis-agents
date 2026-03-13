import { Link, useLocation } from "react-router-dom";
import { Home, Store, Layers, Code2, Trophy, Bot, Zap } from "lucide-react";

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
    <aside className="fixed left-0 top-0 z-40 flex h-full w-64 flex-col border-r border-border bg-sidebar">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-5 border-b border-border">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-bg shadow-lg">
          <Bot className="h-5 w-5 text-white" />
        </div>
        <div>
          <span className="text-base font-bold gradient-text tracking-tight">Synapsis</span>
          <p className="text-[10px] text-muted-foreground leading-none mt-0.5">AI Agents Platform</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-1">
        <p className="px-3 mb-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
          Navigation
        </p>
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "gradient-bg text-white shadow-md shadow-primary/20"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
              }`}
            >
              <item.icon size={17} className={isActive ? "text-white" : "text-muted-foreground group-hover:text-foreground"} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-border p-4">
        <div className="rounded-xl gradient-bg-subtle border border-border p-3.5">
          <div className="flex items-center gap-2 mb-1">
            <Zap size={13} className="text-primary" />
            <p className="text-xs font-semibold text-foreground">Pro Plan</p>
          </div>
          <p className="text-[11px] text-muted-foreground">Unlock unlimited AI agents</p>
          <button className="mt-2.5 w-full rounded-lg gradient-bg py-1.5 text-[11px] font-semibold text-white transition-opacity hover:opacity-90">
            Upgrade Now
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;
