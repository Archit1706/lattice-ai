import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Toaster } from "sonner";
import { Providers } from "@/components/layout/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Sago Nexus — Venture Intelligence Platform",
    template: "%s | Sago Nexus",
  },
  description:
    "AI-native venture intelligence platform. Graph-powered relationship mapping, institutional memory, and proactive deal intelligence for modern VC firms.",
  keywords: [
    "venture capital",
    "AI",
    "graph intelligence",
    "CRM",
    "investment intelligence",
  ],
  authors: [{ name: "Sago Nexus" }],
  openGraph: {
    type: "website",
    siteName: "Sago Nexus",
    title: "Sago Nexus — Venture Intelligence Platform",
    description: "AI-native venture intelligence for modern VC firms.",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0f" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
  colorScheme: "dark light",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background font-sans antialiased">
        <Providers>
          {children}
          <Toaster
            position="bottom-right"
            theme="dark"
            richColors
            closeButton
          />
        </Providers>
      </body>
    </html>
  );
}
