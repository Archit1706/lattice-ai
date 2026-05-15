import type { Metadata } from "next";
import { MeetingIntelligencePage } from "@/components/intelligence/MeetingIntelligencePage";

export const metadata: Metadata = {
  title: "Meeting Intelligence",
};

export default function MeetingsPage() {
  return <MeetingIntelligencePage />;
}
