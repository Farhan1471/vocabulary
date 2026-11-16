"use client";

import React from "react";
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
    <header className="sticky top-0 z-40 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setActiveTab("all")}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <FontAwesomeIcon icon={faGraduationCap} className="text-xl" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                  VocabMaster
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  295 Words
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bangla hidden sm:block">
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
                  <FontAwesomeIcon icon={item.icon} className={`text-sm ${isActive ? "text-white" : "text-emerald-500 dark:text-emerald-400"}`} />
                  <span>{item.label.split(" (")[0]}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons: Streak, Progress, Dark Mode */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Streak Counter */}
            <div
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/50 border border-amber-200/70 dark:border-amber-800/60 text-amber-700 dark:text-amber-300 text-xs sm:text-sm font-semibold"
              title={`${streak} day study streak!`}
            >
              <FontAwesomeIcon icon={faFire} className="text-amber-500 animate-bounce" />
              <span>{streak}d</span>
            </div>

            {/* Mastery Pill */}
            <div
              className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/70 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold"
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
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <FontAwesomeIcon icon={theme === "dark" ? faSun : faMoon} className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Sub Navigation bar */}
        <div className="md:hidden flex items-center justify-between py-2 border-t border-slate-200/70 dark:border-slate-800 overflow-x-auto gap-1 no-scrollbar">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? "bg-emerald-600 text-white"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
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
