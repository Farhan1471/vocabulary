import type { Metadata, Viewport } from "next";
import { Inter, Hind_Siliguri } from "next/font/google";
import "./globals.css";
import { VocabularyProvider } from "@/context/VocabularyContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const hindSiliguri = Hind_Siliguri({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["bengali", "latin"],
  variable: "--font-bangla",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#059669" },
    { media: "(prefers-color-scheme: dark)", color: "#022c22" },
  ],
};

export const metadata: Metadata = {
  title: "VocabMaster | 295 Essential Words with Bangla & Synonyms",
  description:
    "Master 295 essential English vocabulary words with easy Bangla meanings, synonyms, interactive flashcards, pronunciation, and quizzes.",
  keywords: [
    "vocabulary",
    "bangla vocabulary",
    "english to bangla",
    "synonyms",
    "flashcards",
    "gre vocabulary",
    "bcs vocabulary",
  ],
  authors: [{ name: "Vocabulary Hub" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${hindSiliguri.variable} scroll-smooth`}>
      <head>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>📖</text></svg>"
        />
      </head>
      <body className="font-sans min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200">
        <VocabularyProvider>{children}</VocabularyProvider>
      </body>
    </html>
  );
}
