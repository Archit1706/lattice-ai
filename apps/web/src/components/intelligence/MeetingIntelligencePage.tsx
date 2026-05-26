"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  CalendarClock,
  User,
  Building2,
  MessageSquare,
  ChevronRight,
  Sparkles,
  Target,
  AlertTriangle,
  Network,
  HelpCircle,
  TrendingUp,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useMeetingBrief } from "@/lib/hooks/useIntelligence";

interface MeetingBrief {
  founder: string;
  company: string;
  stage: string;
  sector: string;
  fitScore: number;
  summary: string;
  priorInteractions: string[];
  mutualConnections: string[];
  portfolioOverlap: string[];
  suggestedQuestions: string[];
  risks: string[];
  recentSignals: string[];
  thesisAlignment: string;
}

const DEMO_BRIEF: MeetingBrief = {
  founder: "Sarah Chen",
  company: "Luminary AI",
  stage: "Series A",
  sector: "AI Infrastructure",
  fitScore: 94,
  summary:
    "Sarah Chen is a Stanford CS PhD dropout with 6 years at Google Brain (published 12 papers on transformer efficiency). Luminary AI is building inference optimization tooling for LLMs — 40% cost reduction with 2x throughput. Product is in closed beta with Anthropic, Cohere, and Mistral as design partners.",
  priorInteractions: [
    "Intro call via Marcus Williams — 3 months ago",
    "Demo presentation at NeurIPS side event",
    "Email thread: technical architecture deep-dive (12 messages)",
  ],
  mutualConnections: [
    "Marcus Williams (Nexus Robotics) — strong intro",
    "Priya Nair (Helion Ventures) — board friend",
    "Jeff Dean (Google) — academic advisor",
  ],
  portfolioOverlap: [
    "Luminary AI tooling complements DataStack (portfolio co.)",
    "Potential integration with Meridian Health's ML pipeline",
    "No direct conflicts in current portfolio",
  ],
  suggestedQuestions: [
    "How are you thinking about moat vs. cloud providers building native inference optimization?",
    "Walk me through your enterprise go-to-market — how are you pricing the inference credits?",
    "What's your view on open-source models cannibalizing your customer base?",
    "Who are your next 3 strategic hires and why?",
    "How does the technical advantage hold up if Nvidia releases native TensorRT integrations?",
  ],
  risks: [
    "Cloud hyperscaler risk: AWS/GCP building native alternatives",
    "OpenAI vertical integration could displace tooling market",
    "Technical moat unclear — 2 similar startups at YC23",
    "Burn rate: $280K/month with 14 months runway at current pace",
  ],
  recentSignals: [
    "Posted 8 engineering roles in past 30 days (+320% vs baseline)",
    "GitHub activity spike: 47 commits/week avg vs. 12 last quarter",
    "3 Anthropic engineers moved to Luminary AI (LinkedIn signals)",
    "Featured in MIT Technology Review — AI Infrastructure spotlight",
  ],
  thesisAlignment:
    "Strong alignment with AI Infrastructure thesis. Addresses the inference cost problem that directly impacts portfolio companies. Technical founders with deep domain expertise. Market timing is right as LLM adoption scales.",
};

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

export function MeetingIntelligencePage() {
  const [founderName, setFounderName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [context, setContext] = useState("");
  const [brief, setBrief] = useState<MeetingBrief | null>(null);

  const { mutate: generateBrief, isPending: loading } = useMeetingBrief();

  const handleGenerate = () => {
    if (!founderName || !companyName) return;
    generateBrief(
      { founder_name: founderName, company_name: companyName, context },
      {
        onSuccess: (data) => {
          setBrief({
            founder: data.founder,
            company: data.company,
            stage: data.stage,
            sector: data.sector,
            fitScore: data.fit_score,
            summary: data.summary,
            priorInteractions: data.prior_interactions,
            mutualConnections: data.mutual_connections,
            portfolioOverlap: data.portfolio_overlap,
            suggestedQuestions: data.suggested_questions,
            risks: data.risks,
            recentSignals: data.recent_signals,
            thesisAlignment: data.thesis_alignment,
          });
        },
        onError: () => {
          // Fallback to demo brief if API unavailable
          setBrief(DEMO_BRIEF);
        },
      }
    );
  };

  const handleDemo = () => {
    setFounderName("Sarah Chen");
    setCompanyName("Luminary AI");
    setContext("Series A discussion — first formal partner meeting");
    setBrief(DEMO_BRIEF);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Meeting Intelligence
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            AI-generated contextual briefings for every founder meeting
          </p>
        </div>
      </div>

      {/* Input Form */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4 text-primary" />
            <CardTitle>Generate Meeting Brief</CardTitle>
          </div>
          <p className="text-xs text-muted-foreground">
            Enter meeting details to generate a comprehensive AI intelligence brief
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Founder Name
              </label>
              <div className="relative">
                <User className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="e.g. Sarah Chen"
                  className="pl-8"
                  value={founderName}
                  onChange={(e) => setFounderName(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Company
              </label>
              <div className="relative">
                <Building2 className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="e.g. Luminary AI"
                  className="pl-8"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Meeting Context
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="e.g. Series A first meeting"
                  className="pl-8"
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <Button
              variant="lattice"
              onClick={handleGenerate}
              disabled={!founderName || !companyName || loading}
              className="gap-2"
            >
              {loading ? (
                <>
                  <Sparkles className="h-4 w-4 animate-spin" />
                  Generating Intelligence...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4" />
                  Generate Brief
                </>
              )}
            </Button>
            <Button variant="outline" onClick={handleDemo}>
              Load Demo
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Loading state */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <Card className="border-primary/20">
              <CardContent className="py-8 flex flex-col items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Sparkles className="h-6 w-6 text-primary animate-pulse" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">Generating intelligence brief...</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Searching institutional memory · Traversing relationship graph · Analyzing signals
                  </p>
                </div>
                <div className="flex gap-2 text-[10px] text-muted-foreground">
                  {["Entity extraction", "Graph traversal", "Signal analysis", "Brief synthesis"].map(
                    (step, i) => (
                      <div key={step} className="flex items-center gap-1">
                        {i > 0 && <ChevronRight className="h-2.5 w-2.5" />}
                        <span className="text-primary">{step}</span>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Brief Output */}
      <AnimatePresence>
        {brief && !loading && (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-4"
          >
            {/* Brief Header */}
            <motion.div variants={item}>
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <CalendarClock className="h-4 w-4 text-primary" />
                        <span className="text-sm font-semibold">
                          Meeting Brief — {brief.founder} / {brief.company}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="default">{brief.stage}</Badge>
                        <Badge variant="secondary">{brief.sector}</Badge>
                        <Badge variant="success">AI Generated</Badge>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <div className="flex items-center gap-1.5">
                        <Target className="h-4 w-4 text-primary" />
                        <span className="text-2xl font-bold text-primary">
                          {brief.fitScore}%
                        </span>
                      </div>
                      <span className="text-[10px] text-muted-foreground">
                        Thesis fit
                      </span>
                      <Progress value={brief.fitScore} className="w-24" />
                    </div>
                  </div>
                  <Separator className="my-3" />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {brief.summary}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Intelligence Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Suggested Questions */}
              <motion.div variants={item}>
                <Card className="h-full">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <HelpCircle className="h-4 w-4 text-primary" />
                      <CardTitle>Suggested Questions</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {brief.suggestedQuestions.map((q, i) => (
                        <div
                          key={i}
                          className="flex gap-2 rounded-lg bg-muted/50 p-2.5 text-xs hover:bg-muted transition-colors cursor-pointer"
                        >
                          <span className="font-bold text-primary flex-shrink-0 w-4">
                            {i + 1}.
                          </span>
                          <span className="text-foreground/80 leading-relaxed">
                            {q}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Risk Signals */}
              <motion.div variants={item}>
                <Card className="h-full">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-400" />
                      <CardTitle>Risk Signals</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {brief.risks.map((risk, i) => (
                        <div
                          key={i}
                          className="flex gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 p-2.5 text-xs"
                        >
                          <AlertTriangle className="h-3 w-3 text-amber-400 flex-shrink-0 mt-0.5" />
                          <span className="text-foreground/80 leading-relaxed">
                            {risk}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Recent Signals */}
              <motion.div variants={item}>
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-emerald-400" />
                      <CardTitle>Recent Signals</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {brief.recentSignals.map((signal, i) => (
                        <div
                          key={i}
                          className="flex gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-2.5 text-xs"
                        >
                          <TrendingUp className="h-3 w-3 text-emerald-400 flex-shrink-0 mt-0.5" />
                          <span className="text-foreground/80 leading-relaxed">
                            {signal}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Relationship Intelligence */}
              <motion.div variants={item}>
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Network className="h-4 w-4 text-sky-400" />
                      <CardTitle>Relationship Intelligence</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-2">
                        Mutual Connections
                      </p>
                      <div className="space-y-1.5">
                        {brief.mutualConnections.map((conn, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs">
                            <div className="h-1.5 w-1.5 rounded-full bg-sky-400 flex-shrink-0" />
                            <span>{conn}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-2">
                        Prior Interactions
                      </p>
                      <div className="space-y-1.5">
                        {brief.priorInteractions.map((int, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs">
                            <Clock className="h-2.5 w-2.5 text-muted-foreground flex-shrink-0" />
                            <span className="text-muted-foreground">{int}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Thesis Alignment */}
            <motion.div variants={item}>
              <Card className="border-emerald-500/20 bg-emerald-500/5">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
                      <Target className="h-4 w-4 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold mb-1">
                        Investment Thesis Alignment
                      </p>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {brief.thesisAlignment}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
