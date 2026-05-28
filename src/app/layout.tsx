import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const themeInitializer = `
(function () {
  try {
    var savedTheme = window.localStorage.getItem("supportnest_theme");
    if (savedTheme === "sensory") {
      document.documentElement.dataset.theme = "sensory";
    }
  } catch (_) {}
})();
`;

export const metadata: Metadata = {
  title: "GeneTranslate — Understand Your Genetic Report",
  description:
    "Turn your genetic lab report into a plain-language summary, variant explanations, and questions for your genetic counselor — in under 60 seconds.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitializer }} />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
