"use client";

import React from "react";
import Link from "next/link";
import { useVocabulary } from "@/context/VocabularyContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookOpen,
  faClone,
  faCircleQuestion,
  faGamepad,
  faFolderOpen,
  faMoon,
  faSun,
  faFire,
  faGraduationCap,
  faHeadphones,
} from "@fortawesome/free-solid-svg-icons";

interface NavbarProps {
  activeSection?: "vocabulary" | "speaking";
}

export default function Navbar({ activeSection = "vocabulary" }: NavbarProps) {
  const { activeTab, setActiveTab, theme, toggleTheme, streak, mastered, words } = useVocabulary();

  const vocabTabs = [
    { id: "all", label: "শব্দ তালিকা (All Words)", icon: faBookOpen },
    { id: "flashcards", label: "ফ্ল্যাশ কার্ড (Flashcards)", icon: faClone },
    { id: "quiz", label: "কুইজ (Quiz)", icon: faCircleQuestion },
    { id: "match", label: "ম্যাচিং গেম (Match)", icon: faGamepad },
    { id: "sets", label: "স্টাডি সেট (Sets)", icon: faFolderOpen },
  ] as const;

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 sm:gap-2.5 cursor-pointer group shrink-0"
            title="VocabMaster Home"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <FontAwesomeIcon icon={faGraduationCap} className="text-sm sm:text-lg" />
            </div>
            <div className="hidden xs:block">
              <span className="font-extrabold text-base sm:text-xl tracking-tight bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                VocabMaster
              </span>
            </div>
          </Link>

          {/* Primary Navigation: Vocabulary & Speaking Part 1 */}
          <nav className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl gap-1">
            <Link
              href="/"
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all min-h-[36px] active:scale-95 ${
                activeSection === "vocabulary"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <FontAwesomeIcon icon={faBookOpen} className="text-xs" />
              <span>Vocabulary</span>
            </Link>

            <Link
              href="/speaking"
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all min-h-[36px] active:scale-95 ${
                activeSection === "speaking"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <FontAwesomeIcon icon={faHeadphones} className="text-xs" />
              <span>Speaking Part 1</span>
            </Link>
          </nav>

          {/* Right Action Icons: Streak & Theme */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Streak Counter */}
            <div
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/50 border border-amber-200/70 dark:border-amber-800/60 text-amber-700 dark:text-amber-300 text-xs sm:text-sm font-semibold"
              title={`${streak} day study streak!`}
            >
              <FontAwesomeIcon icon={faFire} className="text-amber-500 text-xs sm:text-sm" />
              <span>{streak}d</span>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle Dark Mode"
              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <FontAwesomeIcon icon={theme === "dark" ? faSun : faMoon} className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Vocabulary Feature Subnav - Only shown on Vocabulary page */}
        {activeSection === "vocabulary" && (
          <div className="flex items-center py-2 border-t border-slate-200/70 dark:border-slate-800 overflow-x-auto gap-1.5 no-scrollbar touch-pan-x px-0.5">
            {vocabTabs.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all active:scale-95 shrink-0 ${
                    isActive
                      ? "bg-emerald-600 text-white font-bold shadow-xs"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 bg-slate-100/60 dark:bg-slate-800/40"
                  }`}
                >
                  <FontAwesomeIcon icon={item.icon} className="text-xs" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
}
