"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText, Plus, Search, Tag, Brain,
  Calendar, Building2, Star, ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useMemos, useCreateMemo } from "@/lib/hooks/useMemos";
import { formatRelativeTime } from "@/lib/utils";

const MEMO_TYPES = ["all", "research", "diligence", "thesis", "note"];

const memoTypeColor: Record<string, string> = {
  research: "text-primary bg-primary/10",
  diligence: "text-amber-400 bg-amber-400/10",
  thesis: "text-emerald-400 bg-emerald-400/10",
  note: "text-sky-400 bg-sky-400/10",
};

export function MemosPage() {
  const [search, setSearch] = useState("");
  const [memoType, setMemoType] = useState("all");
  const [selected, setSelected] = useState<string | null>(null);

  const { data, isLoading } = useMemos({
    search: search || undefined,
    memo_type: memoType === "all" ? undefined : memoType,
    limit: 50,
  });
  const memos = data?.memos ?? [];
  const selectedMemo = memos.find((m) => m.id === selected);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">AI Research Memos</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {data ? `${data.total} memos` : "Loading..."} — investment research and diligence notes
          </p>
        </div>
        <Button size="sm" variant="nexus" className="gap-1.5 text-xs">
          <Plus className="h-3.5 w-3.5" />New Memo
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search memos..."
            className="pl-8 h-8 text-xs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-1">
          {MEMO_TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setMemoType(t)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition-colors ${memoType === t ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* List */}
        <div className={`${selected ? "col-span-5" : "col-span-12"} space-y-3`}>
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <div className="h-20 bg-muted/30 animate-pulse rounded-lg" />
                  </CardContent>
                </Card>
              ))
            : memos.map((memo, idx) => (
                <motion.div
                  key={memo.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04 }}
                >
                  <Card
                    onClick={() => setSelected(selected === memo.id ? null : memo.id)}
                    className={`group cursor-pointer transition-all ${selected === memo.id ? "border-primary/40 bg-primary/5" : "hover:border-primary/20"}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${memoTypeColor[memo.memo_type ?? "note"] ?? "bg-muted text-muted-foreground"}`}>
                          <FileText className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-semibold line-clamp-1">{memo.title}</p>
                            <ChevronRight className={`h-4 w-4 text-muted-foreground flex-shrink-0 transition-transform ${selected === memo.id ? "rotate-90" : ""}`} />
                          </div>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            {memo.company_name && (
                              <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                <Building2 className="h-2.5 w-2.5" />{memo.company_name}
                              </div>
                            )}
                            {memo.memo_type && (
                              <Badge variant="secondary" className="text-[10px] capitalize">{memo.memo_type}</Badge>
                            )}
                            {memo.conviction_score != null && (
                              <div className="flex items-center gap-1 text-[10px]">
                                <Star className="h-2.5 w-2.5 text-amber-400" />
                                <span className="font-medium text-amber-400">{memo.conviction_score}%</span>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-3 mt-1">
                            {memo.tags.slice(0, 3).map((tag) => (
                              <div key={tag} className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                                <Tag className="h-2 w-2" />{tag}
                              </div>
                            ))}
                            <span className="text-[10px] text-muted-foreground ml-auto">
                              {formatRelativeTime(memo.updated_at)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
        </div>

        {/* Detail panel */}
        {selectedMemo && (
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            className="col-span-7"
          >
            <Card className="h-full">
              <CardHeader className="flex flex-row items-start justify-between pb-3">
                <div>
                  <CardTitle className="text-base">{selectedMemo.title}</CardTitle>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    {selectedMemo.company_name && (
                      <Badge variant="secondary" className="text-[10px]">{selectedMemo.company_name}</Badge>
                    )}
                    {selectedMemo.memo_type && (
                      <Badge variant="outline" className="text-[10px] capitalize">{selectedMemo.memo_type}</Badge>
                    )}
                    {selectedMemo.author && (
                      <span className="text-[10px] text-muted-foreground">by {selectedMemo.author}</span>
                    )}
                  </div>
                </div>
                {selectedMemo.conviction_score != null && (
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <div className="flex items-center gap-1">
                      <Brain className="h-3.5 w-3.5 text-primary" />
                      <span className="text-lg font-bold text-primary">{selectedMemo.conviction_score}%</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground">conviction</p>
                    <Progress value={selectedMemo.conviction_score} className="w-20" />
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-[11px] text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatRelativeTime(selectedMemo.created_at)}
                  </div>
                  {selectedMemo.tags.length > 0 && (
                    <div className="flex items-center gap-1 flex-wrap">
                      <Tag className="h-3 w-3" />
                      {selectedMemo.tags.map((t) => (
                        <span key={t} className="bg-muted rounded px-1.5 py-0.5">{t}</span>
                      ))}
                    </div>
                  )}
                </div>
                {selectedMemo.content ? (
                  <div className="prose prose-sm prose-invert max-w-none">
                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {selectedMemo.content}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">No content yet.</p>
                )}
                <div className="flex gap-2 mt-6">
                  <Button size="sm" variant="nexus" className="gap-1.5 text-xs">
                    <Brain className="h-3.5 w-3.5" />Enhance with AI
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs">Edit</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
