import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/Navbar";
import ContactModalProvider from "@/components/ContactModalProvider";

const instrumentSans = localFont({
  src: [
    {
      path: "../../public/fonts/instrument-sans/InstrumentSans-VariableFont_wdth,wght.ttf",
      weight: "100 900",
      style: "normal",
    },
    {
      path: "../../public/fonts/instrument-sans/InstrumentSans-Italic-VariableFont_wdth,wght.ttf",
      weight: "100 900",
      style: "italic",
    },
  ],
  variable: "--font-instrument-sans",
  display: "swap",
});

const gotham = localFont({
  src: [
    {
      path: "../../public/fonts/gotham/Gotham-Light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/gotham/Gotham-Light-Italic.otf",
      weight: "300",
      style: "italic",
    },
    {
      path: "../../public/fonts/gotham/Gotham-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/gotham/Gotham-Regular-Italic.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../public/fonts/gotham/Gotham-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/gotham/Gotham-Medium-Italic.otf",
      weight: "500",
      style: "italic",
    },
    {
      path: "../../public/fonts/gotham/Gotham-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/gotham/Gotham-Bold-Italic.otf",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-gotham",
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
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${instrumentSans.variable} ${gotham.variable} antialiased tracking-tight mx-auto flex flex-col items-center snap-y snap-mandatory scroll-pt-18`}
      >
        <ContactModalProvider>
          <Navbar />
          {children}
        </ContactModalProvider>
      </body>
    </html>
  );
}
