import type { Metadata } from "next";
import { SettingsPage } from "@/components/intelligence/SettingsPage";

export const metadata: Metadata = { title: "Settings" };

export default function Settings() {
  return <SettingsPage />;
}
