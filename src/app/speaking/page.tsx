"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import Navbar from "@/components/Navbar";
import VoiceControlsBar from "@/components/speaking/VoiceControlsBar";
import TopicNavPills from "@/components/speaking/TopicNavPills";
import TopicSection from "@/components/speaking/TopicSection";
import TopicCardsGrid from "@/components/speaking/TopicCardsGrid";
import FloatingAudioPlayer from "@/components/speaking/FloatingAudioPlayer";
import { SPEAKING_TOPICS, SpeakingTopic } from "@/data/speakingPart1";
import { useSpeakingAudio } from "@/hooks/useSpeakingAudio";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faComments,
  faLayerGroup,
  faArrowUp,
  faArrowLeft,
  faArrowRight,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

export default function SpeakingPage() {
  const {
    voices,
    britishVoices,
    otherVoices,
    selectedVoice,
    rate,
    isPlaying,
    isPaused,
    activeAudioId,
    activePhase,
    changeVoice,
    changeRate,
    stop,
    pause,
    resume,
    playSingle,
    playBoth,
  } = useSpeakingAudio();

  const [practicedIds, setPracticedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"cards" | "topic" | "all">("cards");

  // Continuous Topic Playlist State
  const [topicPlayState, setTopicPlayState] = useState<{
    topicId: number;
    qIndex: number;
  } | null>(null);

  // Load practiced items from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("speaking_practiced_ids");
      if (saved) {
        setPracticedIds(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load practiced items", e);
    }
  }, []);

  const togglePracticed = (id: string) => {
    setPracticedIds((prev) => {
      const updated = prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id];
      try {
        localStorage.setItem("speaking_practiced_ids", JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  // Filtered Topics based on Search and ViewMode
  const filteredTopics = useMemo(() => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return SPEAKING_TOPICS.map((topic) => {
        const topicMatches = topic.title.toLowerCase().includes(q);
        const matchingQuestions = topic.questions.filter(
          (question) =>
            question.question.toLowerCase().includes(q) ||
            question.answer.toLowerCase().includes(q)
        );

        if (topicMatches) {
          return topic;
        }
        if (matchingQuestions.length > 0) {
          return {
            ...topic,
            questions: matchingQuestions,
          };
        }
        return null;
      }).filter((t): t is SpeakingTopic => t !== null);
    }

    if (viewMode === "topic" && selectedTopicId !== null) {
      return SPEAKING_TOPICS.filter((t) => t.id === selectedTopicId);
    }

    return SPEAKING_TOPICS;
  }, [searchQuery, selectedTopicId, viewMode]);

  // Scroll to topic section smoothly
  const scrollToTopic = (topicId: number) => {
    setTimeout(() => {
      const el = document.getElementById(`topic-section-${topicId}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 50);
  };

  // Test voice handler
  const handleTestVoice = () => {
    const testText =
      "Hello! I am your speaking partner for IELTS Speaking Part 1. You can listen to each question and answer with a natural British accent.";
    playSingle(testText, "test-voice", "single");
  };

  // Play All in Topic logic
  const playTopicQuestionAtIndex = useCallback(
    (topic: SpeakingTopic, index: number) => {
      if (index >= topic.questions.length) {
        stop();
        setTopicPlayState(null);
        return;
      }

      setTopicPlayState({ topicId: topic.id, qIndex: index });
      const currentQ = topic.questions[index];
      const audioId = `topic-${topic.id}-${currentQ.id}`;

      // Scroll to current question
      const qEl = document.getElementById(`q-card-${topic.id}-${currentQ.id}`);
      if (qEl) {
        qEl.scrollIntoView({ behavior: "smooth", block: "center" });
      }

      playBoth(currentQ.question, currentQ.answer, audioId, () => {
        playTopicQuestionAtIndex(topic, index + 1);
      });
    },
    [playBoth, stop]
  );

  const handlePlayTopicAll = useCallback(
    (topic: SpeakingTopic) => {
      if (topicPlayState && topicPlayState.topicId === topic.id && isPlaying) {
        stop();
        setTopicPlayState(null);
      } else {
        playTopicQuestionAtIndex(topic, 0);
      }
    },
    [topicPlayState, isPlaying, stop, playTopicQuestionAtIndex]
  );

  const handleNextInTopic = () => {
    if (!topicPlayState) return;
    const topic = SPEAKING_TOPICS.find((t) => t.id === topicPlayState.topicId);
    if (topic && topicPlayState.qIndex < topic.questions.length - 1) {
      playTopicQuestionAtIndex(topic, topicPlayState.qIndex + 1);
    }
  };

  const handlePrevInTopic = () => {
    if (!topicPlayState) return;
    const topic = SPEAKING_TOPICS.find((t) => t.id === topicPlayState.topicId);
    if (topic && topicPlayState.qIndex > 0) {
      playTopicQuestionAtIndex(topic, topicPlayState.qIndex - 1);
    }
  };

  const handleStopAll = () => {
    stop();
    setTopicPlayState(null);
  };

  // Floating Player Info
  const currentActiveInfo = useMemo(() => {
    if (topicPlayState) {
      const topic = SPEAKING_TOPICS.find((t) => t.id === topicPlayState.topicId);
      const q = topic?.questions[topicPlayState.qIndex];
      return {
        topicTitle: topic?.title,
        questionNumber: q?.questionNumber,
        questionText: q?.question,
        hasNext: topic ? topicPlayState.qIndex < topic.questions.length - 1 : false,
        hasPrev: topicPlayState.qIndex > 0,
      };
    }
    if (activeAudioId) {
      const parts = activeAudioId.split("-");
      if (parts.length >= 3) {
        const tId = parseInt(parts[1], 10);
        const qId = parseInt(parts[2], 10);
        const topic = SPEAKING_TOPICS.find((t) => t.id === tId);
        const q = topic?.questions.find((item) => item.id === qId);
        return {
          topicTitle: topic?.title,
          questionNumber: q?.questionNumber,
          questionText: q?.question,
          hasNext: false,
          hasPrev: false,
        };
      }
    }
    return {
      topicTitle: "Audio Preview",
      questionNumber: undefined,
      questionText: undefined,
      hasNext: false,
      hasPrev: false,
    };
  }, [topicPlayState, activeAudioId]);

  const totalQuestions = 180;
  const totalPracticed = practicedIds.length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200">
      {/* Unified Top Navbar with Vocabulary & Speaking Part 1 */}
      <Navbar activeSection="speaking" />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Voice Controls & Search Header */}
        <VoiceControlsBar
          voices={voices}
          britishVoices={britishVoices}
          otherVoices={otherVoices}
          selectedVoice={selectedVoice}
          rate={rate}
          isPlaying={isPlaying}
          searchQuery={searchQuery}
          totalPracticed={totalPracticed}
          totalQuestions={totalQuestions}
          onChangeVoice={changeVoice}
          onChangeRate={changeRate}
          onSearchChange={setSearchQuery}
          onTestVoice={handleTestVoice}
          onStop={handleStopAll}
        />

        {/* Search Results Notice */}
        {searchQuery ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900 text-xs text-indigo-800 dark:text-indigo-200">
              <span>
                Showing results for &ldquo;<strong>{searchQuery}</strong>&rdquo; across {filteredTopics.length} topic
                {filteredTopics.length !== 1 ? "s" : ""}.
              </span>
              <button
                onClick={() => setSearchQuery("")}
                className="font-bold underline hover:no-underline ml-2"
              >
                Clear Search
              </button>
            </div>

            {filteredTopics.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 mx-auto flex items-center justify-center text-slate-400">
                  <FontAwesomeIcon icon={faComments} className="text-xl" />
                </div>
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                  No topics or questions matched your search
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try searching for common themes like &ldquo;hometown&rdquo;, &ldquo;routine&rdquo;, &ldquo;travel&rdquo;, or &ldquo;music&rdquo;.
                </p>
                <button
                  onClick={() => setSearchQuery("")}
                  className="mt-2 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white shadow-sm"
                >
                  Reset Search
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredTopics.map((topic) => (
                  <TopicSection
                    key={topic.id}
                    topic={topic}
                    practicedIds={practicedIds}
                    onTogglePracticed={togglePracticed}
                    activeAudioId={activeAudioId}
                    activePhase={activePhase}
                    isPlaying={isPlaying}
                    onPlaySingle={playSingle}
                    onPlayBoth={playBoth}
                    onStop={handleStopAll}
                    onPlayTopicAll={handlePlayTopicAll}
                    searchHighlight={searchQuery}
                  />
                ))}
              </div>
            )}
          </div>
        ) : viewMode === "cards" ? (
          /* Card-Type View: 15 Topic Cards Grid */
          <TopicCardsGrid
            topics={SPEAKING_TOPICS}
            practicedIds={practicedIds}
            onSelectTopic={(topicId) => {
              setSelectedTopicId(topicId);
              setViewMode("topic");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onSelectAllTopics={() => {
              setSelectedTopicId(null);
              setViewMode("all");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        ) : (
          /* Topic View or All Topics View */
          <div className="space-y-4 sm:space-y-6">
            {/* Topic Quick Jump Pills & View Switcher */}
            <TopicNavPills
              topics={SPEAKING_TOPICS}
              selectedTopicId={selectedTopicId}
              practicedIds={practicedIds}
              onSelectTopic={(id) => {
                setSelectedTopicId(id);
                if (id !== null) setViewMode("topic");
                else setViewMode("all");
              }}
              onScrollToTopic={scrollToTopic}
              viewMode={viewMode}
              setViewMode={setViewMode}
            />

            {/* In Single Topic Focus: Top Navigation bar between topics */}
            {viewMode === "topic" && selectedTopicId !== null && (
              <div className="flex items-center justify-between gap-2 p-2.5 sm:p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs">
                <button
                  onClick={() => {
                    setViewMode("cards");
                    setSelectedTopicId(null);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 transition active:scale-95 min-h-[36px]"
                >
                  <FontAwesomeIcon icon={faArrowLeft} className="text-xs" />
                  <span>All 15 Cards</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    disabled={selectedTopicId <= 1}
                    onClick={() => {
                      if (selectedTopicId > 1) {
                        setSelectedTopicId(selectedTopicId - 1);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }
                    }}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl font-semibold transition min-h-[36px] ${
                      selectedTopicId <= 1
                        ? "opacity-30 cursor-not-allowed text-slate-400"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95"
                    }`}
                    title="Previous Topic"
                  >
                    <FontAwesomeIcon icon={faChevronLeft} className="text-xs" />
                    <span className="hidden sm:inline">Prev</span>
                  </button>

                  <span className="font-bold text-slate-800 dark:text-slate-200 px-2">
                    Topic {selectedTopicId} / 15
                  </span>

                  <button
                    disabled={selectedTopicId >= SPEAKING_TOPICS.length}
                    onClick={() => {
                      if (selectedTopicId < SPEAKING_TOPICS.length) {
                        setSelectedTopicId(selectedTopicId + 1);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }
                    }}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl font-semibold transition min-h-[36px] ${
                      selectedTopicId >= SPEAKING_TOPICS.length
                        ? "opacity-30 cursor-not-allowed text-slate-400"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95"
                    }`}
                    title="Next Topic"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
                  </button>
                </div>
              </div>
            )}

            {/* Display Topic Sections */}
            <div className="space-y-6 sm:space-y-8">
              {filteredTopics.map((topic) => (
                <TopicSection
                  key={topic.id}
                  topic={topic}
                  practicedIds={practicedIds}
                  onTogglePracticed={togglePracticed}
                  activeAudioId={activeAudioId}
                  activePhase={activePhase}
                  isPlaying={isPlaying}
                  onPlaySingle={playSingle}
                  onPlayBoth={playBoth}
                  onStop={handleStopAll}
                  onPlayTopicAll={handlePlayTopicAll}
                  searchHighlight={searchQuery}
                />
              ))}
            </div>
          </div>
        )}

        {/* Scroll to Top helper button */}
        <div className="flex justify-center pt-6 pb-12">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-indigo-400 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 shadow-sm transition-all min-h-[38px] active:scale-95"
          >
            <FontAwesomeIcon icon={faArrowUp} />
            <span>Back to Top</span>
          </button>
        </div>
      </main>

      {/* Floating Audio Player when speech is playing or paused */}
      <FloatingAudioPlayer
        isPlaying={isPlaying}
        isPaused={isPaused}
        topicTitle={currentActiveInfo.topicTitle}
        questionNumber={currentActiveInfo.questionNumber}
        questionText={currentActiveInfo.questionText}
        activePhase={activePhase}
        onPause={pause}
        onResume={resume}
        onStop={handleStopAll}
        onPrev={topicPlayState ? handlePrevInTopic : undefined}
        onNext={topicPlayState ? handleNextInTopic : undefined}
        hasPrev={currentActiveInfo.hasPrev}
        hasNext={currentActiveInfo.hasNext}
      />
    </div>
  );
}
