import type { Metadata } from "next";
import { FoundersPage } from "@/components/intelligence/FoundersPage";

export const metadata: Metadata = { title: "Founders" };

export default function Founders() {
  return <FoundersPage />;
}
