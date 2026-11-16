"use client";

import React, { useState } from "react";
import { WordItem } from "@/data/vocabulary";
import { useVocabulary } from "@/context/VocabularyContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar as faStarSolid,
  faCheck,
  faCopy,
  faCheckDouble,
} from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";
import AudioButton from "./AudioButton";

interface WordCardProps {
  word: WordItem;
  viewMode: "grid" | "list";
}

export default function WordCard({ word, viewMode }: WordCardProps) {
  const {
    favorites,
    mastered,
    toggleFavorite,
    toggleMastered,
    setSelectedWord,
  } = useVocabulary();

  const [copied, setCopied] = useState(false);

  const isFav = favorites.includes(word.id);
  const isMastered = mastered.includes(word.id);

  const copyToClipboard = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${word.word} - ${word.bangla} (Synonyms: ${word.synonyms.join(", ")})`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (viewMode === "list") {
    return (
      <div
        onClick={() => setSelectedWord(word)}
        className={`group cursor-pointer p-4 rounded-xl border transition-all duration-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
          isMastered
            ? "bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/60"
            : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-600 hover:shadow-md"
        }`}
      >
        <div className="flex items-center gap-3 min-w-[200px]">
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
            #{word.id}
          </span>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                {word.word}
              </h3>
              <AudioButton text={word.word} className="p-1 text-xs" />
            </div>
            <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
              Set {word.batch}
            </span>
          </div>
        </div>

        {/* Bangla Meaning */}
        <div className="flex-1 sm:px-4">
          <div className="text-sm font-semibold text-emerald-700 dark:text-emerald-300 font-bangla">
            {word.bangla}
          </div>
        </div>

        {/* Synonyms */}
        <div className="flex flex-wrap items-center gap-1.5 flex-1">
          {word.synonyms.map((syn, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
            >
              {syn}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 self-end sm:self-center">
          <button
            onClick={copyToClipboard}
            title={copied ? "Copied!" : "Copy details"}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <FontAwesomeIcon icon={copied ? faCheckDouble : faCopy} className={copied ? "text-emerald-500" : "text-xs"} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(word.id);
            }}
            title={isFav ? "Remove star" : "Star word"}
            className="p-2 rounded-lg text-slate-400 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-950/30 transition"
          >
            <FontAwesomeIcon
              icon={isFav ? faStarSolid : faStarRegular}
              className={isFav ? "text-yellow-400" : "text-xs"}
            />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleMastered(word.id);
            }}
            title={isMastered ? "Mark as unlearned" : "Mark as mastered"}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              isMastered
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-50 hover:text-emerald-600"
            }`}
          >
            <FontAwesomeIcon icon={faCheck} className="text-xs" />
            <span>{isMastered ? "Mastered" : "Learn"}</span>
          </button>
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div
      onClick={() => setSelectedWord(word)}
      className={`group cursor-pointer relative p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
        isMastered
          ? "bg-emerald-50/50 dark:bg-emerald-950/25 border-emerald-300 dark:border-emerald-800/70 shadow-xs"
          : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-500 hover:shadow-lg hover:-translate-y-0.5"
      }`}
    >
      {/* Top Header: Badge, Set, and Favorite */}
      <div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
            #{word.id}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={copyToClipboard}
              title={copied ? "Copied!" : "Copy"}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-xs"
            >
              <FontAwesomeIcon icon={copied ? faCheckDouble : faCopy} className={copied ? "text-emerald-500" : ""} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(word.id);
              }}
              title={isFav ? "Remove star" : "Star word"}
              className="p-1.5 rounded-lg text-slate-400 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-950/30 transition text-xs"
            >
              <FontAwesomeIcon
                icon={isFav ? faStarSolid : faStarRegular}
                className={isFav ? "text-yellow-400" : ""}
              />
            </button>
          </div>
        </div>

        {/* English Word & Audio */}
        <div className="mt-3 flex items-center justify-between">
          <h3 className="font-extrabold text-xl text-slate-900 dark:text-white tracking-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            {word.word}
          </h3>
          <AudioButton text={word.word} />
        </div>

        {/* Bangla Meaning */}
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">
            বাংলা অর্থ
          </div>
          <p className="text-base font-bold text-emerald-700 dark:text-emerald-300 font-bangla leading-snug">
            {word.bangla}
          </p>
        </div>

        {/* Synonyms */}
        <div className="mt-3">
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">
            Synonyms
          </div>
          <div className="flex flex-wrap gap-1.5">
            {word.synonyms.map((syn, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60"
              >
                {syn}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer: Status Toggle */}
      <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        <span className="text-[11px] text-slate-400 font-medium">Set {word.batch}</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleMastered(word.id);
          }}
          className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
            isMastered
              ? "bg-emerald-600 text-white shadow-xs"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-100 hover:text-emerald-700 dark:hover:bg-slate-700"
          }`}
        >
          <FontAwesomeIcon icon={faCheck} className="text-xs" />
          <span>{isMastered ? "Mastered" : "Mark Mastered"}</span>
        </button>
      </div>
    </div>
  );
}
