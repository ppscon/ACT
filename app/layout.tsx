import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ACT Training | Cognitive Test Practice",
  description:
    "Practise reasoning, mental arithmetic, error detection and spatial orientation with timed memorise-then-answer sessions.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
