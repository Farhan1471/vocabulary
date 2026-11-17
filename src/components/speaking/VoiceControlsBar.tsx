"use client";

import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSliders,
  faVolumeHigh,
  faStop,
  faMagnifyingGlass,
  faCheck,
  faTimes,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";

interface VoiceControlsBarProps {
  voices: SpeechSynthesisVoice[];
  britishVoices: SpeechSynthesisVoice[];
  otherVoices: SpeechSynthesisVoice[];
  selectedVoice: SpeechSynthesisVoice | null;
  rate: number;
  isPlaying: boolean;
  searchQuery: string;
  totalPracticed: number;
  totalQuestions: number;
  onChangeVoice: (uri: string) => void;
  onChangeRate: (rate: number) => void;
  onSearchChange: (q: string) => void;
  onTestVoice: () => void;
  onStop: () => void;
}

export default function VoiceControlsBar({
  britishVoices,
  otherVoices,
  selectedVoice,
  rate,
  isPlaying,
  searchQuery,
  totalPracticed,
  totalQuestions,
  onChangeVoice,
  onChangeRate,
  onSearchChange,
  onTestVoice,
  onStop,
}: VoiceControlsBarProps) {
  const [showSettings, setShowSettings] = useState(false);

  const speedOptions = [
    { label: "0.8x (Slow)", value: 0.8 },
    { label: "0.92x (Natural)", value: 0.92 },
    { label: "1.0x (Normal)", value: 1.0 },
    { label: "1.1x (Brisk)", value: 1.1 },
  ];

  const percentPracticed = Math.round((totalPracticed / totalQuestions) * 100);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xs space-y-4 transition-colors">
      {/* Top Section: Title & Mobile-Friendly Action Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Title & Description */}
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              IELTS Speaking Part 1
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
              British Accent Audio
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            Topic-by-topic questions & answers with natural British accent audio. Practice, listen, and shadow.
          </p>
        </div>

        {/* Action Controls - Flex wrap with touch-friendly targets */}
        <div className="flex items-center flex-wrap gap-2 sm:gap-2.5">
          {/* Progress Pill */}
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-xs min-h-[40px]"
            title={`${totalPracticed} of ${totalQuestions} questions practiced`}
          >
            <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-200">
              <FontAwesomeIcon icon={faCheck} className="text-emerald-500" />
              <span>{totalPracticed}/{totalQuestions} Practiced</span>
            </div>
            <div className="w-10 sm:w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${percentPracticed}%` }}
              />
            </div>
          </div>

          {/* Test Voice Button */}
          <button
            onClick={onTestVoice}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-all shadow-xs active:scale-95 min-h-[40px]"
            title="Hear voice sample in natural British accent"
          >
            <FontAwesomeIcon icon={faVolumeHigh} className="text-indigo-500" />
            <span>Test Voice</span>
          </button>

          {/* Stop Button (Active when audio is playing) */}
          {isPlaying && (
            <button
              onClick={onStop}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-red-600 text-white shadow-sm shadow-red-600/30 hover:bg-red-700 transition-all active:scale-95 animate-pulse min-h-[40px]"
              title="Stop audio"
            >
              <FontAwesomeIcon icon={faStop} />
              <span>Stop Audio</span>
            </button>
          )}

          {/* Audio Settings Drawer Toggle */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all active:scale-95 min-h-[40px] ${
              showSettings
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent shadow-xs"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            <FontAwesomeIcon icon={faSliders} />
            <span>Settings</span>
            <FontAwesomeIcon
              icon={faChevronDown}
              className={`text-[10px] transition-transform duration-200 ${showSettings ? "rotate-180" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Expandable Audio Settings Panel */}
      {showSettings && (
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/70 dark:bg-slate-800/40 p-3.5 sm:p-4 rounded-2xl">
          {/* Voice Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>🗣️ Select Voice / Accent:</span>
              <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-900">
                British Accent
              </span>
            </label>
            <select
              value={selectedVoice?.voiceURI || ""}
              onChange={(e) => onChangeVoice(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors min-h-[42px]"
            >
              {britishVoices.length > 0 && (
                <optgroup label="🇬🇧 British Accent Voices (Recommended)">
                  {britishVoices.map((v) => (
                    <option key={v.voiceURI} value={v.voiceURI}>
                      🇬🇧 {v.name} ({v.lang})
                    </option>
                  ))}
                </optgroup>
              )}
              {otherVoices.length > 0 && (
                <optgroup label="Other Available Voices">
                  {otherVoices.map((v) => (
                    <option key={v.voiceURI} value={v.voiceURI}>
                      {v.name} ({v.lang})
                    </option>
                  ))}
                </optgroup>
              )}
            </select>
          </div>

          {/* Speed / Rate Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>Playback Speed:</span>
              <span className="text-xs text-indigo-600 dark:text-indigo-400 font-extrabold">{rate}x</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {speedOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => onChangeRate(opt.value)}
                  className={`py-2 px-2.5 rounded-xl text-xs font-bold border text-center transition-all min-h-[40px] flex items-center justify-center ${
                    rate === opt.value
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                      : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-400 active:scale-95"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Search Bar - Touch-optimized */}
      <div className="relative">
        <FontAwesomeIcon
          icon={faMagnifyingGlass}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search question or answer (e.g. Meherpur, hobbies, cricket, apartment, routine)..."
          className="w-full pl-10 pr-10 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/50 text-slate-800 dark:text-slate-200 text-xs sm:text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-900 transition-all min-h-[44px]"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm rounded-lg"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        )}
      </div>
    </div>
  );
}
