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

export default function Navbar() {
  const { activeTab, setActiveTab, theme, toggleTheme, streak, mastered, words } = useVocabulary();

  const navItems = [
    { id: "all", label: "শব্দ তালিকা (All Words)", icon: faBookOpen },
    { id: "flashcards", label: "ফ্ল্যাশ কার্ড (Flashcards)", icon: faClone },
    { id: "quiz", label: "কুইজ (Quiz)", icon: faCircleQuestion },
    { id: "match", label: "ম্যাচিং গেম (Match)", icon: faGamepad },
    { id: "sets", label: "স্টাডি সেট (Sets)", icon: faFolderOpen },
  ] as const;

  const percent = Math.round((mastered.length / words.length) * 100);

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2">
          {/* Logo */}
          <div
            className="flex items-center gap-2 sm:gap-3 cursor-pointer group shrink-0"
            onClick={() => setActiveTab("all")}
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <FontAwesomeIcon icon={faGraduationCap} className="text-sm sm:text-xl" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-extrabold text-base sm:text-xl tracking-tight bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                  VocabMaster
                </span>
                <span className="hidden xs:inline text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  295 Words
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bangla hidden md:block">
                বাংলা অর্থ ও সমার্থক শব্দসহ ভোকাবুলারি শিখুন
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/30 font-semibold"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <FontAwesomeIcon
                    icon={item.icon}
                    className={`text-sm ${isActive ? "text-white" : "text-emerald-500 dark:text-emerald-400"}`}
                  />
                  <span>{item.label.split(" (")[0]}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Speaking Part 1 Page Link */}
            <Link
              href="/speaking"
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900 transition-all shadow-xs active:scale-95"
              title="IELTS Speaking Part 1: 15 Topics & British Accent Audio"
            >
              <FontAwesomeIcon icon={faHeadphones} className="text-indigo-500 text-xs sm:text-sm" />
              <span className="hidden sm:inline">স্পিকিং পার্ট ১ (Speaking)</span>
              <span className="sm:hidden text-xs">Speaking</span>
              <span className="hidden xl:inline text-[10px] px-1.5 py-0.2 rounded-full bg-indigo-200 dark:bg-indigo-900 text-indigo-900 dark:text-indigo-200 font-bold">
                180 Q&A
              </span>
            </Link>

            {/* Streak Counter */}
            <div
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/50 border border-amber-200/70 dark:border-amber-800/60 text-amber-700 dark:text-amber-300 text-xs sm:text-sm font-semibold"
              title={`${streak} day study streak!`}
            >
              <FontAwesomeIcon icon={faFire} className="text-amber-500 animate-bounce text-xs sm:text-sm" />
              <span>{streak}d</span>
            </div>

            {/* Mastery Pill (Desktop) */}
            <div
              className="hidden lg:flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/70 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold"
              title={`${mastered.length} of ${words.length} mastered`}
            >
              <div className="w-12 bg-emerald-200 dark:bg-emerald-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-emerald-600 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <span>{percent}%</span>
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

        {/* Mobile Sub Navigation bar - Touch-friendly scrollable bar */}
        <div className="md:hidden flex items-center py-2 border-t border-slate-200/70 dark:border-slate-800 overflow-x-auto gap-1.5 no-scrollbar touch-pan-x px-0.5">
          <Link
            href="/speaking"
            className="flex items-center gap-1.5 min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900 active:scale-95 shrink-0"
          >
            <FontAwesomeIcon icon={faHeadphones} className="text-indigo-500 text-xs" />
            <span>Speaking Part 1</span>
          </Link>
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all active:scale-95 shrink-0 ${
                  isActive
                    ? "bg-emerald-600 text-white font-bold shadow-xs"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 bg-slate-100/50 dark:bg-slate-800/40"
                }`}
              >
                <FontAwesomeIcon icon={item.icon} className="text-xs" />
                <span>{item.label.split(" (")[0]}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
