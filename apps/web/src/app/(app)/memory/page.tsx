import type { Metadata } from "next";
import { MemorySearchPage } from "@/components/intelligence/MemorySearchPage";

export const metadata: Metadata = { title: "Institutional Memory" };

export default function MemoryPage() {
  return <MemorySearchPage />;
}
