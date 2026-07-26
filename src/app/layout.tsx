import type { Metadata } from "next";
import localFont from "next/font/local";

import "./globals.css";
import "reactflow/dist/style.css";

import AssistantDock from "@/components/assistant/AssistantDock";
import AssistantLauncher from "@/components/assistant/AssistantLauncher";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    default: "KSP AI Platform",
    template: "%s | KSP AI Platform",
  },
  description:
    "Intelligent AI Platform for Karnataka State Police",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased">

        {children}

        {/* Global AI Assistant */}
        <AssistantLauncher />
        <AssistantDock />

      </body>
    </html>
  );
}