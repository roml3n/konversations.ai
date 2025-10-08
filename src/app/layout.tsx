import type { Metadata } from "next";
import { Geist, Instrument_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-instrument-sans",
});

export const metadata: Metadata = {
  title: "konversations.ai - AI-Powered Conversations",
  description:
    "Your intelligent conversation platform powered by AI. Experience natural, intelligent conversations with advanced AI technology.",
  keywords: [
    "AI",
    "conversations",
    "chatbot",
    "artificial intelligence",
    "natural language processing",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${instrumentSans.variable} font-feature-settings-[ss02] antialiased`}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}
