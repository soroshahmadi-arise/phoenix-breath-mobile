import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import { SidebarProvider } from "../context/SidebarContext";
import Sidebar from "@/components/Sidebar";

export const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Phoenix Breath",
  description: "Rise from the ashes with AI-guided breathwork.",
  manifest: "/manifest.json",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0, viewport-fit=cover",
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
