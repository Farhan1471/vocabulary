"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export interface SpeechSettings {
  rate: number;
  pitch: number;
  voiceURI: string;
}

const FEMALE_IDENTIFIERS = [
  "female",
  "woman",
  "zira",
  "jenny",
  "aria",
  "samantha",
  "victoria",
  "karen",
  "susan",
  "serena",
  "hazel",
  "catherine",
  "linda",
  "ava",
  "stephanie",
  "zoe",
  "fiona",
  "moira",
  "tessa",
  "libby",
  "sonia",
  "maisie",
  "mia",
  "natasha",
  "heera",
  "neerja",
  "ana",
  "eva",
  "emma",
  "olivia",
  "lucy",
  "amy",
  "joanna",
  "kendra",
  "kimberly",
  "salli",
  "ivy",
  "ruth",
  "claire",
  "julie",
  "alice",
  "sarah",
  "kate",
];

export function isBritishVoice(voice: SpeechSynthesisVoice): boolean {
  const lang = voice.lang.toLowerCase();
  const name = voice.name.toLowerCase();
  return (
    lang.startsWith("en-gb") ||
    lang.startsWith("en_gb") ||
    lang.includes("gb") ||
    name.includes("united kingdom") ||
    name.includes("great britain") ||
    name.includes("uk") ||
    name.includes("british")
  );
}

export function isNaturalVoice(voice: SpeechSynthesisVoice): boolean {
  const name = voice.name.toLowerCase();
  return (
    name.includes("natural") ||
    name.includes("online") ||
    name.includes("neural")
  );
}

export function isLikelyFemale(voice: SpeechSynthesisVoice): boolean {
  const name = voice.name.toLowerCase();
  const uri = voice.voiceURI.toLowerCase();
  if (FEMALE_IDENTIFIERS.some((kw) => name.includes(kw) || uri.includes(kw))) {
    return true;
  }
  if (
    name.includes("google") &&
    (name.includes("us english") || name.includes("uk english female"))
  ) {
    return true;
  }
  return false;
}

export function useSpeakingAudio() {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [rate, setRate] = useState<number>(0.92);
  const [pitch, setPitch] = useState<number>(1.0);
  const [activeAudioId, setActiveAudioId] = useState<string | null>(null);
  const [activePhase, setActivePhase] = useState<"question" | "answer" | "single" | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const nextTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isPlayingRef = useRef<boolean>(false);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }

    const loadVoices = () => {
      const allVoices = window.speechSynthesis.getVoices();
      if (!allVoices || allVoices.length === 0) return;

      const englishVoices = allVoices.filter((v) => v.lang.startsWith("en"));
      const available = englishVoices.length > 0 ? englishVoices : allVoices;
      setVoices(available);

      const savedURI = localStorage.getItem("speaking_voice_uri");
      let matchedVoice = available.find((v) => v.voiceURI === savedURI);

      if (!matchedVoice) {
        // Find best Natural British voice (with female cadence)
        // Priority 1: British Natural/Online Female voice (e.g. Libby, Sonia, Maisie)
        matchedVoice = available.find(
          (v) => isBritishVoice(v) && isNaturalVoice(v) && isLikelyFemale(v)
        );
        // Priority 2: British Female voice (e.g. Google UK English Female, Hazel)
        if (!matchedVoice) {
          matchedVoice = available.find((v) => isBritishVoice(v) && isLikelyFemale(v));
        }
        // Priority 3: British Natural/Online voice
        if (!matchedVoice) {
          matchedVoice = available.find((v) => isBritishVoice(v) && isNaturalVoice(v));
        }
        // Priority 4: Any British voice
        if (!matchedVoice) {
          matchedVoice = available.find((v) => isBritishVoice(v));
        }
        // Priority 5: Any Natural Female voice (e.g. Jenny, Aria)
        if (!matchedVoice) {
          matchedVoice = available.find((v) => isNaturalVoice(v) && isLikelyFemale(v));
        }
        // Priority 6: Any Female voice
        if (!matchedVoice) {
          matchedVoice = available.find((v) => isLikelyFemale(v));
        }
        // Priority 7: Default fallback
        if (!matchedVoice) {
          matchedVoice = available[0];
        }
      }

      if (matchedVoice) {
        setSelectedVoice(matchedVoice);
      }
    };

    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    const savedRate = localStorage.getItem("speaking_rate");
    if (savedRate) {
      const parsed = parseFloat(savedRate);
      if (!isNaN(parsed) && parsed >= 0.5 && parsed <= 1.5) {
        setRate(parsed);
      }
    }

    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      if (nextTimeoutRef.current) {
        clearTimeout(nextTimeoutRef.current);
      }
    };
  }, []);

  const changeVoice = (voiceURI: string) => {
    const v = voices.find((item) => item.voiceURI === voiceURI);
    if (v) {
      setSelectedVoice(v);
      localStorage.setItem("speaking_voice_uri", v.voiceURI);
    }
  };

  const changeRate = (newRate: number) => {
    setRate(newRate);
    localStorage.setItem("speaking_rate", newRate.toString());
  };

  const stop = useCallback(() => {
    if (nextTimeoutRef.current) {
      clearTimeout(nextTimeoutRef.current);
      nextTimeoutRef.current = null;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    utteranceRef.current = null;
    setActiveAudioId(null);
    setActivePhase(null);
    setIsPlaying(false);
    setIsPaused(false);
  }, []);

  const pause = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  }, []);

  const resume = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  }, []);

  const playSingle = useCallback(
    (
      text: string,
      audioId: string,
      phase: "question" | "answer" | "single" = "single",
      onComplete?: () => void
    ) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) {
        alert("Text-to-speech is not supported in this browser.");
        return;
      }

      stop();

      const cleanText = text.replace(/[*_#]/g, "").trim();
      const utterance = new SpeechSynthesisUtterance(cleanText);

      if (selectedVoice) {
        utterance.voice = selectedVoice;
        utterance.lang = selectedVoice.lang;
      } else {
        utterance.lang = "en-GB";
      }

      utterance.rate = rate;
      if (selectedVoice && isLikelyFemale(selectedVoice)) {
        utterance.pitch = pitch;
      } else {
        utterance.pitch = Math.max(pitch, 1.15);
      }

      utterance.onstart = () => {
        setIsPlaying(true);
        setIsPaused(false);
        setActiveAudioId(audioId);
        setActivePhase(phase);
      };

      utterance.onend = () => {
        setIsPlaying(false);
        setIsPaused(false);
        setActiveAudioId(null);
        setActivePhase(null);
        utteranceRef.current = null;
        if (onComplete) onComplete();
      };

      utterance.onerror = (e) => {
        console.error("SpeechSynthesis error:", e);
        setIsPlaying(false);
        setIsPaused(false);
        setActiveAudioId(null);
        setActivePhase(null);
        utteranceRef.current = null;
      };

      utteranceRef.current = utterance;
      (window as unknown as { _speechUtteranceRef?: SpeechSynthesisUtterance })._speechUtteranceRef = utterance;

      window.speechSynthesis.speak(utterance);
    },
    [selectedVoice, rate, pitch, stop]
  );

  const playBoth = useCallback(
    (question: string, answer: string, baseAudioId: string, onComplete?: () => void) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) {
        alert("Text-to-speech is not supported in this browser.");
        return;
      }

      stop();

      const cleanQ = question.replace(/^Q\d+\.\s*/, "").replace(/[*_#]/g, "").trim();
      const cleanA = answer.replace(/[*_#]/g, "").trim();

      const qUtterance = new SpeechSynthesisUtterance(cleanQ);
      if (selectedVoice) {
        qUtterance.voice = selectedVoice;
        qUtterance.lang = selectedVoice.lang;
      } else {
        qUtterance.lang = "en-GB";
      }
      qUtterance.rate = rate;
      qUtterance.pitch = selectedVoice && isLikelyFemale(selectedVoice) ? pitch : Math.max(pitch, 1.15);

      qUtterance.onstart = () => {
        setIsPlaying(true);
        setIsPaused(false);
        setActiveAudioId(baseAudioId);
        setActivePhase("question");
      };

      qUtterance.onend = () => {
        setActivePhase(null);
        nextTimeoutRef.current = setTimeout(() => {
          const aUtterance = new SpeechSynthesisUtterance(cleanA);
          if (selectedVoice) {
            aUtterance.voice = selectedVoice;
            aUtterance.lang = selectedVoice.lang;
          } else {
            aUtterance.lang = "en-GB";
          }
          aUtterance.rate = rate;
          aUtterance.pitch = selectedVoice && isLikelyFemale(selectedVoice) ? pitch : Math.max(pitch, 1.15);

          aUtterance.onstart = () => {
            setIsPlaying(true);
            setIsPaused(false);
            setActiveAudioId(baseAudioId);
            setActivePhase("answer");
          };

          aUtterance.onend = () => {
            setIsPlaying(false);
            setIsPaused(false);
            setActiveAudioId(null);
            setActivePhase(null);
            utteranceRef.current = null;
            if (onComplete) onComplete();
          };

          aUtterance.onerror = (e) => {
            console.error("Answer speech error:", e);
            stop();
          };

          utteranceRef.current = aUtterance;
          (window as unknown as { _speechUtteranceRef?: SpeechSynthesisUtterance })._speechUtteranceRef = aUtterance;
          window.speechSynthesis.speak(aUtterance);
        }, 700);
      };

      qUtterance.onerror = (e) => {
        console.error("Question speech error:", e);
        stop();
      };

      utteranceRef.current = qUtterance;
      (window as unknown as { _speechUtteranceRef?: SpeechSynthesisUtterance })._speechUtteranceRef = qUtterance;
      window.speechSynthesis.speak(qUtterance);
    },
    [selectedVoice, rate, pitch, stop]
  );

  const britishVoices = voices.filter(isBritishVoice);
  const otherVoices = voices.filter((v) => !isBritishVoice(v));

  return {
    voices,
    britishVoices,
    otherVoices,
    selectedVoice,
    rate,
    pitch,
    isPlaying,
    isPaused,
    activeAudioId,
    activePhase,
    changeVoice,
    changeRate,
    setPitch,
    stop,
    pause,
    resume,
    playSingle,
    playBoth,
  };
}
