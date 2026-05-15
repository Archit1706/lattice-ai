import type { Metadata } from "next";
import { CompaniesPage } from "@/components/intelligence/CompaniesPage";

export const metadata: Metadata = { title: "Companies" };

export default function Companies() {
  return <CompaniesPage />;
}
