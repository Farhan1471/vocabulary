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
  faCheck,
  faArrowRight,
  faHeadphones,
} from "@fortawesome/free-solid-svg-icons";

export const TOPIC_ICON_MAP: Record<number, any> = {
  1: faBuilding, // Hometown – Meherpur
  2: faHouse, // Home and Accommodation
  3: faBriefcase, // Work or Study
  4: faClock, // Daily Routine
  5: faPlane, // Hobbies – Travelling
  6: faFilm, // Free Time – Movies
  7: faUsers, // Friends
  8: faHeart, // Family
  9: faUtensils, // Food
  10: faMusic, // Music
  11: faBaseballBatBall, // Sports
  12: faSnowflake, // Weather
  13: faBookOpen, // Reading
  14: faBagShopping, // Shopping
  15: faLaptop, // Technology
};

interface TopicCardsGridProps {
  topics: SpeakingTopic[];
  practicedIds: string[];
  onSelectTopic: (topicId: number) => void;
  onSelectAllTopics: () => void;
}

export default function TopicCardsGrid({
  topics,
  practicedIds,
  onSelectTopic,
  onSelectAllTopics,
}: TopicCardsGridProps) {
  const getTopicPracticedCount = (topicId: number) => {
    return practicedIds.filter((id) => id.startsWith(`t${topicId}-`)).length;
  };

  const totalPracticed = practicedIds.length;
  const totalQuestions = topics.reduce((acc, t) => acc + t.questions.length, 0);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Overview Card / Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                IELTS Speaking Part 1
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                15 Topics • 180 Q&A
              </span>
            </div>
            <h2 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
              Select a Topic to Practice
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Tap any topic card below to open its 12 model questions and answers with natural British accent audio.
            </p>
          </div>

          {/* Quick All Topics Button */}
          <button
            onClick={onSelectAllTopics}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs sm:text-sm transition-all shadow-xs active:scale-95 shrink-0 min-h-[42px]"
          >
            <FontAwesomeIcon icon={faLayerGroup} />
            <span>View All Topics (180 Q&A)</span>
          </button>
        </div>

        {/* Global Progress Bar */}
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
            <span className="text-slate-500 dark:text-slate-400">
              Overall Practice Progress:
            </span>
            <span className="text-emerald-600 dark:text-emerald-400">
              {totalPracticed} / {totalQuestions} Questions Practiced ({Math.round((totalPracticed / totalQuestions) * 100)}%)
            </span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(totalPracticed / totalQuestions) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* 15 Topic Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {/* Card 0: All Topics Card */}
        <div
          onClick={onSelectAllTopics}
          className="group cursor-pointer p-4 sm:p-5 rounded-2xl border-2 border-dashed border-indigo-200 dark:border-indigo-900/80 bg-indigo-50/30 dark:bg-indigo-950/20 hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-md transition-all flex flex-col justify-between active:scale-[0.99] touch-manipulation"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-lg bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300">
                All 15 Topics
              </span>
              <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-xs group-hover:scale-110 transition-transform">
                <FontAwesomeIcon icon={faLayerGroup} />
              </span>
            </div>
            <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              All Topics (সকল টপিক একসাথে)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
              Browse, play audio, and practice all 180 questions across all 15 topics in one continuous list.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-indigo-100 dark:border-indigo-900/50 flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400">
            <span>180 Q&A with British Audio</span>
            <FontAwesomeIcon icon={faArrowRight} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* 15 Topic Cards */}
        {topics.map((topic) => {
          const icon = TOPIC_ICON_MAP[topic.id] || faHouse;
          const practicedCount = getTopicPracticedCount(topic.id);
          const isAllPracticed = practicedCount === topic.questions.length && topic.questions.length > 0;

          return (
            <div
              key={topic.id}
              onClick={() => onSelectTopic(topic.id)}
              className="group cursor-pointer p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-400 dark:hover:border-indigo-600 hover:shadow-md transition-all flex flex-col justify-between active:scale-[0.99] touch-manipulation"
            >
              <div>
                {/* Card Top: Topic Number & Icon */}
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    Topic {topic.id.toString().padStart(2, "0")}
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs group-hover:scale-110 transition-transform">
                    <FontAwesomeIcon icon={icon} />
                  </div>
                </div>

                {/* Topic Title */}
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug">
                  {topic.title}
                </h3>

                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                  {topic.questions.length} Questions & Answers
                </p>
              </div>

              {/* Card Footer: Progress & Arrow */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  {practicedCount > 0 ? (
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md ${
                        isAllPracticed
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400"
                      }`}
                    >
                      <FontAwesomeIcon icon={faCheck} className="text-[9px]" />
                      <span>
                        {practicedCount}/{topic.questions.length} Done
                      </span>
                    </span>
                  ) : (
                    <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 flex items-center gap-1">
                      <FontAwesomeIcon icon={faHeadphones} className="text-[10px]" />
                      <span>Ready to practice</span>
                    </span>
                  )}
                </div>

                <span className="text-xs font-bold text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 flex items-center gap-1 transition-colors">
                  <span className="hidden xs:inline">Open</span>
                  <FontAwesomeIcon icon={faArrowRight} className="text-[10px] group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
