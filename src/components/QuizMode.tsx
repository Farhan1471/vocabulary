"use client";

import React, { useState, useEffect } from "react";
import { useVocabulary } from "@/context/VocabularyContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faCircleXmark,
  faTrophy,
  faRotateRight,
  faVolumeHigh,
  faArrowRight,
  faFire,
  faBolt,
  faLightbulb,
} from "@fortawesome/free-solid-svg-icons";
import confetti from "canvas-confetti";
import { WordItem } from "@/data/vocabulary";

type QuizType = "word-to-bangla" | "word-to-synonym" | "bangla-to-word";

interface Question {
  targetWord: WordItem;
  prompt: string;
  subPrompt: string;
  options: string[];
  correctAnswer: string;
}

export default function QuizMode() {
  const { words, markMastered, speakWord } = useVocabulary();

  const [quizType, setQuizType] = useState<QuizType>("word-to-bangla");
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [gameState, setGameState] = useState<"setup" | "playing" | "results">("setup");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState<{ question: Question; selected: string }[]>([]);

  const startQuiz = () => {
    // Generate randomized questions
    const shuffledWords = [...words].sort(() => Math.random() - 0.5).slice(0, questionCount);

    const generated: Question[] = shuffledWords.map((word) => {
      let prompt = "";
      let subPrompt = "";
      let correctAnswer = "";
      const otherWords = words.filter((w) => w.id !== word.id).sort(() => Math.random() - 0.5);

      if (quizType === "word-to-bangla") {
        prompt = word.word;
        subPrompt = "সঠিক বাংলা অর্থ কোনটি?";
        correctAnswer = word.bangla;
        const distractors = otherWords.slice(0, 3).map((w) => w.bangla);
        const options = [...distractors, correctAnswer].sort(() => Math.random() - 0.5);
        return { targetWord: word, prompt, subPrompt, options, correctAnswer };
      } else if (quizType === "word-to-synonym") {
        prompt = word.word;
        subPrompt = `What is the best synonym for "${word.word}"?`;
        correctAnswer = word.synonyms[0];
        const distractors = otherWords.slice(0, 3).map((w) => w.synonyms[0]);
        const options = [...distractors, correctAnswer].sort(() => Math.random() - 0.5);
        return { targetWord: word, prompt, subPrompt, options, correctAnswer };
      } else {
        // bangla-to-word
        prompt = word.bangla;
        subPrompt = "Which English word matches this meaning?";
        correctAnswer = word.word;
        const distractors = otherWords.slice(0, 3).map((w) => w.word);
        const options = [...distractors, correctAnswer].sort(() => Math.random() - 0.5);
        return { targetWord: word, prompt, subPrompt, options, correctAnswer };
      }
    });

    setQuestions(generated);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setStreak(0);
    setWrongAnswers([]);
    setGameState("playing");
  };

  const currentQ = questions[currentIndex];

  const handleSelectOption = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
    setIsAnswered(true);

    const isCorrect = option === currentQ.correctAnswer;
    if (isCorrect) {
      setScore((s) => s + 1);
      setStreak((st) => st + 1);
      markMastered(currentQ.targetWord.id);
    } else {
      setStreak(0);
      setWrongAnswers((prev) => [...prev, { question: currentQ, selected: option }]);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setGameState("results");
      // Fire confetti celebration
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        console.error(e);
      }
    }
  };

  if (gameState === "setup") {
    return (
      <div className="max-w-xl mx-auto bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 text-2xl shadow-inner mb-2">
            <FontAwesomeIcon icon={faTrophy} />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Vocabulary Quiz Challenge
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-bangla">
            আপনার শব্দভাণ্ডার যাচাই করতে এবং দ্রুত রিভিশন দিতে কুইজে অংশ নিন!
          </p>
        </div>

        {/* Quiz Type Selector */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Select Quiz Mode
          </label>
          <div className="grid grid-cols-1 gap-2.5">
            <button
              onClick={() => setQuizType("word-to-bangla")}
              className={`p-4 rounded-xl border text-left transition flex items-center justify-between ${
                quizType === "word-to-bangla"
                  ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 shadow-xs"
                  : "bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-300"
              }`}
            >
              <div>
                <div className="font-bold text-sm text-slate-900 dark:text-white">
                  1. English Word → Bangla Meaning
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-bangla mt-0.5">
                  ইংরেজি শব্দ দেখে সঠিক বাংলা অর্থ চিহ্নিত করুন
                </div>
              </div>
              <div
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  quizType === "word-to-bangla"
                    ? "border-emerald-600 bg-emerald-600"
                    : "border-slate-300"
                }`}
              >
                {quizType === "word-to-bangla" && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
            </button>

            <button
              onClick={() => setQuizType("word-to-synonym")}
              className={`p-4 rounded-xl border text-left transition flex items-center justify-between ${
                quizType === "word-to-synonym"
                  ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 shadow-xs"
                  : "bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-300"
              }`}
            >
              <div>
                <div className="font-bold text-sm text-slate-900 dark:text-white">
                  2. English Word → Synonym
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Find the closest matching synonym for the word
                </div>
              </div>
              <div
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  quizType === "word-to-synonym"
                    ? "border-emerald-600 bg-emerald-600"
                    : "border-slate-300"
                }`}
              >
                {quizType === "word-to-synonym" && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
            </button>

            <button
              onClick={() => setQuizType("bangla-to-word")}
              className={`p-4 rounded-xl border text-left transition flex items-center justify-between ${
                quizType === "bangla-to-word"
                  ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 shadow-xs"
                  : "bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-300"
              }`}
            >
              <div>
                <div className="font-bold text-sm text-slate-900 dark:text-white">
                  3. Bangla Meaning → English Word
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-bangla mt-0.5">
                  বাংলা অর্থ দেখে সঠিক ইংরেজি শব্দটি খুঁজে বের করুন
                </div>
              </div>
              <div
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  quizType === "bangla-to-word"
                    ? "border-emerald-600 bg-emerald-600"
                    : "border-slate-300"
                }`}
              >
                {quizType === "bangla-to-word" && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
            </button>
          </div>
        </div>

        {/* Question Count */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Number of Questions
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[10, 20, 30].map((num) => (
              <button
                key={num}
                onClick={() => setQuestionCount(num)}
                className={`py-2.5 rounded-xl text-sm font-bold border transition ${
                  questionCount === num
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                    : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50"
                }`}
              >
                {num} Questions
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={startQuiz}
          className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base shadow-lg shadow-emerald-600/30 transition active:scale-98"
        >
          Start Quiz Now 🚀
        </button>
      </div>
    );
  }

  if (gameState === "playing" && currentQ) {
    const progress = Math.round(((currentIndex + 1) / questions.length) * 100);

    return (
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Top Info Bar */}
        <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">
          <span>
            Question <strong className="text-slate-800 dark:text-white">{currentIndex + 1}</strong> of{" "}
            {questions.length}
          </span>
          <div className="flex items-center gap-4">
            {streak > 1 && (
              <span className="flex items-center gap-1 text-amber-500 font-bold">
                <FontAwesomeIcon icon={faFire} /> {streak} Streak!
              </span>
            )}
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">
              Score: {score} / {currentIndex + (isAnswered ? 1 : 0)}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
          <div
            className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Question Box */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl">
          <div className="text-center space-y-3">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bangla">
              {currentQ.subPrompt}
            </span>
            <div className="flex items-center justify-center gap-2">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                {currentQ.prompt}
              </h2>
              {quizType !== "bangla-to-word" && (
                <button
                  onClick={() => speakWord(currentQ.prompt)}
                  className="p-2 text-emerald-600 hover:text-emerald-700"
                  title="Pronounce"
                >
                  <FontAwesomeIcon icon={faVolumeHigh} />
                </button>
              )}
            </div>
          </div>

          {/* Options Grid */}
          <div className="mt-8 grid grid-cols-1 gap-3">
            {currentQ.options.map((option, idx) => {
              let btnStyle = "bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:border-emerald-400";
              let icon = null;

              if (isAnswered) {
                if (option === currentQ.correctAnswer) {
                  btnStyle = "bg-emerald-100 dark:bg-emerald-950/70 border-emerald-500 text-emerald-900 dark:text-emerald-100 font-bold";
                  icon = <FontAwesomeIcon icon={faCircleCheck} className="text-emerald-600 text-lg" />;
                } else if (option === selectedOption) {
                  btnStyle = "bg-red-100 dark:bg-red-950/70 border-red-500 text-red-900 dark:text-red-100 font-bold";
                  icon = <FontAwesomeIcon icon={faCircleXmark} className="text-red-500 text-lg" />;
                } else {
                  btnStyle = "opacity-50 border-slate-200 dark:border-slate-800";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(option)}
                  disabled={isAnswered}
                  className={`p-4 rounded-2xl border text-left transition flex items-center justify-between text-base ${btnStyle}`}
                >
                  <span className="font-bangla font-semibold">{option}</span>
                  {icon}
                </button>
              );
            })}
          </div>

          {/* Feedback & Next Button */}
          {isAnswered && (
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 animate-fadeIn">
              <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                {selectedOption === currentQ.correctAnswer ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                    ✓ Correct! Great job!
                  </span>
                ) : (
                  <span>
                    Wrong! The correct answer was:{" "}
                    <strong className="text-emerald-600 dark:text-emerald-400">
                      {currentQ.correctAnswer}
                    </strong>
                  </span>
                )}
              </div>

              <button
                onClick={handleNextQuestion}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm flex items-center justify-center gap-2 transition active:scale-95 shadow-md shadow-emerald-600/20"
              >
                <span>{currentIndex < questions.length - 1 ? "Next Question" : "See Results"}</span>
                <FontAwesomeIcon icon={faArrowRight} />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Results State
  const percentage = Math.round((score / questions.length) * 100);

  return (
    <div className="max-w-xl mx-auto bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl space-y-6">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 text-4xl shadow-inner mb-2 animate-bounce">
          <FontAwesomeIcon icon={faTrophy} />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          Quiz Completed! 🎉
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-bangla">
          চমৎকার প্রচেষ্টা! আপনি সফলভাবে কুইজ শেষ করেছেন।
        </p>
      </div>

      {/* Score Card */}
      <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 text-center space-y-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
          Your Score
        </span>
        <div className="text-5xl font-black text-emerald-600 dark:text-emerald-400">
          {score} / {questions.length}
        </div>
        <div className="text-sm font-bold text-slate-600 dark:text-slate-300">
          Accuracy: {percentage}%
        </div>
      </div>

      {/* Wrong Answers Review if any */}
      {wrongAnswers.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Review Missed Questions ({wrongAnswers.length})
          </h3>
          <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
            {wrongAnswers.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs space-y-1"
              >
                <div className="font-bold text-slate-800 dark:text-slate-100">
                  {item.question.prompt}
                </div>
                <div className="text-red-500">Your choice: {item.selected}</div>
                <div className="text-emerald-600 dark:text-emerald-400 font-semibold">
                  Correct answer: {item.question.correctAnswer}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={startQuiz}
          className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 transition"
        >
          <FontAwesomeIcon icon={faRotateRight} />
          <span>Try Again</span>
        </button>
        <button
          onClick={() => setGameState("setup")}
          className="px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-sm transition"
        >
          Change Quiz
        </button>
      </div>
    </div>
  );
}
