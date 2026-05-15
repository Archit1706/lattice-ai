import type { Metadata } from "next";
import { SignalsPage } from "@/components/intelligence/SignalsPage";

export const metadata: Metadata = { title: "Signal Feed" };

export default function Signals() {
  return <SignalsPage />;
}
