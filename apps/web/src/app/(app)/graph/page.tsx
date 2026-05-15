import type { Metadata } from "next";
import { GraphExplorerPage } from "@/components/graph/GraphExplorerPage";

export const metadata: Metadata = {
  title: "Relationship Graph",
};

export default function GraphPage() {
  return <GraphExplorerPage />;
}
