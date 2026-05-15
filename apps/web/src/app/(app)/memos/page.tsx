import type { Metadata } from "next";
import { MemosPage } from "@/components/intelligence/MemosPage";

export const metadata: Metadata = { title: "AI Research Memos" };

export default function Memos() {
  return <MemosPage />;
}
