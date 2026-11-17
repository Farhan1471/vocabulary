"use client";

import React from "react";
import Link from "next/link";
import { useVocabulary } from "@/context/VocabularyContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookOpen,
  faHeadphones,
  faSun,
  faMoon,
  faFire,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";

interface SpeakingNavbarProps {
  selectedVoiceName?: string;
  isBritishVoice?: boolean;
}

export default function SpeakingNavbar({
  selectedVoiceName,
  isBritishVoice,
}: SpeakingNavbarProps) {
  const { theme, toggleTheme, streak } = useVocabulary();

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2">
          {/* Left: Brand & Back to Vocab */}
          <div className="flex items-center gap-2 sm:gap-3.5 min-w-0">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 py-1.5 px-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-slate-200/80 dark:border-slate-800 shrink-0 active:scale-95 min-h-[36px]"
              title="Return to Vocabulary Learning Hub"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="text-xs" />
              <span className="hidden sm:inline font-bangla">ভোকাবুলারি হাব</span>
              <span className="sm:hidden font-bangla text-xs">শব্দকোষ</span>
            </Link>

            <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 hidden xs:block shrink-0" />

            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-sky-600 via-indigo-600 to-rose-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 shrink-0">
                <FontAwesomeIcon icon={faHeadphones} className="text-xs sm:text-base" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-sm sm:text-lg tracking-tight bg-gradient-to-r from-sky-600 to-indigo-600 dark:from-sky-400 dark:to-indigo-400 bg-clip-text text-transparent truncate">
                    Speaking Part 1
                  </span>
                  <span className="hidden xs:inline text-[10px] sm:text-[11px] px-1.5 py-0.2 rounded-full font-semibold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900 shrink-0">
                    15 Topics
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden md:block">
                  180 Model Q&A with Natural British Accent Audio
                </p>
              </div>
            </div>
          </div>

          {/* Center: Navigation switcher (Desktop) */}
          <nav className="hidden lg:flex items-center gap-2">
            <Link
              href="/"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <FontAwesomeIcon icon={faBookOpen} className="text-emerald-500" />
              <span>Vocabulary (295 Words)</span>
            </Link>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white shadow-sm shadow-indigo-600/30">
              <FontAwesomeIcon icon={faHeadphones} />
              <span>Speaking Part 1 (180 Q&A)</span>
            </div>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Active Voice Pill (hidden on phone, visible on tablet/desktop) */}
            {selectedVoiceName && (
              <div
                className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60"
                title={`Active Accent: ${selectedVoiceName}`}
              >
                <span className="text-xs">{isBritishVoice ? "🇬🇧" : "🔊"}</span>
                <span className="max-w-[120px] truncate">{selectedVoiceName}</span>
              </div>
            )}

            {/* Streak Counter */}
            <div
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/50 border border-amber-200/70 dark:border-amber-800/60 text-amber-700 dark:text-amber-300 text-xs sm:text-sm font-semibold"
              title={`${streak} day study streak!`}
            >
              <FontAwesomeIcon icon={faFire} className="text-amber-500 animate-bounce text-xs sm:text-sm" />
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
      </div>
    </header>
  );
}
