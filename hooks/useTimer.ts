"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface UseTimerReturn {
  secondsLeft: number;
  isActive: boolean;
  isPaused: boolean;
  startTimer: (duration?: number) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  resetTimer: (duration?: number) => void;
  stopTimer: () => void;
}

export function useTimer(initialDuration: number = 30): UseTimerReturn {
  const [secondsLeft, setSecondsLeft] = useState(initialDuration);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const durationRef = useRef(initialDuration);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startTimer = useCallback(
    (duration?: number) => {
      clearTimer();
      const timerDuration = duration ?? durationRef.current;
      durationRef.current = timerDuration;
      setSecondsLeft(timerDuration);
      setIsActive(true);
      setIsPaused(false);

      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearTimer();
            setIsActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    },
    [clearTimer]
  );

  const pauseTimer = useCallback(() => {
    if (isActive && !isPaused) {
      clearTimer();
      setIsPaused(true);
    }
  }, [isActive, isPaused, clearTimer]);

  const resumeTimer = useCallback(() => {
    if (isActive && isPaused) {
      setIsPaused(false);
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearTimer();
            setIsActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  }, [isActive, isPaused, clearTimer]);

  const resetTimer = useCallback(
    (duration?: number) => {
      clearTimer();
      const timerDuration = duration ?? durationRef.current;
      durationRef.current = timerDuration;
      setSecondsLeft(timerDuration);
      setIsActive(false);
      setIsPaused(false);
    },
    [clearTimer]
  );

  const stopTimer = useCallback(() => {
    clearTimer();
    setIsActive(false);
    setIsPaused(false);
    setSecondsLeft(durationRef.current);
  }, [clearTimer]);

  useEffect(() => {
    return () => {
      clearTimer();
    };
  }, [clearTimer]);

  return {
    secondsLeft,
    isActive,
    isPaused,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    stopTimer,
  };
}
