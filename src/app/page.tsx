"use client";

import React, { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import StatsOverview from "@/components/StatsOverview";
import WordCard from "@/components/WordCard";
import WordDetailsModal from "@/components/WordDetailsModal";
import FlashcardMode from "@/components/FlashcardMode";
import QuizMode from "@/components/QuizMode";
import MatchGame from "@/components/MatchGame";
import StudySets from "@/components/StudySets";
import { useVocabulary } from "@/context/VocabularyContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookOpen,
  faArrowLeft,
  faArrowRight,
  faArrowDownAZ,
  faArrowUp19,
  faPrint,
  faLayerGroup,
} from "@fortawesome/free-solid-svg-icons";

export default function Home() {
  const {
    words,
    activeTab,
    searchQuery,
    selectedFilter,
    selectedBatch,
    favorites,
    mastered,
    learning,
    setSelectedBatch,
  } = useVocabulary();

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"id" | "alphabetical">("id");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(30); // 30 per page or all

  // Filtered words memo
  const filteredWords = useMemo(() => {
    let result = words;

    // Filter by batch
    if (selectedBatch !== null) {
      result = result.filter((w) => w.batch === selectedBatch);
    }

    // Filter by status
    if (selectedFilter === "mastered") {
      result = result.filter((w) => mastered.includes(w.id));
    } else if (selectedFilter === "learning") {
      result = result.filter((w) => learning.includes(w.id));
    } else if (selectedFilter === "favorites") {
      result = result.filter((w) => favorites.includes(w.id));
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (w) =>
          w.word.toLowerCase().includes(q) ||
          w.bangla.toLowerCase().includes(q) ||
          w.synonyms.some((s) => s.toLowerCase().includes(q)) ||
          w.id.toString() === q
      );
    }

    // Sorting
    const sorted = [...result];
    if (sortBy === "alphabetical") {
      sorted.sort((a, b) => a.word.localeCompare(b.word));
    } else {
      sorted.sort((a, b) => a.id - b.id);
    }

    return sorted;
  }, [words, selectedBatch, selectedFilter, searchQuery, mastered, learning, favorites, sortBy]);

  // Reset page when filter changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedFilter, selectedBatch, sortBy, pageSize]);

  // Pagination calculation
  const totalItems = filteredWords.length;
  const totalPages = pageSize === -1 ? 1 : Math.ceil(totalItems / pageSize);
  const paginatedWords = useMemo(() => {
    if (pageSize === -1) return filteredWords;
    const startIndex = (currentPage - 1) * pageSize;
    return filteredWords.slice(startIndex, startIndex + pageSize);
  }, [filteredWords, currentPage, pageSize]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-5 sm:space-y-8">
        {/* TAB 1: ALL WORDS */}
        {activeTab === "all" && (
          <div className="space-y-6">
            <StatsOverview viewMode={viewMode} setViewMode={setViewMode} />

            {/* Sub-bar: Set badge (if filtered) & Sort dropdown */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <span>
                  Showing <strong className="text-slate-800 dark:text-white">{filteredWords.length}</strong> of{" "}
                  {words.length} words
                </span>
                {selectedBatch !== null && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-semibold text-xs">
                    Set {selectedBatch}
                    <button
                      onClick={() => setSelectedBatch(null)}
                      className="ml-1 hover:text-emerald-950 dark:hover:text-white"
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                {/* Sort Option */}
                <div className="flex items-center gap-1.5">
                  <span className="text-xs">Sort:</span>
                  <button
                    onClick={() => setSortBy(sortBy === "id" ? "alphabetical" : "id")}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                  >
                    <FontAwesomeIcon icon={sortBy === "id" ? faArrowUp19 : faArrowDownAZ} />
                    <span>{sortBy === "id" ? "Word # (1 - 295)" : "Alphabetical (A - Z)"}</span>
                  </button>
                </div>

                {/* Page Size */}
                <div className="hidden sm:flex items-center gap-1.5">
                  <span className="text-xs">Show:</span>
                  <select
                    value={pageSize}
                    onChange={(e) => setPageSize(parseInt(e.target.value, 10))}
                    className="px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value={30}>30 words</option>
                    <option value={60}>60 words</option>
                    <option value={100}>100 words</option>
                    <option value={-1}>All words</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Words List or Grid */}
            {paginatedWords.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800">
                <FontAwesomeIcon icon={faBookOpen} className="text-4xl text-slate-300 mb-3" />
                <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">
                  No vocabulary words found
                </h3>
                <p className="text-sm text-slate-400 mt-1">
                  Try adjusting your search query or filter selection.
                </p>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {paginatedWords.map((word) => (
                  <WordCard key={word.id} word={word} viewMode="grid" />
                ))}
              </div>
            ) : (
              <div className="space-y-2.5">
                {paginatedWords.map((word) => (
                  <WordCard key={word.id} word={word} viewMode="list" />
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="pt-4 sm:pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl border text-xs sm:text-sm font-semibold transition min-h-[40px] ${
                    currentPage === 1
                      ? "opacity-40 cursor-not-allowed border-slate-200 dark:border-slate-800"
                      : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 active:scale-95"
                  }`}
                >
                  <FontAwesomeIcon icon={faArrowLeft} />
                  <span>Previous</span>
                </button>

                <div className="text-xs sm:text-sm font-medium text-slate-500 whitespace-nowrap">
                  Page <strong className="text-slate-900 dark:text-white">{currentPage}</strong> of{" "}
                  {totalPages}
                </div>

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl border text-xs sm:text-sm font-semibold transition min-h-[40px] ${
                    currentPage === totalPages
                      ? "opacity-40 cursor-not-allowed border-slate-200 dark:border-slate-800"
                      : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 active:scale-95"
                  }`}
                >
                  <span>Next</span>
                  <FontAwesomeIcon icon={faArrowRight} />
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: FLASHCARDS */}
        {activeTab === "flashcards" && <FlashcardMode />}

        {/* TAB 3: QUIZ */}
        {activeTab === "quiz" && <QuizMode />}

        {/* TAB 4: MATCH GAME */}
        {activeTab === "match" && <MatchGame />}

        {/* TAB 5: STUDY SETS */}
        {activeTab === "sets" && <StudySets />}
      </main>

      {/* Global Details Modal */}
      <WordDetailsModal />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700 dark:text-slate-300">VocabMaster</span>
            <span>• 295 Words with Bangla Meanings & Synonyms</span>
          </div>
          <div className="text-slate-400 font-bangla">
            বিসিএস, আইইএলটিএস, জিআরই ও সরকারি চাকরির ভোকাবুলারি প্রস্তুতির জন্য উপযোগী
          </div>
        </div>
      </footer>
    </div>
  );
}
