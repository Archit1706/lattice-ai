"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Brain,
  FileText,
  Mail,
  Calendar,
  MessageSquare,
  Clock,
  ChevronRight,
  Sparkles,
  Database,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatRelativeTime } from "@/lib/utils";

interface MemoryResult {
  id: string;
  type: "memo" | "email" | "meeting" | "note";
  title: string;
  excerpt: string;
  entities: string[];
  relevanceScore: number;
  date: string;
  source: string;
}

const MEMORY_RESULTS: MemoryResult[] = [
  {
    id: "1",
    type: "meeting",
    title: "Series A Discussion — Luminary AI (Oct 2024)",
    excerpt: "Sarah shared that inference cost is the primary blocker for LLM adoption at scale. They've achieved 40% cost reduction through kernel-level optimizations. The team has 3 PhDs from top labs. She mentioned Anthropic as a design partner but couldn't share ARR.",
    entities: ["Sarah Chen", "Luminary AI", "Anthropic"],
    relevanceScore: 0.97,
    date: new Date(Date.now() - 86400000 * 45).toISOString(),
    source: "Meeting transcript",
  },
  {
    id: "2",
    type: "memo",
    title: "AI Infrastructure Thesis — Q4 2024 Update",
    excerpt: "The inference optimization market is projected to reach $12B by 2027. Key players include startups in CUDA optimization, speculative decoding, and model distillation. Luminary AI and 2 others are positioned in the sweet spot.",
    entities: ["AI Infrastructure", "Luminary AI"],
    relevanceScore: 0.92,
    date: new Date(Date.now() - 86400000 * 30).toISOString(),
    source: "Research memo",
  },
  {
    id: "3",
    type: "email",
    title: "Follow-up: Nexus Robotics technical diligence",
    excerpt: "Marcus confirmed that the autonomous warehouse navigation system has been deployed in 3 Toyota facilities. Monthly recurring revenue is $180K. Primary concern remains sensor cost — LIDAR at $2K/unit is still too expensive for SMB market.",
    entities: ["Marcus Williams", "Nexus Robotics", "Toyota"],
    relevanceScore: 0.88,
    date: new Date(Date.now() - 86400000 * 10).toISOString(),
    source: "Email thread",
  },
  {
    id: "4",
    type: "note",
    title: "Partner Meeting Notes — DeepVault",
    excerpt: "Priya presented impressive enterprise pipeline — 3 Fortune 500 companies in POC. The security model is differentiated: real-time behavioral analysis vs. signature-based detection. Biggest risk: customer concentration — top 2 accounts = 60% revenue.",
    entities: ["Priya Sharma", "DeepVault"],
    relevanceScore: 0.84,
    date: new Date(Date.now() - 86400000 * 20).toISOString(),
    source: "Partner notes",
  },
];

const typeConfig = {
  meeting: { icon: Calendar, color: "text-primary", bg: "bg-primary/10" },
  memo: { icon: FileText, color: "text-amber-400", bg: "bg-amber-400/10" },
  email: { icon: Mail, color: "text-emerald-400", bg: "bg-emerald-400/10" },
  note: { icon: MessageSquare, color: "text-sky-400", bg: "bg-sky-400/10" },
};

const SUGGESTED_QUERIES = [
  "What did Sarah Chen say about Anthropic?",
  "LLM inference optimization competitive landscape",
  "Marcus Williams robotics diligence notes",
  "AI Infrastructure thesis thesis criteria",
  "Portfolio companies with GPU dependencies",
];

export function MemorySearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<MemoryResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (q: string) => {
    if (!q.trim()) return;
    setQuery(q);
    setSearching(true);
    setHasSearched(false);
    await new Promise((r) => setTimeout(r, 1200));
    setResults(MEMORY_RESULTS.filter(r =>
      q.toLowerCase().split(" ").some(word =>
        r.title.toLowerCase().includes(word) ||
        r.excerpt.toLowerCase().includes(word) ||
        r.entities.some(e => e.toLowerCase().includes(word))
      )
    ).length > 0 ? MEMORY_RESULTS : MEMORY_RESULTS);
    setSearching(false);
    setHasSearched(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Institutional Memory</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Semantic search across all meetings, memos, emails, and notes
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Documents Indexed", value: "4,821", icon: Database },
          { label: "Meeting Transcripts", value: "312", icon: Calendar },
          { label: "Research Memos", value: "89", icon: FileText },
          { label: "Email Threads", value: "1,247", icon: Mail },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-lg font-bold">{stat.value}</p>
                  <p className="text-[11px] text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Search */}
      <Card className="border-primary/20">
        <CardContent className="p-6">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                className="flex h-11 w-full rounded-lg border border-input bg-transparent pl-10 pr-4 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                placeholder='e.g. "What did Sarah Chen say about inference costs?"'
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch(query)}
              />
            </div>
            <Button
              variant="nexus"
              onClick={() => handleSearch(query)}
              disabled={searching || !query.trim()}
              className="gap-2 px-6"
            >
              {searching ? (
                <Sparkles className="h-4 w-4 animate-spin" />
              ) : (
                <Brain className="h-4 w-4" />
              )}
              {searching ? "Searching..." : "Search Memory"}
            </Button>
          </div>

          {/* Suggested queries */}
          {!hasSearched && (
            <div className="mt-4">
              <p className="text-[11px] text-muted-foreground mb-2">Try searching for:</p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_QUERIES.map((q) => (
                  <button
                    key={q}
                    onClick={() => handleSearch(q)}
                    className="flex items-center gap-1.5 rounded-full border border-border bg-muted/50 px-3 py-1 text-[11px] text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  >
                    <ChevronRight className="h-2.5 w-2.5" />
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      <AnimatePresence>
        {hasSearched && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {results.length} results for &ldquo;{query}&rdquo;
              </p>
              <Badge variant="secondary" className="text-[10px]">
                Semantic + Keyword
              </Badge>
            </div>
            {results.map((result, idx) => {
              const config = typeConfig[result.type];
              const Icon = config.icon;
              return (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.06 }}
                >
                  <Card className="group hover:border-primary/30 transition-all cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ${config.bg}`}>
                          <Icon className={`h-4 w-4 ${config.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="text-sm font-semibold">{result.title}</span>
                            <Badge variant="secondary" className="text-[10px] capitalize">
                              {result.type}
                            </Badge>
                          </div>
                          <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
                            {result.excerpt}
                          </p>
                          <div className="flex items-center gap-3 mt-2 flex-wrap">
                            <div className="flex gap-1">
                              {result.entities.map((e) => (
                                <Badge key={e} variant="outline" className="text-[10px]">
                                  {e}
                                </Badge>
                              ))}
                            </div>
                            <div className="flex items-center gap-1 text-[10px] text-muted-foreground ml-auto">
                              <Clock className="h-2.5 w-2.5" />
                              {formatRelativeTime(result.date)}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1 flex-shrink-0">
                          <div className="text-[11px] text-primary font-semibold">
                            {Math.round(result.relevanceScore * 100)}%
                          </div>
                          <div className="text-[9px] text-muted-foreground">relevance</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
