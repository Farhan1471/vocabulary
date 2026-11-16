"use client";

import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeHigh } from "@fortawesome/free-solid-svg-icons";
import { useVocabulary } from "@/context/VocabularyContext";

interface AudioButtonProps {
  text: string;
  className?: string;
  iconClassName?: string;
}

export default function AudioButton({ text, className = "", iconClassName = "" }: AudioButtonProps) {
  const { speakWord } = useVocabulary();
  const [playing, setPlaying] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPlaying(true);
    speakWord(text);
    setTimeout(() => setPlaying(false), 800);
  };

  return (
    <button
      onClick={handleClick}
      aria-label={`Pronounce ${text}`}
      title={`Listen to pronunciation of "${text}"`}
      className={`p-2 rounded-full text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition-all ${
        playing ? "text-emerald-600 dark:text-emerald-400 scale-110" : ""
      } ${className}`}
    >
      <FontAwesomeIcon icon={faVolumeHigh} className={`${playing ? "animate-pulse" : ""} ${iconClassName}`} />
    </button>
  );
}
