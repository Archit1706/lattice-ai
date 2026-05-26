"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Network,
  Briefcase,
  Users,
  Building2,
  CalendarClock,
  FileText,
  Zap,
  Search,
  PieChart,
  Settings,
  ChevronLeft,
  ChevronRight,
  Hexagon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const navItems = [
  {
    group: "Intelligence",
    items: [
      { href: "/dashboard", label: "Intelligence Hub", icon: LayoutDashboard },
      { href: "/graph", label: "Relationship Graph", icon: Network },
      { href: "/signals", label: "Signal Feed", icon: Zap },
      { href: "/memory", label: "Institutional Memory", icon: Search },
    ],
  },
  {
    group: "Deals",
    items: [
      { href: "/pipeline", label: "Deal Pipeline", icon: Briefcase },
      { href: "/founders", label: "Founders", icon: Users },
      { href: "/companies", label: "Companies", icon: Building2 },
    ],
  },
  {
    group: "Workspace",
    items: [
      { href: "/meetings", label: "Meeting Intelligence", icon: CalendarClock },
      { href: "/memos", label: "AI Research Memos", icon: FileText },
      { href: "/portfolio", label: "Portfolio Intelligence", icon: PieChart },
    ],
  },
  {
    group: "System",
    items: [{ href: "/settings", label: "Settings", icon: Settings }],
  },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <TooltipProvider delayDuration={0}>
      <motion.aside
        className="fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-border bg-card"
        animate={{ width: collapsed ? 60 : 240 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
      >
        {/* Logo */}
        <div className="flex h-14 items-center border-b border-border px-3">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-lattice">
              <Hexagon className="h-4 w-4 text-white" strokeWidth={2.5} />
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="text-sm font-semibold tracking-tight text-foreground whitespace-nowrap overflow-hidden"
                >
                  Lattice
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto scrollbar-hidden p-2">
          {navItems.map((group) => (
            <div key={group.group} className="mb-2">
              <AnimatePresence>
                {!collapsed && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60"
                  >
                    {group.group}
                  </motion.p>
                )}
              </AnimatePresence>
              {group.items.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/" && pathname.startsWith(item.href));
                const Icon = item.icon;

                const linkContent = (
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm font-medium transition-all duration-150",
                      "hover:bg-muted hover:text-foreground",
                      isActive
                        ? "bg-primary/10 text-primary border border-primary/20"
                        : "text-muted-foreground",
                      collapsed && "justify-center"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-4 w-4 flex-shrink-0",
                        isActive ? "text-primary" : "text-muted-foreground"
                      )}
                    />
                    <AnimatePresence>
                      {!collapsed && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: "auto" }}
                          exit={{ opacity: 0, width: 0 }}
                          className="overflow-hidden whitespace-nowrap"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Link>
                );

                if (collapsed) {
                  return (
                    <Tooltip key={item.href}>
                      <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                      <TooltipContent side="right" className="text-xs">
                        {item.label}
                      </TooltipContent>
                    </Tooltip>
                  );
                }

                return <div key={item.href}>{linkContent}</div>;
              })}
            </div>
          ))}
        </nav>

        {/* Collapse toggle */}
        <div className="border-t border-border p-2">
          <button
            onClick={onToggle}
            className={cn(
              "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground",
              "hover:bg-muted hover:text-foreground transition-colors",
              collapsed && "justify-center"
            )}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4 flex-shrink-0" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4 flex-shrink-0" />
                <span className="text-xs">Collapse</span>
              </>
            )}
          </button>
        </div>
      </motion.aside>
    </TooltipProvider>
  );
}
