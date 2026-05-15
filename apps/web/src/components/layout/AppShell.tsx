"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((c) => !c)}
      />
      <div
        className={cn(
          "flex flex-1 flex-col overflow-hidden transition-all duration-300",
          sidebarCollapsed ? "ml-[60px]" : "ml-[240px]"
        )}
      >
        <TopBar />
        <main className="flex-1 overflow-y-auto scrollbar-hidden">
          <div className="mx-auto max-w-screen-2xl p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
