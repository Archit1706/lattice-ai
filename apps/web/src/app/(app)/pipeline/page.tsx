import type { Metadata } from "next";
import { DealPipelinePage } from "@/components/intelligence/DealPipelinePage";

export const metadata: Metadata = { title: "Deal Pipeline" };

export default function PipelinePage() {
  return <DealPipelinePage />;
}
