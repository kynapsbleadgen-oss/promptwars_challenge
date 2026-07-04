import { Link, useRouterState } from "@tanstack/react-router";
import {
  Compass,
  BookOpen,
  Map,
  User,
  Users,
  BarChart2,
  FileText,
  Brain,
  GraduationCap,
  LayoutDashboard,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { cn } from "../../lib/utils";

interface NavItem {
  to: string;
  label: string;
  icon: React.ReactNode;
  roles?: string[];
}

const NAV_ITEMS: NavItem[] = [
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard className="h-4 w-4" />,
  },
  {
    to: "/discover",
    label: "Discover",
    icon: <Compass className="h-4 w-4" />,
  },
  {
    to: "/trips",
    label: "My Trips",
    icon: <Map className="h-4 w-4" />,
  },
  {
    to: "/itineraries",
    label: "Itineraries",
    icon: <BookOpen className="h-4 w-4" />,
    roles: ["teacher", "mentor", "admin", "director"],
  },
  // Teacher / Mentor
  {
    to: "/teacher/itineraries",
    label: "My Itineraries",
    icon: <GraduationCap className="h-4 w-4" />,
    roles: ["teacher", "mentor"],
  },
  // Director
  {
    to: "/director/overview",
    label: "Team Overview",
    icon: <Users className="h-4 w-4" />,
    roles: ["director", "admin"],
  },
  {
    to: "/director/reports",
    label: "Reports",
    icon: <FileText className="h-4 w-4" />,
    roles: ["director", "admin"],
  },
  // Admin
  {
    to: "/admin/users",
    label: "User Management",
    icon: <Users className="h-4 w-4" />,
    roles: ["admin"],
  },
  {
    to: "/admin/analytics",
    label: "Analytics",
    icon: <BarChart2 className="h-4 w-4" />,
    roles: ["admin"],
  },
  {
    to: "/admin/ai-logs",
    label: "AI Logs",
    icon: <Brain className="h-4 w-4" />,
    roles: ["admin"],
  },
  // Profile — everyone
  {
    to: "/profile",
    label: "Profile",
    icon: <User className="h-4 w-4" />,
  },
];

export function Sidebar() {
  const { user } = useAuth();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const visible = NAV_ITEMS.filter(
    (item) =>
      !item.roles || (user && item.roles.includes(user.role)),
  );

  return (
    <aside className="flex h-full w-56 flex-col border-r border-border bg-card">
      {/* Logo */}
      <div className="border-b border-border px-5 py-5">
        <span className="font-serif text-xl font-semibold tracking-tight text-foreground">
          Way<span className="italic text-gold-ink">fare</span>
        </span>
        <p className="mt-0.5 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          AI Travel Platform
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-0.5">
          {visible.map((item) => {
            const active = currentPath.startsWith(item.to);
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={cn(
                    "flex items-center gap-2.5 rounded px-3 py-2 text-sm transition-colors",
                    active
                      ? "bg-[color:var(--gold-soft)] font-medium text-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                  )}
                >
                  {item.icon}
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User chip */}
      {user && (
        <div className="border-t border-border px-4 py-3">
          <p className="truncate text-xs font-medium text-foreground">{user.name}</p>
          <p className="truncate text-[10px] capitalize text-muted-foreground">
            {user.role}
          </p>
        </div>
      )}
    </aside>
  );
}
