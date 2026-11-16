"use client";

import React, { useEffect } from "react";
import { useVocabulary } from "@/context/VocabularyContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faStar as faStarSolid,
  faCheck,
  faArrowLeft,
  faArrowRight,
  faVolumeHigh,
  faBookOpen,
} from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";

export default function WordDetailsModal() {
  const {
    words,
    selectedWord,
    setSelectedWord,
    favorites,
    mastered,
    toggleFavorite,
    toggleMastered,
    speakWord,
  } = useVocabulary();

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedWord) return;
      if (e.key === "Escape") {
        setSelectedWord(null);
      } else if (e.key === "ArrowLeft") {
        const prevIndex = words.findIndex((w) => w.id === selectedWord.id) - 1;
        if (prevIndex >= 0) setSelectedWord(words[prevIndex]);
      } else if (e.key === "ArrowRight") {
        const nextIndex = words.findIndex((w) => w.id === selectedWord.id) + 1;
        if (nextIndex < words.length) setSelectedWord(words[nextIndex]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedWord, words, setSelectedWord]);

  if (!selectedWord) return null;

  const isFav = favorites.includes(selectedWord.id);
  const isMastered = mastered.includes(selectedWord.id);
  const currentIndex = words.findIndex((w) => w.id === selectedWord.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < words.length - 1;

  const handlePrev = () => {
    if (hasPrev) setSelectedWord(words[currentIndex - 1]);
  };

  const handleNext = () => {
    if (hasNext) setSelectedWord(words[currentIndex + 1]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 overflow-hidden transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              #{selectedWord.id} of {words.length}
            </span>
            <span className="text-xs text-slate-400 font-medium">Set {selectedWord.batch}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleFavorite(selectedWord.id)}
              className="p-2 rounded-xl text-slate-400 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-950/30 transition"
              title={isFav ? "Starred" : "Star"}
            >
              <FontAwesomeIcon
                icon={isFav ? faStarSolid : faStarRegular}
                className={`text-base ${isFav ? "text-yellow-400" : ""}`}
              />
            </button>
            <button
              onClick={() => setSelectedWord(null)}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <FontAwesomeIcon icon={faXmark} className="text-lg" />
            </button>
          </div>
        </div>

        {/* Word Hero & Audio */}
        <div className="py-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {selectedWord.word}
          </h2>

          <div className="mt-3 flex items-center justify-center gap-2">
            <button
              onClick={() => speakWord(selectedWord.word)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-sm font-semibold hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition shadow-xs"
            >
              <FontAwesomeIcon icon={faVolumeHigh} className="text-emerald-600" />
              <span>Listen Pronunciation</span>
            </button>
          </div>
        </div>

        {/* Meaning Box */}
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block mb-1">
              বাংলা অর্থ (Bangla Meaning)
            </span>
            <p className="text-xl sm:text-2xl font-bold text-emerald-900 dark:text-emerald-200 font-bangla">
              {selectedWord.bangla}
            </p>
          </div>

          {/* Synonyms Box */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              সমার্থক শব্দসমূহ (Synonyms)
            </span>
            <div className="flex flex-wrap gap-2">
              {selectedWord.synonyms.map((syn, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-xl text-sm font-medium bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-xs border border-slate-200/80 dark:border-slate-600"
                >
                  {syn}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Mastered Status Button */}
        <div className="mt-6">
          <button
            onClick={() => toggleMastered(selectedWord.id)}
            className={`w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition ${
              isMastered
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-500 hover:text-white"
            }`}
          >
            <FontAwesomeIcon icon={faCheck} />
            <span>{isMastered ? "Mastered (Completed)" : "Mark as Mastered"}</span>
          </button>
        </div>

        {/* Footer Navigation (Prev / Next) */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={!hasPrev}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              hasPrev
                ? "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                : "text-slate-300 dark:text-slate-700 cursor-not-allowed"
            }`}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            <span>Previous Word</span>
          </button>

          <span className="text-xs text-slate-400 font-medium">Use ← and → keys</span>

          <button
            onClick={handleNext}
            disabled={!hasNext}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              hasNext
                ? "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                : "text-slate-300 dark:text-slate-700 cursor-not-allowed"
            }`}
          >
            <span>Next Word</span>
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>
      </div>
    </div>
  );
}
