"use client";

import React from "react";
import { useVocabulary } from "@/context/VocabularyContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookOpen,
  faCheckCircle,
  faStar,
  faClock,
  faMagnifyingGlass,
  faXmark,
  faFilter,
  faRotateRight,
  faClone,
  faCircleQuestion,
} from "@fortawesome/free-solid-svg-icons";

interface StatsOverviewProps {
  viewMode: "grid" | "list";
  setViewMode: (m: "grid" | "list") => void;
}

export default function StatsOverview({ viewMode, setViewMode }: StatsOverviewProps) {
  const {
    words,
    favorites,
    mastered,
    learning,
    searchQuery,
    setSearchQuery,
    selectedFilter,
    setSelectedFilter,
    selectedBatch,
    setSelectedBatch,
    setActiveTab,
    resetProgress,
  } = useVocabulary();

  const total = words.length;
  const masteredCount = mastered.length;
  const favCount = favorites.length;
  const learningCount = learning.length;
  const percentage = Math.round((masteredCount / total) * 100);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Hero / Motivation Banner - Mobile Optimized */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 text-white p-5 sm:p-8 shadow-xl shadow-emerald-700/10">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-[11px] sm:text-xs font-semibold uppercase tracking-wider mb-2.5">
            ✨ Complete Vocabulary Master Guide
          </div>
          <h1 className="text-xl sm:text-4xl font-black tracking-tight leading-snug">
            295 Essential Words with Bangla & Synonyms
          </h1>
          <p className="mt-2 text-xs sm:text-base text-emerald-100 font-bangla leading-relaxed">
            প্রতিটি শব্দের সহজ বাংলা অর্থ, স্পষ্ট সমার্থক শব্দ (Synonym) এবং সঠিক উচ্চারণ অডিওসহ সহজে মুখস্থ করুন।
          </p>

          <div className="mt-4 sm:mt-5 flex flex-col sm:flex-row gap-2.5 sm:gap-3">
            <button
              onClick={() => setActiveTab("flashcards")}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2.5 rounded-xl bg-white text-emerald-800 font-bold text-xs sm:text-sm shadow-md hover:bg-emerald-50 active:scale-95 transition-all"
            >
              <FontAwesomeIcon icon={faClone} />
              <span>Start Flashcards</span>
            </button>
            <button
              onClick={() => setActiveTab("quiz")}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2.5 rounded-xl bg-emerald-900/40 border border-white/25 text-white font-bold text-xs sm:text-sm hover:bg-emerald-900/60 active:scale-95 transition-all"
            >
              <FontAwesomeIcon icon={faCircleQuestion} />
              <span>Test Knowledge (Quiz)</span>
            </button>
          </div>
        </div>

        {/* Decorative background shape */}
        <div className="absolute right-0 top-0 -bottom-10 w-1/3 opacity-10 pointer-events-none hidden md:flex items-center justify-center">
          <FontAwesomeIcon icon={faBookOpen} className="text-[240px] text-white" />
        </div>
      </div>

      {/* Progress Cards Grid - 2x2 on Mobile with responsive text */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {/* Total Words */}
        <div
          onClick={() => {
            setSelectedFilter("all");
            setSelectedBatch(null);
          }}
          className={`cursor-pointer p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border transition-all active:scale-98 ${
            selectedFilter === "all" && selectedBatch === null
              ? "bg-emerald-50/70 border-emerald-500 dark:bg-emerald-950/30 dark:border-emerald-500 shadow-xs"
              : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">Total Words</span>
            <FontAwesomeIcon icon={faBookOpen} className="text-emerald-500 text-xs sm:text-sm" />
          </div>
          <div className="mt-1.5 flex items-baseline gap-1.5">
            <span className="text-xl sm:text-3xl font-black text-slate-800 dark:text-slate-100">{total}</span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bangla">শব্দ</span>
          </div>
          <div className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium truncate">
            Vocabulary List
          </div>
        </div>

        {/* Mastered */}
        <div
          onClick={() => setSelectedFilter("mastered")}
          className={`cursor-pointer p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border transition-all active:scale-98 ${
            selectedFilter === "mastered"
              ? "bg-emerald-50/70 border-emerald-500 dark:bg-emerald-950/30 dark:border-emerald-500 shadow-xs"
              : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">Mastered</span>
            <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-600 text-xs sm:text-sm" />
          </div>
          <div className="mt-1.5 flex items-baseline gap-1.5">
            <span className="text-xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
              {masteredCount}
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">/ {total}</span>
          </div>
          <div className="mt-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Learning */}
        <div
          onClick={() => setSelectedFilter("learning")}
          className={`cursor-pointer p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border transition-all active:scale-98 ${
            selectedFilter === "learning"
              ? "bg-amber-50/70 border-amber-500 dark:bg-amber-950/30 dark:border-amber-500 shadow-xs"
              : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">Learning</span>
            <FontAwesomeIcon icon={faClock} className="text-amber-500 text-xs sm:text-sm" />
          </div>
          <div className="mt-1.5 flex items-baseline gap-1.5">
            <span className="text-xl sm:text-3xl font-black text-amber-600 dark:text-amber-400">
              {learningCount}
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bangla">চলমান</span>
          </div>
          <div className="mt-1 text-[11px] text-amber-600 dark:text-amber-400 font-medium truncate">
            Needs practice
          </div>
        </div>

        {/* Starred / Favorites */}
        <div
          onClick={() => setSelectedFilter("favorites")}
          className={`cursor-pointer p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border transition-all active:scale-98 ${
            selectedFilter === "favorites"
              ? "bg-yellow-50/70 border-yellow-500 dark:bg-yellow-950/30 dark:border-yellow-500 shadow-xs"
              : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">Starred</span>
            <FontAwesomeIcon icon={faStar} className="text-yellow-500 text-xs sm:text-sm" />
          </div>
          <div className="mt-1.5 flex items-baseline gap-1.5">
            <span className="text-xl sm:text-3xl font-black text-yellow-500">{favCount}</span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bangla">সংরক্ষিত</span>
          </div>
          <div className="mt-1 text-[11px] text-yellow-600 dark:text-yellow-400 font-medium truncate">
            Quick reference
          </div>
        </div>
      </div>

      {/* Search and Filter Controls Bar */}
      <div className="bg-white dark:bg-slate-900 p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs sm:text-sm pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search word, Bangla meaning (বাংলা), or synonym..."
              className="w-full pl-9 sm:pl-10 pr-9 py-2.5 sm:py-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl sm:rounded-2xl text-xs sm:text-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 transition min-h-[42px]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs"
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            )}
          </div>

          {/* View Mode Toggle (Grid / List) */}
          <div className="flex items-center justify-end sm:justify-start gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl shrink-0 self-end sm:self-auto">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition min-h-[34px] ${
                viewMode === "grid"
                  ? "bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-xs"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700"
              }`}
            >
              Grid View
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition min-h-[34px] ${
                viewMode === "list"
                  ? "bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-xs"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700"
              }`}
            >
              List View
            </button>
          </div>
        </div>

        {/* Filter Pills with Horizontal Swipe on Mobile */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 no-scrollbar touch-pan-x px-0.5">
            <span className="text-[11px] font-bold text-slate-400 mr-1 flex items-center gap-1 shrink-0">
              <FontAwesomeIcon icon={faFilter} className="text-[9px]" /> Filter:
            </span>
            <button
              onClick={() => {
                setSelectedFilter("all");
                setSelectedBatch(null);
              }}
              className={`min-h-[34px] px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition active:scale-95 shrink-0 ${
                selectedFilter === "all" && selectedBatch === null
                  ? "bg-slate-900 text-white dark:bg-emerald-600 dark:text-white shadow-xs"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              }`}
            >
              All ({total})
            </button>
            <button
              onClick={() => setSelectedFilter("mastered")}
              className={`min-h-[34px] px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition active:scale-95 shrink-0 ${
                selectedFilter === "mastered"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100"
              }`}
            >
              Mastered ({masteredCount})
            </button>
            <button
              onClick={() => setSelectedFilter("learning")}
              className={`min-h-[34px] px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition active:scale-95 shrink-0 ${
                selectedFilter === "learning"
                  ? "bg-amber-600 text-white shadow-xs"
                  : "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:bg-amber-100"
              }`}
            >
              Learning ({learningCount})
            </button>
            <button
              onClick={() => setSelectedFilter("favorites")}
              className={`min-h-[34px] px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition active:scale-95 shrink-0 ${
                selectedFilter === "favorites"
                  ? "bg-yellow-500 text-white shadow-xs"
                  : "bg-yellow-50 dark:bg-yellow-950/40 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-100"
              }`}
            >
              Starred ({favCount})
            </button>
          </div>

          {(masteredCount > 0 || learningCount > 0 || favCount > 0) && (
            <button
              onClick={resetProgress}
              className="text-xs text-slate-400 hover:text-red-500 dark:hover:text-red-400 flex items-center gap-1 transition shrink-0 min-h-[34px] px-2 active:scale-95"
              title="Reset all progress"
            >
              <FontAwesomeIcon icon={faRotateRight} className="text-[10px]" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
