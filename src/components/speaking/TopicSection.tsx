"use client";

import React, { useState } from "react";
import { SpeakingTopic, SpeakingQuestion } from "@/data/speakingPart1";
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
  faPlay,
  faStop,
  faVolumeHigh,
  faHeadphones,
  faCheck,
  faCopy,
  faChevronDown,
  faChevronUp,
  faComments,
  faWaveSquare,
} from "@fortawesome/free-solid-svg-icons";
import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";

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

interface TopicSectionProps {
  topic: SpeakingTopic;
  practicedIds: string[];
  onTogglePracticed: (id: string) => void;
  activeAudioId: string | null;
  activePhase: "question" | "answer" | "single" | null;
  isPlaying: boolean;
  onPlaySingle: (text: string, audioId: string, phase: "question" | "answer" | "single") => void;
  onPlayBoth: (question: string, answer: string, baseAudioId: string) => void;
  onStop: () => void;
  onPlayTopicAll: (topic: SpeakingTopic) => void;
  searchHighlight?: string;
}

export default function TopicSection({
  topic,
  practicedIds,
  onTogglePracticed,
  activeAudioId,
  activePhase,
  isPlaying,
  onPlaySingle,
  onPlayBoth,
  onStop,
  onPlayTopicAll,
}: TopicSectionProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [copiedTopic, setCopiedTopic] = useState(false);
  const [copiedQId, setCopiedQId] = useState<number | null>(null);

  const icon = TOPIC_ICON_MAP[topic.id] || faHouse;
  const topicPracticedCount = topic.questions.filter((q) =>
    practicedIds.includes(`t${topic.id}-q${q.id}`)
  ).length;

  const isTopicPlaying = activeAudioId?.startsWith(`topic-${topic.id}-`);

  const copyTopicAnswers = (e: React.MouseEvent) => {
    e.stopPropagation();
    const formatted = `${topic.id}. ${topic.title}\n\n` +
      topic.questions
        .map((q) => `${q.fullQuestion}\n${q.answer}\n`)
        .join("\n");
    navigator.clipboard.writeText(formatted);
    setCopiedTopic(true);
    setTimeout(() => setCopiedTopic(false), 2000);
  };

  const copyQuestion = (q: SpeakingQuestion) => {
    navigator.clipboard.writeText(`${q.fullQuestion}\n\n${q.answer}`);
    setCopiedQId(q.id);
    setTimeout(() => setCopiedQId(null), 1500);
  };

  return (
    <section
      id={`topic-section-${topic.id}`}
      className="scroll-mt-20 sm:scroll-mt-24 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300"
    >
      {/* Section Header - Mobile Optimized */}
      <div className="p-4 sm:p-6 bg-gradient-to-r from-slate-50 via-indigo-50/25 to-slate-50 dark:from-slate-900 dark:via-indigo-950/20 dark:to-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
          {/* Topic Title & Icon */}
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white text-base sm:text-lg shadow-md shadow-indigo-500/20 shrink-0">
              <FontAwesomeIcon icon={icon} />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900 shrink-0">
                  Topic {topic.id.toString().padStart(2, "0")}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {topic.questions.length} Questions
                </span>
                {topicPracticedCount > 0 && (
                  <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                    <FontAwesomeIcon icon={faCheck} className="text-[9px]" />
                    {topicPracticedCount}/{topic.questions.length} Done
                  </span>
                )}
              </div>
              <h2 className="text-base sm:text-xl font-black text-slate-900 dark:text-white tracking-tight mt-1 leading-snug">
                {topic.title}
              </h2>
            </div>
          </div>

          {/* Section Action Controls - Accessible on Mobile */}
          <div className="flex items-center gap-2 self-stretch sm:self-center justify-end">
            {/* Play All Questions in Topic */}
            <button
              onClick={() => onPlayTopicAll(topic)}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-xs transition-all active:scale-95 ${
                isTopicPlaying
                  ? "bg-indigo-700 text-white animate-pulse"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/30"
              }`}
              title="Continuously play all questions & answers in this topic"
            >
              <FontAwesomeIcon icon={isTopicPlaying ? faStop : faHeadphones} className="text-xs" />
              <span>{isTopicPlaying ? "Playing..." : "Play Entire Topic"}</span>
            </button>

            {/* Copy Topic Button */}
            <button
              onClick={copyTopicAnswers}
              className="min-h-[38px] min-w-[38px] flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors border border-slate-200 dark:border-slate-700 active:scale-95"
              title="Copy all questions & answers in this topic"
            >
              <FontAwesomeIcon icon={copiedTopic ? faCheck : faCopy} className={copiedTopic ? "text-emerald-500 text-xs" : "text-xs"} />
              <span className="hidden sm:inline">{copiedTopic ? "Copied" : "Copy"}</span>
            </button>

            {/* Collapse/Expand Toggle */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="min-h-[38px] min-w-[38px] flex items-center justify-center rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700 active:scale-95"
              title={collapsed ? "Expand Section" : "Collapse Section"}
            >
              <FontAwesomeIcon icon={collapsed ? faChevronDown : faChevronUp} className="text-xs" />
            </button>
          </div>
        </div>
      </div>

      {/* Section Content: 12 Questions */}
      {!collapsed && (
        <div className="p-3.5 sm:p-6 space-y-3.5 sm:space-y-4">
          <div className="grid grid-cols-1 gap-3.5 sm:gap-4">
            {topic.questions.map((q) => {
              const qUniqueId = `t${topic.id}-q${q.id}`;
              const isPracticed = practicedIds.includes(qUniqueId);

              const qAudioId = `q-${topic.id}-${q.id}`;
              const aAudioId = `a-${topic.id}-${q.id}`;
              const bothAudioId = `both-${topic.id}-${q.id}`;

              const isQPlaying =
                isPlaying &&
                ((activeAudioId === qAudioId && activePhase === "question") ||
                  (activeAudioId === bothAudioId && activePhase === "question") ||
                  (activeAudioId === `topic-${topic.id}-${q.id}` && activePhase === "question"));

              const isAPlaying =
                isPlaying &&
                ((activeAudioId === aAudioId && activePhase === "answer") ||
                  (activeAudioId === bothAudioId && activePhase === "answer") ||
                  (activeAudioId === `topic-${topic.id}-${q.id}` && activePhase === "answer"));

              const isItemPlaying =
                isPlaying &&
                (activeAudioId === qAudioId ||
                  activeAudioId === aAudioId ||
                  activeAudioId === bothAudioId ||
                  activeAudioId === `topic-${topic.id}-${q.id}`);

              return (
                <div
                  key={q.id}
                  id={`q-card-${topic.id}-${q.id}`}
                  className={`p-3.5 sm:p-5 rounded-2xl border transition-all duration-200 ${
                    isItemPlaying
                      ? "border-indigo-400 dark:border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/25 shadow-md ring-2 ring-indigo-500/20"
                      : isPracticed
                      ? "border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/20 dark:bg-emerald-950/10"
                      : "border-slate-200/90 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 hover:border-slate-300 dark:hover:border-slate-700"
                  }`}
                >
                  {/* Top: Question line & Quick Actions */}
                  <div className="flex items-start justify-between gap-2.5">
                    <div className="flex items-start gap-2.5 min-w-0">
                      {/* Question Number Badge */}
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-lg shrink-0 mt-0.5 ${
                          isQPlaying
                            ? "bg-indigo-600 text-white animate-pulse"
                            : "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        Q{q.questionNumber}
                      </span>

                      {/* Question text */}
                      <div className="min-w-0">
                        <h3
                          className={`text-sm sm:text-base font-bold leading-snug sm:leading-relaxed transition-colors ${
                            isQPlaying
                              ? "text-indigo-700 dark:text-indigo-400 font-extrabold"
                              : "text-slate-900 dark:text-slate-100"
                          }`}
                        >
                          {q.question}
                        </h3>

                        {/* Speaking wave status */}
                        {isQPlaying && (
                          <div className="flex items-center gap-1.5 mt-1 text-xs text-indigo-600 dark:text-indigo-400 font-semibold animate-pulse">
                            <FontAwesomeIcon icon={faWaveSquare} />
                            <span>Speaking question...</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Quick item actions */}
                    <div className="flex items-center gap-1 shrink-0">
                      {/* Mark practiced toggle */}
                      <button
                        onClick={() => onTogglePracticed(qUniqueId)}
                        className={`min-h-[34px] flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold transition-all active:scale-95 ${
                          isPracticed
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                            : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-800"
                        }`}
                        title={isPracticed ? "Practiced! Tap to unmark" : "Mark as practiced"}
                      >
                        <FontAwesomeIcon icon={isPracticed ? faCheck : faCircleCheck} />
                        <span className="hidden xs:inline">{isPracticed ? "Done" : "Practice"}</span>
                      </button>

                      {/* Copy Question & Answer */}
                      <button
                        onClick={() => copyQuestion(q)}
                        className="min-h-[34px] min-w-[34px] flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors border border-slate-200/60 dark:border-slate-800 active:scale-95"
                        title="Copy question and answer"
                      >
                        <FontAwesomeIcon
                          icon={copiedQId === q.id ? faCheck : faCopy}
                          className={copiedQId === q.id ? "text-emerald-500 text-xs" : "text-xs"}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Audio Controls Bar - Mobile Friendly Touch Buttons */}
                  <div className="mt-3 pt-3 border-t border-slate-200/70 dark:border-slate-800">
                    <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                      {/* Listen to Question */}
                      <button
                        onClick={() => {
                          if (isQPlaying) onStop();
                          else onPlaySingle(q.question, qAudioId, "question");
                        }}
                        className={`min-h-[38px] flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-xl text-xs font-semibold transition-all active:scale-95 ${
                          isQPlaying
                            ? "bg-indigo-600 text-white font-bold shadow-xs"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-indigo-100 dark:hover:bg-indigo-950/60 hover:text-indigo-700 dark:hover:text-indigo-300"
                        }`}
                        title="Listen to question spoken in natural British accent"
                      >
                        <FontAwesomeIcon icon={isQPlaying ? faStop : faPlay} className="text-[10px]" />
                        <span>Question</span>
                      </button>

                      {/* Listen to Answer */}
                      <button
                        onClick={() => {
                          if (isAPlaying) onStop();
                          else onPlaySingle(q.answer, aAudioId, "answer");
                        }}
                        className={`min-h-[38px] flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-xl text-xs font-semibold transition-all active:scale-95 ${
                          isAPlaying
                            ? "bg-emerald-600 text-white font-bold shadow-xs"
                            : "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/70 dark:border-emerald-800/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/50"
                        }`}
                        title="Listen to answer spoken in natural British accent"
                      >
                        <FontAwesomeIcon icon={isAPlaying ? faStop : faPlay} className="text-[10px]" />
                        <span>Answer</span>
                      </button>

                      {/* Listen to Both (Q & A) */}
                      <button
                        onClick={() => {
                          if (activeAudioId === bothAudioId && isPlaying) onStop();
                          else onPlayBoth(q.question, q.answer, bothAudioId);
                        }}
                        className={`min-h-[38px] flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 ${
                          activeAudioId === bothAudioId && isPlaying
                            ? "bg-indigo-600 text-white shadow-xs"
                            : "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900 hover:bg-indigo-100 dark:hover:bg-indigo-900/60"
                        }`}
                        title="Listen to Question followed by Answer"
                      >
                        <FontAwesomeIcon
                          icon={activeAudioId === bothAudioId && isPlaying ? faStop : faHeadphones}
                          className="text-[10px]"
                        />
                        <span>Both (Q&A)</span>
                      </button>
                    </div>

                    {/* Active playing indicator badge on mobile */}
                    {isItemPlaying && (
                      <div className="mt-2 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-100/70 dark:bg-indigo-950/80 px-2.5 py-1 rounded-lg">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                          {isQPlaying ? "Reading Question" : isAPlaying ? "Reading Answer" : "Playing Q&A"}
                        </span>
                        <button
                          onClick={onStop}
                          className="text-[11px] underline font-bold hover:no-underline"
                        >
                          Stop
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Eye-Comfort Green Answer Box */}
                  <div
                    className={`mt-3 p-3.5 sm:p-4 rounded-xl border-l-4 transition-all duration-200 ${
                      isAPlaying
                        ? "bg-emerald-100/80 dark:bg-emerald-950/60 border-l-emerald-600 dark:border-l-emerald-400 border-t border-r border-b border-emerald-300 dark:border-emerald-700 shadow-sm ring-2 ring-emerald-500/20"
                        : "bg-emerald-50/70 dark:bg-emerald-950/30 border-l-emerald-500 dark:border-l-emerald-500 border-t border-r border-b border-emerald-200/70 dark:border-emerald-800/50"
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5 shrink-0">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-xs">
                          <FontAwesomeIcon icon={faComments} />
                        </span>
                      </div>
                      <div className="space-y-1.5 min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                            Model Answer
                          </span>
                          {isAPlaying && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 animate-pulse">
                              <FontAwesomeIcon icon={faWaveSquare} />
                              <span>Speaking...</span>
                            </span>
                          )}
                        </div>
                        <p
                          className={`text-xs sm:text-sm leading-relaxed sm:leading-relaxed ${
                            isAPlaying
                              ? "text-emerald-950 dark:text-emerald-50 font-medium"
                              : "text-emerald-900 dark:text-emerald-100/90 font-normal"
                          }`}
                        >
                          {q.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
