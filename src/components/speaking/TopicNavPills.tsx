"use client";

import React from "react";
import { SpeakingTopic } from "@/data/speakingPart1";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faBuilding,
  faBriefcase,
  faClock,
  faPlane,
  faFilm,
  faUsers,
  faHeart,
  faUtensils,
  faMusic,
  faBaseballBatBall,
  faSnowflake,
  faBookOpen,
  faBagShopping,
  faLaptop,
  faLayerGroup,
} from "@fortawesome/free-solid-svg-icons";

const TOPIC_ICON_MAP: Record<number, any> = {
  1: faHouse,
  2: faBuilding,
  3: faBriefcase,
  4: faClock,
  5: faPlane,
  6: faFilm,
  7: faUsers,
  8: faHeart,
  9: faUtensils,
  10: faMusic,
  11: faBaseballBatBall,
  12: faSnowflake,
  13: faBookOpen,
  14: faBagShopping,
  15: faLaptop,
};

interface TopicNavPillsProps {
  topics: SpeakingTopic[];
  selectedTopicId: number | null; // null = all topics
  practicedIds: string[]; // e.g. "t1-q1"
  onSelectTopic: (topicId: number | null) => void;
  onScrollToTopic: (topicId: number) => void;
  viewMode: "all" | "single";
  setViewMode: (mode: "all" | "single") => void;
}

export default function TopicNavPills({
  topics,
  selectedTopicId,
  practicedIds,
  onSelectTopic,
  onScrollToTopic,
  viewMode,
  setViewMode,
}: TopicNavPillsProps) {
  const getTopicPracticedCount = (topicId: number) => {
    return practicedIds.filter((id) => id.startsWith(`t${topicId}-`)).length;
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 shadow-xs space-y-3 transition-colors">
      {/* Top Header & View Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Topics (15)
          </span>
          <span className="text-[11px] text-slate-400 dark:text-slate-500">
            • Tap to jump or filter
          </span>
        </div>

        {/* View Mode Toggle: All Sections vs Single Focus */}
        <div className="flex items-center w-full sm:w-auto bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => {
              setViewMode("all");
              onSelectTopic(null);
            }}
            className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg transition-all text-center min-h-[34px] flex items-center justify-center ${
              viewMode === "all" && selectedTopicId === null
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            All Sections
          </button>
          <button
            onClick={() => {
              setViewMode("single");
              if (selectedTopicId === null) onSelectTopic(1);
            }}
            className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg transition-all text-center min-h-[34px] flex items-center justify-center ${
              viewMode === "single"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Single Topic
          </button>
        </div>
      </div>

      {/* Pills Container with Smooth Horizontal Swipe */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar touch-pan-x px-0.5">
        <button
          onClick={() => {
            onSelectTopic(null);
            if (viewMode === "single") setViewMode("all");
          }}
          className={`flex items-center gap-1.5 min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border shrink-0 active:scale-95 ${
            selectedTopicId === null && viewMode === "all"
              ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
              : "bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
          }`}
        >
          <FontAwesomeIcon icon={faLayerGroup} className="text-xs" />
          <span>All 15 Topics</span>
        </button>

        {topics.map((t) => {
          const isSelected = selectedTopicId === t.id;
          const icon = TOPIC_ICON_MAP[t.id] || faHouse;
          const practicedCount = getTopicPracticedCount(t.id);
          const isComplete = practicedCount === t.questions.length;

          return (
            <button
              key={t.id}
              onClick={() => {
                onSelectTopic(t.id);
                onScrollToTopic(t.id);
              }}
              className={`flex items-center gap-1.5 min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border shrink-0 active:scale-95 ${
                isSelected
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-xs font-bold"
                  : isComplete
                  ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800"
                  : "bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
              }`}
            >
              <FontAwesomeIcon
                icon={icon}
                className={`text-xs ${
                  isSelected
                    ? "text-white"
                    : isComplete
                    ? "text-emerald-500"
                    : "text-indigo-500 dark:text-indigo-400"
                }`}
              />
              <span>
                {t.id}. {t.title.split("–")[0].split("-")[0].trim()}
              </span>
              {practicedCount > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected
                      ? "bg-indigo-700 text-indigo-100"
                      : isComplete
                      ? "bg-emerald-200 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100"
                      : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {practicedCount}/{t.questions.length}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
