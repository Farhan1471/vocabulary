"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { VOCABULARY_LIST, WordItem } from "@/data/vocabulary";

interface VocabularyContextType {
  words: WordItem[];
  favorites: number[];
  mastered: number[];
  learning: number[];
  activeTab: "all" | "flashcards" | "quiz" | "match" | "sets";
  searchQuery: string;
  selectedBatch: number | null;
  selectedFilter: "all" | "favorites" | "mastered" | "learning";
  theme: "light" | "dark";
  streak: number;
  selectedWord: WordItem | null;
  setActiveTab: (tab: "all" | "flashcards" | "quiz" | "match" | "sets") => void;
  setSearchQuery: (q: string) => void;
  setSelectedBatch: (b: number | null) => void;
  setSelectedFilter: (f: "all" | "favorites" | "mastered" | "learning") => void;
  setSelectedWord: (w: WordItem | null) => void;
  toggleFavorite: (id: number) => void;
  toggleMastered: (id: number) => void;
  markMastered: (id: number) => void;
  markLearning: (id: number) => void;
  resetProgress: () => void;
  speakWord: (text: string) => void;
  toggleTheme: () => void;
}

const VocabularyContext = createContext<VocabularyContextType | undefined>(undefined);

export const VocabularyProvider = ({ children }: { children: ReactNode }) => {
  const [words] = useState<WordItem[]>(VOCABULARY_LIST);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [mastered, setMastered] = useState<number[]>([]);
  const [learning, setLearning] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "flashcards" | "quiz" | "match" | "sets">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBatch, setSelectedBatch] = useState<number | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<"all" | "favorites" | "mastered" | "learning">("all");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [streak, setStreak] = useState(1);
  const [selectedWord, setSelectedWord] = useState<WordItem | null>(null);

  // Load persistence from localStorage
  useEffect(() => {
    try {
      const savedFavs = localStorage.getItem("vocab_favs");
      if (savedFavs) setFavorites(JSON.parse(savedFavs));

      const savedMastered = localStorage.getItem("vocab_mastered");
      if (savedMastered) setMastered(JSON.parse(savedMastered));

      const savedLearning = localStorage.getItem("vocab_learning");
      if (savedLearning) setLearning(JSON.parse(savedLearning));

      const savedTheme = localStorage.getItem("vocab_theme") as "light" | "dark" | null;
      if (savedTheme) {
        setTheme(savedTheme);
        if (savedTheme === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        setTheme("dark");
        document.documentElement.classList.add("dark");
      }

      // Streak calculation
      const lastVisit = localStorage.getItem("vocab_last_visit");
      const savedStreak = localStorage.getItem("vocab_streak");
      const today = new Date().toDateString();

      if (lastVisit) {
        const lastDate = new Date(lastVisit);
        const diffDays = Math.floor((new Date().getTime() - lastDate.getTime()) / (1000 * 3600 * 24));
        if (diffDays === 1) {
          const newStreak = savedStreak ? parseInt(savedStreak, 10) + 1 : 1;
          setStreak(newStreak);
          localStorage.setItem("vocab_streak", newStreak.toString());
        } else if (diffDays === 0) {
          setStreak(savedStreak ? parseInt(savedStreak, 10) : 1);
        } else {
          setStreak(1);
          localStorage.setItem("vocab_streak", "1");
        }
      } else {
        localStorage.setItem("vocab_streak", "1");
      }
      localStorage.setItem("vocab_last_visit", today);
    } catch (e) {
      console.error("Failed to load local storage", e);
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem("vocab_theme", nextTheme);
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => {
      const updated = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      localStorage.setItem("vocab_favs", JSON.stringify(updated));
      return updated;
    });
  };

  const toggleMastered = (id: number) => {
    setMastered((prev) => {
      const isCurrentlyMastered = prev.includes(id);
      const updated = isCurrentlyMastered ? prev.filter((item) => item !== id) : [...prev, id];
      localStorage.setItem("vocab_mastered", JSON.stringify(updated));
      return updated;
    });
    setLearning((prev) => {
      const updated = prev.filter((item) => item !== id);
      localStorage.setItem("vocab_learning", JSON.stringify(updated));
      return updated;
    });
  };

  const markMastered = (id: number) => {
    setMastered((prev) => {
      if (!prev.includes(id)) {
        const updated = [...prev, id];
        localStorage.setItem("vocab_mastered", JSON.stringify(updated));
        return updated;
      }
      return prev;
    });
    setLearning((prev) => {
      const updated = prev.filter((item) => item !== id);
      localStorage.setItem("vocab_learning", JSON.stringify(updated));
      return updated;
    });
  };

  const markLearning = (id: number) => {
    setLearning((prev) => {
      if (!prev.includes(id)) {
        const updated = [...prev, id];
        localStorage.setItem("vocab_learning", JSON.stringify(updated));
        return updated;
      }
      return prev;
    });
    setMastered((prev) => {
      const updated = prev.filter((item) => item !== id);
      localStorage.setItem("vocab_mastered", JSON.stringify(updated));
      return updated;
    });
  };

  const resetProgress = () => {
    if (confirm("Are you sure you want to reset your learning progress?")) {
      setMastered([]);
      setLearning([]);
      setFavorites([]);
      localStorage.removeItem("vocab_mastered");
      localStorage.removeItem("vocab_learning");
      localStorage.removeItem("vocab_favs");
    }
  };

  const speakWord = (text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel(); // Stop any pending speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <VocabularyContext.Provider
      value={{
        words,
        favorites,
        mastered,
        learning,
        activeTab,
        searchQuery,
        selectedBatch,
        selectedFilter,
        theme,
        streak,
        selectedWord,
        setActiveTab,
        setSearchQuery,
        setSelectedBatch,
        setSelectedFilter,
        setSelectedWord,
        toggleFavorite,
        toggleMastered,
        markMastered,
        markLearning,
        resetProgress,
        speakWord,
        toggleTheme,
      }}
    >
      {children}
    </VocabularyContext.Provider>
  );
};

export const useVocabulary = () => {
  const context = useContext(VocabularyContext);
  if (!context) {
    throw new Error("useVocabulary must be used within a VocabularyProvider");
  }
  return context;
};
