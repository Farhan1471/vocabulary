"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faPause,
  faStop,
  faForward,
  faBackward,
  faWaveSquare,
} from "@fortawesome/free-solid-svg-icons";

interface FloatingAudioPlayerProps {
  isPlaying: boolean;
  isPaused: boolean;
  topicTitle?: string;
  questionNumber?: number;
  questionText?: string;
  activePhase?: "question" | "answer" | "single" | null;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
}

export default function FloatingAudioPlayer({
  isPlaying,
  isPaused,
  topicTitle,
  questionNumber,
  questionText,
  activePhase,
  onPause,
  onResume,
  onStop,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: FloatingAudioPlayerProps) {
  if (!isPlaying && !isPaused) return null;

  return (
    <aside
      aria-label="Audio Playback Controls"
      className="fixed bottom-3 left-2.5 right-2.5 sm:left-auto sm:right-6 sm:w-[480px] z-50 animate-slide-up"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="bg-slate-900/95 dark:bg-slate-800/95 backdrop-blur-md text-white border border-slate-700/80 rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-2xl flex flex-col gap-2">
        {/* Top Info line */}
        <div className="flex items-center justify-between gap-2 min-w-0">
          <div className="flex items-center gap-2 overflow-hidden min-w-0">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-ping shrink-0" />
            <div className="truncate min-w-0">
              <span className="text-xs font-bold text-indigo-400 truncate">
                {topicTitle ? topicTitle : "Audio Playback"}
              </span>
              {questionNumber && (
                <span className="ml-1.5 text-xs text-slate-300 font-semibold">
                  • Q{questionNumber}
                </span>
              )}
            </div>
          </div>

          {/* Phase Badge */}
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800 shrink-0">
            {activePhase === "question"
              ? "Reading Question"
              : activePhase === "answer"
              ? "Reading Answer"
              : "Speaking"}
          </span>
        </div>

        {/* Question Text preview */}
        {questionText && (
          <p className="text-xs text-slate-300 truncate italic">
            &ldquo;{questionText}&rdquo;
          </p>
        )}

        {/* Controls row - Large thumb-friendly targets on mobile */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-800 gap-2">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <FontAwesomeIcon icon={faWaveSquare} className="text-indigo-400 animate-pulse" />
            <span className="hidden xs:inline">British Accent Audio</span>
            <span className="xs:hidden">Playing</span>
          </div>

          <div className="flex items-center gap-2">
            {onPrev && (
              <button
                onClick={onPrev}
                disabled={!hasPrev}
                className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl text-slate-300 hover:text-white disabled:opacity-30 transition-colors active:scale-95"
                title="Previous Question"
              >
                <FontAwesomeIcon icon={faBackward} className="text-xs" />
              </button>
            )}

            {isPaused ? (
              <button
                onClick={onResume}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center transition-all shadow-md shadow-indigo-600/30 active:scale-95"
                title="Resume"
              >
                <FontAwesomeIcon icon={faPlay} className="text-xs ml-0.5" />
              </button>
            ) : (
              <button
                onClick={onPause}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-700 hover:bg-slate-600 text-white flex items-center justify-center transition-all active:scale-95"
                title="Pause"
              >
                <FontAwesomeIcon icon={faPause} className="text-xs" />
              </button>
            )}

            {onNext && (
              <button
                onClick={onNext}
                disabled={!hasNext}
                className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl text-slate-300 hover:text-white disabled:opacity-30 transition-colors active:scale-95"
                title="Next Question"
              >
                <FontAwesomeIcon icon={faForward} className="text-xs" />
              </button>
            )}

            <button
              onClick={onStop}
              className="min-h-[34px] px-3 py-1 rounded-xl text-xs font-bold bg-red-600/85 hover:bg-red-600 text-white transition-all shadow-xs active:scale-95"
              title="Stop audio"
            >
              <FontAwesomeIcon icon={faStop} className="text-[10px] mr-1" />
              Stop
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
