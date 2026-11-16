"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useVocabulary } from "@/context/VocabularyContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRotate,
  faArrowLeft,
  faArrowRight,
  faShuffle,
  faCheck,
  faClock,
  faVolumeHigh,
  faStar as faStarSolid,
  faArrowsRotate,
} from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";
import { WordItem } from "@/data/vocabulary";

export default function FlashcardMode() {
  const {
    words,
    favorites,
    mastered,
    toggleFavorite,
    markMastered,
    markLearning,
    speakWord,
  } = useVocabulary();

  const [cardList, setCardList] = useState<WordItem[]>(words);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [invertCards, setInvertCards] = useState(false); // false = English front, Bangla back; true = Bangla front
  const [cardFilter, setCardFilter] = useState<"all" | "unmastered" | "favorites">("all");

  // Filter cards based on user selection
  useEffect(() => {
    let filtered = words;
    if (cardFilter === "unmastered") {
      filtered = words.filter((w) => !mastered.includes(w.id));
    } else if (cardFilter === "favorites") {
      filtered = words.filter((w) => favorites.includes(w.id));
    }
    if (filtered.length === 0) {
      filtered = words;
    }
    setCardList(filtered);
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [cardFilter, words, mastered, favorites]);

  const currentWord = cardList[currentIndex] || cardList[0];

  const handleNext = useCallback(() => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev < cardList.length - 1 ? prev + 1 : 0));
  }, [cardList.length]);

  const handlePrev = useCallback(() => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : cardList.length - 1));
  }, [cardList.length]);

  const handleShuffle = () => {
    setIsFlipped(false);
    const shuffled = [...cardList].sort(() => Math.random() - 0.5);
    setCardList(shuffled);
    setCurrentIndex(0);
  };

  const handleMarkMastered = () => {
    if (currentWord) {
      markMastered(currentWord.id);
      handleNext();
    }
  };

  const handleMarkLearning = () => {
    if (currentWord) {
      markLearning(currentWord.id);
      handleNext();
    }
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.code === "Space" || e.key === "Enter") {
        e.preventDefault();
        setIsFlipped((f) => !f);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        handleMarkMastered();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        handleMarkLearning();
      } else if (e.key.toLowerCase() === "a" && currentWord) {
        e.preventDefault();
        speakWord(currentWord.word);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev, currentWord, speakWord]);

  if (!currentWord) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">No flashcards found for this selection.</p>
      </div>
    );
  }

  const isFav = favorites.includes(currentWord.id);
  const isMasteredWord = mastered.includes(currentWord.id);
  const progressPercent = Math.round(((currentIndex + 1) / cardList.length) * 100);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Top Filter and Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400">Cards:</span>
          <div className="flex rounded-lg bg-slate-100 dark:bg-slate-800 p-1">
            <button
              onClick={() => setCardFilter("all")}
              className={`px-3 py-1 rounded-md text-xs font-medium transition ${
                cardFilter === "all"
                  ? "bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-xs"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-white"
              }`}
            >
              All ({words.length})
            </button>
            <button
              onClick={() => setCardFilter("unmastered")}
              className={`px-3 py-1 rounded-md text-xs font-medium transition ${
                cardFilter === "unmastered"
                  ? "bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-xs"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-white"
              }`}
            >
              Unmastered ({words.length - mastered.length})
            </button>
            <button
              onClick={() => setCardFilter("favorites")}
              className={`px-3 py-1 rounded-md text-xs font-medium transition ${
                cardFilter === "favorites"
                  ? "bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-xs"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-white"
              }`}
            >
              Starred ({favorites.length})
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Flip Mode Toggle */}
          <button
            onClick={() => setInvertCards(!invertCards)}
            title="Switch Front/Back (English first or Bangla first)"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
              invertCards
                ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300"
                : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            <FontAwesomeIcon icon={faArrowsRotate} />
            <span>{invertCards ? "Bangla First" : "English First"}</span>
          </button>

          {/* Shuffle button */}
          <button
            onClick={handleShuffle}
            title="Shuffle cards"
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <FontAwesomeIcon icon={faShuffle} />
          </button>
        </div>
      </div>

      {/* Progress Counter & Bar */}
      <div>
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2 font-medium">
          <span>
            Card <strong className="text-slate-800 dark:text-white">{currentIndex + 1}</strong> of{" "}
            {cardList.length}
          </span>
          <span>{progressPercent}% Complete</span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
          <div
            className="bg-emerald-500 h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* 3D Flip Flashcard Container */}
      <div
        className="perspective-1000 w-full min-h-[340px] sm:min-h-[380px] cursor-pointer"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div
          className={`relative w-full h-full min-h-[340px] sm:min-h-[380px] duration-500 transform-style-3d transition-transform ${
            isFlipped ? "rotate-y-180" : ""
          }`}
        >
          {/* FRONT SIDE */}
          <div className="absolute inset-0 backface-hidden w-full h-full bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-200 dark:border-slate-800 shadow-xl p-6 sm:p-8 flex flex-col justify-between">
            {/* Front Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                  #{currentWord.id}
                </span>
                <span className="text-xs text-slate-400 font-medium">Set {currentWord.batch}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(currentWord.id);
                  }}
                  className="p-2 rounded-lg text-slate-400 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-950/30 transition"
                >
                  <FontAwesomeIcon
                    icon={isFav ? faStarSolid : faStarRegular}
                    className={isFav ? "text-yellow-400" : ""}
                  />
                </button>
              </div>
            </div>

            {/* Front Center Content */}
            <div className="text-center py-6">
              {!invertCards ? (
                <>
                  <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {currentWord.word}
                  </h2>
                  <div className="mt-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        speakWord(currentWord.word);
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-sm font-semibold hover:bg-emerald-100 dark:hover:bg-emerald-900 transition"
                    >
                      <FontAwesomeIcon icon={faVolumeHigh} className="text-emerald-600" />
                      <span>Audio Pronounce</span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 block">
                    বাংলা অর্থ
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-emerald-700 dark:text-emerald-300 font-bangla">
                    {currentWord.bangla}
                  </h2>
                </>
              )}
            </div>

            {/* Front Footer Hint */}
            <div className="flex items-center justify-center gap-2 text-xs text-slate-400 border-t border-slate-100 dark:border-slate-800/80 pt-4">
              <FontAwesomeIcon icon={faRotate} className="text-emerald-500" />
              <span>Click or press Spacebar to flip card</span>
            </div>
          </div>

          {/* BACK SIDE */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 w-full h-full bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 rounded-3xl border-2 border-emerald-500/40 dark:border-emerald-600/40 shadow-xl p-6 sm:p-8 flex flex-col justify-between">
            {/* Back Header */}
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                #{currentWord.id} • {currentWord.word}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  speakWord(currentWord.word);
                }}
                className="p-2 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950 rounded-full"
                title="Pronounce word"
              >
                <FontAwesomeIcon icon={faVolumeHigh} />
              </button>
            </div>

            {/* Back Content */}
            <div className="space-y-4 py-2">
              <div className="text-center">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                  বাংলা অর্থ (Bangla Meaning)
                </span>
                <p className="text-2xl sm:text-3xl font-extrabold text-emerald-800 dark:text-emerald-300 font-bangla">
                  {currentWord.bangla}
                </p>
              </div>

              <div className="pt-2 text-center">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">
                  Synonyms (সমার্থক শব্দ)
                </span>
                <div className="flex flex-wrap justify-center gap-2">
                  {currentWord.synonyms.map((syn, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-100/70 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800"
                    >
                      {syn}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Back Footer */}
            <div className="flex items-center justify-center gap-2 text-xs text-slate-400 border-t border-slate-100 dark:border-slate-800/80 pt-4">
              <FontAwesomeIcon icon={faRotate} className="text-emerald-500" />
              <span>Click to flip back</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons: Still Learning vs Mastered */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <button
          onClick={handleMarkLearning}
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 font-semibold text-sm hover:bg-amber-100 dark:hover:bg-amber-900/40 transition active:scale-98 shadow-xs"
        >
          <FontAwesomeIcon icon={faClock} />
          <span>Still Learning (↓)</span>
        </button>

        <button
          onClick={handleMarkMastered}
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition active:scale-98 shadow-md shadow-emerald-600/25"
        >
          <FontAwesomeIcon icon={faCheck} />
          <span>Mastered / Got It (↑)</span>
        </button>
      </div>

      {/* Navigation Buttons: Previous / Next */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={handlePrev}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-semibold text-xs sm:text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          <span>Previous (←)</span>
        </button>

        <div className="text-xs text-slate-400 hidden sm:block">
          Use Keyboard: <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono">Space</kbd> flip • <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono">←</kbd> <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono">→</kbd> nav
        </div>

        <button
          onClick={handleNext}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-semibold text-xs sm:text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition"
        >
          <span>Next (→)</span>
          <FontAwesomeIcon icon={faArrowRight} />
        </button>
      </div>
    </div>
  );
}
