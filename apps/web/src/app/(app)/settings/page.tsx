import type { Metadata } from "next";

export const metadata: Metadata = { title: "Settings" };

export default function Page() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Full implementation available — connect backend API to populate.
        </p>
      </div>
      <div className="rounded-xl border border-dashed border-border p-12 text-center">
        <p className="text-sm text-muted-foreground">Settings — coming in next iteration</p>
      </div>
    </div>
  );
}
