"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Brain, FileText, Mail, Calendar,
  MessageSquare, Clock, ChevronRight, Sparkles, Database,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useMemorySearch } from "@/lib/hooks/useIntelligence";
import { formatRelativeTime } from "@/lib/utils";

const typeConfig = {
  meeting: { icon: Calendar, color: "text-primary", bg: "bg-primary/10" },
  memo: { icon: FileText, color: "text-amber-400", bg: "bg-amber-400/10" },
  email: { icon: Mail, color: "text-emerald-400", bg: "bg-emerald-400/10" },
  note: { icon: MessageSquare, color: "text-sky-400", bg: "bg-sky-400/10" },
  transcript: { icon: MessageSquare, color: "text-purple-400", bg: "bg-purple-400/10" },
};

const SUGGESTED_QUERIES = [
  "What did Sarah Chen say about Anthropic?",
  "LLM inference optimization competitive landscape",
  "Marcus Williams robotics diligence notes",
  "AI Infrastructure thesis criteria",
  "Portfolio companies with GPU dependencies",
];

export function MemorySearchPage() {
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState("");
  const { mutate: search, data, isPending } = useMemorySearch();

  const handleSearch = (q: string) => {
    if (!q.trim()) return;
    setSubmitted(q);
    search({ query: q, limit: 10 });
  };

  const results = data?.results ?? [];
  const hasResults = submitted && !isPending;

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
              disabled={isPending || !query.trim()}
              className="gap-2 px-6"
            >
              {isPending ? <Sparkles className="h-4 w-4 animate-spin" /> : <Brain className="h-4 w-4" />}
              {isPending ? "Searching..." : "Search Memory"}
            </Button>
          </div>

          {!submitted && (
            <div className="mt-4">
              <p className="text-[11px] text-muted-foreground mb-2">Try searching for:</p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_QUERIES.map((q) => (
                  <button
                    key={q}
                    onClick={() => { setQuery(q); handleSearch(q); }}
                    className="flex items-center gap-1.5 rounded-full border border-border bg-muted/50 px-3 py-1 text-[11px] text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  >
                    <ChevronRight className="h-2.5 w-2.5" />{q}
                  </button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      <AnimatePresence>
        {hasResults && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {results.length} results for &ldquo;{submitted}&rdquo;
                {data?.search_time_ms && (
                  <span className="ml-1 text-muted-foreground/50">
                    ({Math.round(data.search_time_ms)}ms)
                  </span>
                )}
              </p>
              <Badge variant="secondary" className="text-[10px]">Semantic + Keyword</Badge>
            </div>

            {results.length === 0 ? (
              <Card>
                <CardContent className="py-10 text-center text-sm text-muted-foreground">
                  No results found. Try different keywords.
                </CardContent>
              </Card>
            ) : (
              results.map((result, idx) => {
                const type = result.doc_type as keyof typeof typeConfig;
                const config = typeConfig[type] ?? typeConfig.note;
                const Icon = config.icon;
                return (
                  <motion.div
                    key={result.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
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
                              <Badge variant="secondary" className="text-[10px] capitalize">{result.doc_type}</Badge>
                            </div>
                            <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
                              {result.excerpt}
                            </p>
                            <div className="flex items-center gap-3 mt-2 flex-wrap">
                              <div className="flex gap-1">
                                {result.entities.slice(0, 3).map((e) => (
                                  <Badge key={e} variant="outline" className="text-[10px]">{e}</Badge>
                                ))}
                              </div>
                              <div className="flex items-center gap-1 text-[10px] text-muted-foreground ml-auto">
                                <Clock className="h-2.5 w-2.5" />
                                {formatRelativeTime(result.date)}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1 flex-shrink-0">
                            <span className="text-[11px] text-primary font-semibold">
                              {Math.round(result.relevance_score * 100)}%
                            </span>
                            <span className="text-[9px] text-muted-foreground">relevance</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
