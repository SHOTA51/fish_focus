import { useState, useEffect, useRef } from 'react';

export function useTimer(initialMinutes: number, onComplete: () => void) {
  const [secondsLeft, setSecondsLeft] = useState(initialMinutes * 60);
  const [isActive, setIsActive] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onCompleteRef = useRef(onComplete);

  // Keep latest onComplete callback in ref to prevent unnecessary timer resets
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // When initialMinutes changes and timer is not running, update secondsLeft
  useEffect(() => {
    if (!isActive) {
      setSecondsLeft(initialMinutes * 60);
    }
  }, [initialMinutes, isActive]);

  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            setIsActive(false);
            onCompleteRef.current?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setSecondsLeft(initialMinutes * 60);
  };

  const formatTime = () => {
    const mins = Math.floor(secondsLeft / 60);
    const secs = secondsLeft % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    secondsLeft,
    isActive,
    toggleTimer,
    resetTimer,
    formatTime,
  };
}
