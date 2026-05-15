"use client";

import { useState } from "react";
import {
  Settings, Key, Plug, Bell, Shield, Database,
  Check, Eye, EyeOff, ChevronRight, Zap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const INTEGRATIONS = [
  { id: "gmail", label: "Gmail", description: "Sync emails and extract relationship signals", icon: "✉", connected: false },
  { id: "gcal", label: "Google Calendar", description: "Import meeting history and schedule context", icon: "📅", connected: false },
  { id: "slack", label: "Slack", description: "Monitor deal threads and team signals", icon: "💬", connected: false },
  { id: "notion", label: "Notion", description: "Sync research notes and deal memos", icon: "📝", connected: false },
  { id: "crunchbase", label: "Crunchbase", description: "Enrich company data and funding history", icon: "📊", connected: false },
  { id: "linkedin", label: "LinkedIn", description: "Relationship enrichment and founder data", icon: "💼", connected: false },
];

const NAV = [
  { id: "api-keys", label: "API Keys", icon: Key },
  { id: "integrations", label: "Integrations", icon: Plug },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "data", label: "Data & Storage", icon: Database },
];

export function SettingsPage() {
  const [activeSection, setActiveSection] = useState("api-keys");
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});

  const toggleKey = (key: string) =>
    setShowKeys((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Configure integrations, API keys, and platform preferences
        </p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Sidebar nav */}
        <nav className="col-span-3 space-y-1">
          {NAV.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  activeSection === item.id
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
                <ChevronRight className="h-3.5 w-3.5 ml-auto" />
              </button>
            );
          })}
        </nav>

        {/* Content */}
        <div className="col-span-9 space-y-4">
          {activeSection === "api-keys" && (
            <>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Key className="h-4 w-4 text-primary" />
                    <CardTitle>AI Provider Keys</CardTitle>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Stored securely server-side. Never exposed to the client.
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { label: "Anthropic API Key", key: "anthropic", placeholder: "sk-ant-...", hint: "Used for meeting briefs, entity extraction, signal classification" },
                    { label: "OpenAI API Key", key: "openai", placeholder: "sk-...", hint: "Used for embeddings and vector memory indexing" },
                  ].map((item) => (
                    <div key={item.key}>
                      <label className="text-xs font-medium mb-1.5 block">{item.label}</label>
                      <div className="relative">
                        <Input
                          type={showKeys[item.key] ? "text" : "password"}
                          placeholder={item.placeholder}
                          className="pr-10 font-mono text-xs"
                          defaultValue="sk-ant-••••••••••••••••••••••••"
                        />
                        <button
                          onClick={() => toggleKey(item.key)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showKeys[item.key] ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-1">{item.hint}</p>
                    </div>
                  ))}
                  <Button size="sm" variant="nexus" className="gap-1.5 text-xs">
                    <Check className="h-3.5 w-3.5" />Save Keys
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-primary" />
                    <CardTitle>Database Connections</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { label: "PostgreSQL", value: "postgresql://localhost:5432/sago_nexus", status: "connected" },
                    { label: "Neo4j Graph DB", value: "bolt://localhost:7687", status: "connected" },
                    { label: "Weaviate Vector DB", value: "http://localhost:8080", status: "connected" },
                    { label: "Redis Cache", value: "redis://localhost:6379", status: "connected" },
                  ].map((db) => (
                    <div key={db.label} className="flex items-center justify-between rounded-lg bg-muted/30 px-3 py-2.5">
                      <div>
                        <p className="text-xs font-medium">{db.label}</p>
                        <p className="text-[10px] text-muted-foreground font-mono">{db.value}</p>
                      </div>
                      <Badge variant="success" className="text-[10px] gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        {db.status}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </>
          )}

          {activeSection === "integrations" && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Plug className="h-4 w-4 text-primary" />
                  <CardTitle>Integrations</CardTitle>
                </div>
                <p className="text-xs text-muted-foreground">
                  Connect external tools to enrich your intelligence graph
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                {INTEGRATIONS.map((integration) => (
                  <div
                    key={integration.id}
                    className="flex items-center justify-between rounded-lg border border-border p-4 hover:border-primary/20 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{integration.icon}</span>
                      <div>
                        <p className="text-sm font-medium">{integration.label}</p>
                        <p className="text-[11px] text-muted-foreground">{integration.description}</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant={integration.connected ? "secondary" : "outline"}
                      className="text-xs gap-1.5"
                    >
                      {integration.connected ? (
                        <><Check className="h-3 w-3 text-emerald-400" />Connected</>
                      ) : (
                        <><Plug className="h-3 w-3" />Connect</>
                      )}
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {activeSection === "notifications" && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-primary" />
                  <CardTitle>Signal Notifications</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: "High-priority signals", description: "Funding events and hiring spikes above threshold", enabled: true },
                  { label: "Dormant relationship alerts", description: "Contacts you haven't engaged with in 30+ days", enabled: true },
                  { label: "Portfolio company signals", description: "News and hiring changes at portfolio companies", enabled: true },
                  { label: "Thesis-matched new companies", description: "Newly discovered companies matching your thesis", enabled: false },
                  { label: "Weekly intelligence digest", description: "Summary of signals and opportunities every Monday", enabled: true },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-[11px] text-muted-foreground">{item.description}</p>
                    </div>
                    <div className={`h-5 w-9 rounded-full transition-colors cursor-pointer ${item.enabled ? "bg-primary" : "bg-muted"}`}>
                      <div className={`h-4 w-4 rounded-full bg-white m-0.5 transition-transform ${item.enabled ? "translate-x-4" : "translate-x-0"}`} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {(activeSection === "security" || activeSection === "data") && (
            <Card>
              <CardHeader>
                <CardTitle className="capitalize">{activeSection.replace("-", " & ")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 rounded-lg border border-dashed border-border p-6">
                  <Zap className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Coming soon</p>
                    <p className="text-xs text-muted-foreground">
                      {activeSection === "security"
                        ? "RBAC, audit logs, and SSO configuration"
                        : "Data export, retention policies, and backup configuration"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
