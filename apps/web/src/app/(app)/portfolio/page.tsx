import type { Metadata } from "next";
import { PortfolioIntelligencePage } from "@/components/intelligence/PortfolioIntelligencePage";

export const metadata: Metadata = { title: "Portfolio Intelligence" };

export default function Portfolio() {
  return <PortfolioIntelligencePage />;
}
