"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const quickLinks = [
  { href: "/dashboard", label: "Intelligence Hub", icon: LayoutDashboard, group: "Navigation" },
  { href: "/graph", label: "Relationship Graph", icon: Network, group: "Navigation" },
  { href: "/pipeline", label: "Deal Pipeline", icon: Briefcase, group: "Navigation" },
  { href: "/founders", label: "Founders", icon: Users, group: "Navigation" },
  { href: "/companies", label: "Companies", icon: Building2, group: "Navigation" },
  { href: "/meetings", label: "Meeting Intelligence", icon: CalendarClock, group: "Navigation" },
  { href: "/memos", label: "AI Research Memos", icon: FileText, group: "Navigation" },
  { href: "/signals", label: "Signal Feed", icon: Zap, group: "Navigation" },
  { href: "/memory", label: "Institutional Memory", icon: Search, group: "Navigation" },
  { href: "/portfolio", label: "Portfolio Intelligence", icon: PieChart, group: "Navigation" },
  { href: "/settings", label: "Settings", icon: Settings, group: "Navigation" },
];

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);

  const filtered = quickLinks.filter(
    (item) =>
      !query ||
      item.label.toLowerCase().includes(query.toLowerCase()) ||
      item.group.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
      if (!open) return;
      if (e.key === "Escape") onOpenChange(false);
      if (e.key === "ArrowDown") setSelected((s) => Math.min(s + 1, filtered.length - 1));
      if (e.key === "ArrowUp") setSelected((s) => Math.max(s - 1, 0));
      if (e.key === "Enter" && filtered[selected]) {
        router.push(filtered[selected].href);
        onOpenChange(false);
        setQuery("");
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, onOpenChange, filtered, selected, router]);

  useEffect(() => {
    setSelected(0);
  }, [query]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]"
      onClick={() => onOpenChange(false)}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-xl border border-border bg-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pages, founders, companies..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
          <kbd className="text-[10px] text-muted-foreground border border-border rounded px-1.5 py-0.5">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No results found</p>
          ) : (
            <div>
              <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                Navigation
              </p>
              {filtered.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.href}
                    onClick={() => {
                      router.push(item.href);
                      onOpenChange(false);
                      setQuery("");
                    }}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-left transition-colors",
                      idx === selected
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    <span className="flex-1">{item.label}</span>
                    <ArrowRight className="h-3 w-3 opacity-50" />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border px-4 py-2 flex items-center gap-4">
          <span className="text-[10px] text-muted-foreground">
            <kbd className="border border-border rounded px-1">↑↓</kbd> navigate
          </span>
          <span className="text-[10px] text-muted-foreground">
            <kbd className="border border-border rounded px-1">↵</kbd> open
          </span>
        </div>
      </div>
    </div>
  );
}
