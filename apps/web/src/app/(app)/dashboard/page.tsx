import type { Metadata } from "next";
import { DashboardPage } from "@/components/intelligence/DashboardPage";

export const metadata: Metadata = {
  title: "Intelligence Hub",
};

export default function Dashboard() {
  return <DashboardPage />;
}
