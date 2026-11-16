"use client";

import React from "react";
import { useVocabulary } from "@/context/VocabularyContext";
import { BATCHES } from "@/data/vocabulary";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFolderOpen,
  faBookOpen,
  faClone,
  faCheckCircle,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";

export default function StudySets() {
  const { words, mastered, setSelectedBatch, setActiveTab, setSelectedFilter } = useVocabulary();

  const handleStudyBatch = (batchId: number, targetTab: "all" | "flashcards" | "quiz") => {
    setSelectedBatch(batchId);
    setSelectedFilter("all");
    setActiveTab(targetTab);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <FontAwesomeIcon icon={faFolderOpen} className="text-emerald-500" />
          <span>Structured Study Sets (ধাপে ধাপে ভোকাবুলারি শিক্ষা)</span>
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 font-bangla">
          ২৯৫ টি শব্দকে ৬ টি আলাদা সেটে ভাগ করা হয়েছে যাতে প্রতিদিন ৫০ টি করে শব্দ সহজে মুখস্থ ও আত্মস্থ করা যায়।
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {BATCHES.map((batch) => {
          const batchWords = words.filter(
            (w) => w.id >= batch.range[0] && w.id <= batch.range[1]
          );
          const masteredInBatch = batchWords.filter((w) => mastered.includes(w.id)).length;
          const percentage = Math.round((masteredInBatch / batchWords.length) * 100);

          return (
            <div
              key={batch.id}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/60 dark:hover:border-emerald-500/60 transition shadow-sm hover:shadow-md flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                    Set {batch.id}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-500" />
                    <span>
                      {masteredInBatch} / {batchWords.length} mastered
                    </span>
                  </div>
                </div>

                <h3 className="mt-3 text-lg font-bold text-slate-900 dark:text-white">
                  {batch.title}
                </h3>

                {/* Progress bar */}
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-slate-400 font-medium mb-1">
                    <span>Progress</span>
                    <span>{percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>

                {/* Preview Words snippet */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {batchWords.slice(0, 5).map((w) => (
                    <span
                      key={w.id}
                      className="px-2 py-0.5 rounded-md text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                    >
                      {w.word}
                    </span>
                  ))}
                  <span className="text-[11px] text-slate-400 self-center">
                    +{batchWords.length - 5} more
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <button
                  onClick={() => handleStudyBatch(batch.id, "all")}
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                >
                  <FontAwesomeIcon icon={faBookOpen} />
                  <span>View List</span>
                </button>
                <button
                  onClick={() => handleStudyBatch(batch.id, "flashcards")}
                  className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition shadow-xs"
                >
                  <FontAwesomeIcon icon={faClone} />
                  <span>Flashcards</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
