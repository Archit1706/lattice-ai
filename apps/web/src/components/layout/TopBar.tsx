"use client";

import { useState } from "react";
import { Search, Bell, Command, Sparkles } from "lucide-react";
import { CommandPalette } from "@/components/shared/CommandPalette";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function TopBar() {
  const [cmdOpen, setCmdOpen] = useState(false);

  return (
    <>
      <header className="flex h-14 items-center justify-between border-b border-border bg-card/50 backdrop-blur-sm px-6">
        <button
          onClick={() => setCmdOpen(true)}
          className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors min-w-[200px]"
        >
          <Search className="h-3.5 w-3.5" />
          <span>Search intelligence...</span>
          <div className="ml-auto flex items-center gap-1">
            <kbd className="flex h-5 items-center gap-0.5 rounded border border-border bg-background px-1.5 text-[10px] font-medium">
              <Command className="h-2.5 w-2.5" />K
            </kbd>
          </div>
        </button>

        <div className="flex items-center gap-2">
          {/* AI Copilot indicator */}
          <div className="flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-2.5 py-1">
            <Sparkles className="h-3 w-3 text-primary animate-pulse-slow" />
            <span className="text-[11px] font-medium text-primary">AI Active</span>
          </div>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative h-8 w-8">
            <Bell className="h-4 w-4" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-primary" />
          </Button>

          {/* Avatar */}
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-lattice text-xs font-semibold text-white">
            VC
          </div>
        </div>
      </header>

      <CommandPalette open={cmdOpen} onOpenChange={setCmdOpen} />
    </>
  );
}
