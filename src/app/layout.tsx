import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import { SidebarProvider } from "../context/SidebarContext";
import Sidebar from "@/components/Sidebar";

export const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Phoenix Breath",
  description: "Rise from the ashes with AI-guided breathwork.",
  // basePath isn't auto-applied to the manifest link, so prefix it ourselves.
  manifest: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/manifest.json`,
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Phoenix Breath",
  },
};

// Next.js 16 requires viewport in its own export (it is ignored inside `metadata`).
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#0a0a0a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <AuthProvider>
          <SidebarProvider>
            <div id="app-root">
              <Sidebar />
              {children}
            </div>
          </SidebarProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
