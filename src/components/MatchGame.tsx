"use client";

import React, { useState, useEffect } from "react";
import { useVocabulary } from "@/context/VocabularyContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGamepad,
  faRotateRight,
  faTrophy,
  faClock,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
// canvas-confetti is browser-only — dynamically imported at runtime
let confetti: ((opts?: Record<string, unknown>) => void) | null = null;
if (typeof window !== "undefined") {
  import("canvas-confetti").then((m) => {
    confetti = m.default as (opts?: Record<string, unknown>) => void;
  });
}
import { WordItem } from "@/data/vocabulary";

interface CardTile {
  id: string;
  wordId: number;
  text: string;
  type: "word" | "bangla";
  isMatched: boolean;
}

export default function MatchGame() {
  const { words, markMastered } = useVocabulary();

  const [tiles, setTiles] = useState<CardTile[]>([]);
  const [selectedTile, setSelectedTile] = useState<CardTile | null>(null);
  const [wrongPair, setWrongPair] = useState<[string, string] | null>(null);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const startNewGame = () => {
    // Pick 6 random words
    const pickedWords: WordItem[] = [...words].sort(() => Math.random() - 0.5).slice(0, 6);

    const generatedTiles: CardTile[] = [];
    pickedWords.forEach((w) => {
      generatedTiles.push({
        id: `word-${w.id}`,
        wordId: w.id,
        text: w.word,
        type: "word",
        isMatched: false,
      });
      generatedTiles.push({
        id: `bangla-${w.id}`,
        wordId: w.id,
        text: w.bangla,
        type: "bangla",
        isMatched: false,
      });
    });

    // Shuffle tiles
    setTiles(generatedTiles.sort(() => Math.random() - 0.5));
    setSelectedTile(null);
    setWrongPair(null);
    setMoves(0);
    setSeconds(0);
    setIsRunning(true);
    setIsCompleted(false);
  };

  useEffect(() => {
    startNewGame();
  }, []);

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && !isCompleted) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, isCompleted]);

  const handleTileClick = (tile: CardTile) => {
    if (tile.isMatched || wrongPair) return;
    if (selectedTile && selectedTile.id === tile.id) {
      setSelectedTile(null);
      return;
    }

    if (!selectedTile) {
      setSelectedTile(tile);
      return;
    }

    // Comparing two tiles
    setMoves((m) => m + 1);

    if (selectedTile.wordId === tile.wordId && selectedTile.type !== tile.type) {
      // Match found!
      const wordId = tile.wordId;
      markMastered(wordId);
      setTiles((prev) =>
        prev.map((t) => (t.wordId === wordId ? { ...t, isMatched: true } : t))
      );
      setSelectedTile(null);

      // Check if all matched
      setTimeout(() => {
        setTiles((currentTiles) => {
          const allDone = currentTiles.every((t) => t.isMatched || t.wordId === wordId);
          if (allDone) {
            setIsRunning(false);
            setIsCompleted(true);
            try {
              confetti?.({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
            } catch (e) {
              console.error(e);
            }
          }
          return currentTiles;
        });
      }, 100);
    } else {
      // Wrong match
      setWrongPair([selectedTile.id, tile.id]);
      setTimeout(() => {
        setWrongPair(null);
        setSelectedTile(null);
      }, 800);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6">
      {/* Header and stats */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FontAwesomeIcon icon={faGamepad} className="text-emerald-500" />
            <span>Word Matching Game</span>
          </h2>
          <p className="text-xs text-slate-500 font-bangla">
            ইংরেজি শব্দের সাথে সঠিক বাংলা অর্থ মিলিয়ে বোর্ড খালি করুন
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <FontAwesomeIcon icon={faClock} className="text-slate-400" />
            <span>{seconds}s</span>
          </div>
          <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">
            Moves: <strong className="text-slate-900 dark:text-white">{moves}</strong>
          </div>
          <button
            onClick={startNewGame}
            className="min-h-[36px] min-w-[36px] p-2 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition touch-manipulation"
            title="Restart Game"
          >
            <FontAwesomeIcon icon={faRotateRight} />
          </button>
        </div>
      </div>

      {/* Completion Modal / Banner */}
      {isCompleted ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 text-3xl mb-1">
            <FontAwesomeIcon icon={faTrophy} />
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">All Matched! 🎉</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 font-bangla">
            আপনি {seconds} সেকেন্ডে {moves} টি পদক্ষেপে সম্পূর্ণ করেছেন!
          </p>
          <button
            onClick={startNewGame}
            className="w-full sm:w-auto px-6 py-3 min-h-[48px] rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md shadow-emerald-600/25 transition active:scale-95 touch-manipulation"
          >
            Play Another Round
          </button>
        </div>
      ) : (
        /* Tiles Grid */
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
          {tiles.map((tile) => {
            const isSelected = selectedTile?.id === tile.id;
            const isWrong = wrongPair?.includes(tile.id);

            let style =
              "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-emerald-400 hover:shadow-md";

            if (tile.isMatched) {
              style =
                "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 opacity-50 cursor-default";
            } else if (isSelected) {
              style =
                "bg-emerald-500 text-white border-emerald-600 shadow-md scale-[1.02] font-bold";
            } else if (isWrong) {
              style = "bg-red-500 text-white border-red-600 animate-shake";
            }

            return (
              <button
                key={tile.id}
                onClick={() => handleTileClick(tile)}
                disabled={tile.isMatched}
                className={`min-h-[80px] sm:min-h-[90px] p-3 sm:p-4 rounded-2xl border text-center transition-all flex flex-col items-center justify-center relative touch-manipulation ${style}`}
              >
                {tile.isMatched && (
                  <span className="absolute top-2 right-2 text-emerald-600 dark:text-emerald-400 text-xs">
                    <FontAwesomeIcon icon={faCheck} />
                  </span>
                )}
                <span
                  className={`text-sm leading-tight ${
                    tile.type === "bangla" ? "font-bangla font-semibold" : "font-bold"
                  }`}
                >
                  {tile.text}
                </span>
                <span className="text-[10px] uppercase font-semibold text-slate-400 dark:text-slate-500 mt-1">
                  {tile.type === "word" ? "EN" : "BN"}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
