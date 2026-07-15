import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { X, SkipForward, Pause, Play, Palette, ExternalLink, FileText } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import type { PortfolioZone } from '../context/PortfolioContext';
import { audio } from '../utils/audio';

interface TourStop {
  zone: PortfolioZone;
  label: string;
  emoji: string;
  duration: number; // Seconds to pause at this stop
}

const tourRoute: TourStop[] = [
  { zone: 'home', label: 'Home Base', emoji: '🏠', duration: 8 },
  { zone: 'projects', label: 'Projects District', emoji: '🚀', duration: 10 },
  { zone: 'uiux', label: 'UI/UX Studio', emoji: '🎨', duration: 10 },
  { zone: 'skills', label: 'Skills Universe', emoji: '✨', duration: 8 },
  { zone: 'communities', label: 'Communities', emoji: '👥', duration: 8 },
  { zone: 'internship', label: 'Internship', emoji: '💼', duration: 8 },
  { zone: 'education', label: 'Education', emoji: '🎓', duration: 8 },
  { zone: 'achievements', label: 'Hall of Fame', emoji: '🏆', duration: 8 },
  { zone: 'contact', label: 'Contact', emoji: '📡', duration: 10 },
];

export const RecruiterMode: React.FC = () => {
  const { isRecruiterMode, setIsRecruiterMode, setCurrentZone, setActiveOverlay } = usePortfolio();
  const [currentStopIndex, setCurrentStopIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0); // 0-100 progress within current stop
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);
  const pausedAtRef = useRef<number>(0);

  const currentStop = tourRoute[currentStopIndex];
  const totalStops = tourRoute.length;

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const exitTour = useCallback(() => {
    clearTimer();
    setIsRecruiterMode(false);
    setCurrentStopIndex(0);
    setProgress(0);
    setIsPaused(false);
    setActiveOverlay(null);
  }, [clearTimer, setIsRecruiterMode, setActiveOverlay]);

  const goToStop = useCallback((index: number) => {
    clearTimer();
    if (index >= totalStops) {
      // Tour complete
      exitTour();
      audio.playSuccess();
      return;
    }

    setCurrentStopIndex(index);
    setProgress(0);
    const stop = tourRoute[index];

    // Navigate camera
    audio.playTransition();
    setCurrentZone(stop.zone);

    // Start countdown timer
    startTimeRef.current = Date.now();
    const durationMs = stop.duration * 1000;

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const pct = Math.min((elapsed / durationMs) * 100, 100);
      setProgress(pct);

      if (pct >= 100) {
        // Move to next stop
        clearTimer();
        goToStop(index + 1);
      }
    }, 50);
  }, [clearTimer, exitTour, setCurrentZone, totalStops]);

  // Start tour when recruiter mode activates
  useEffect(() => {
    if (isRecruiterMode) {
      setActiveOverlay(null);
      // Brief delay for UI to settle
      setTimeout(() => goToStop(0), 300);
    }
    return () => clearTimer();
  }, [isRecruiterMode]);

  // Handle pause/resume
  const togglePause = () => {
    if (isPaused) {
      // Resume: adjust start time to account for paused duration
      const pausedDuration = Date.now() - pausedAtRef.current;
      startTimeRef.current += pausedDuration;
      setIsPaused(false);

      const stop = tourRoute[currentStopIndex];
      const durationMs = stop.duration * 1000;

      timerRef.current = setInterval(() => {
        const elapsed = Date.now() - startTimeRef.current;
        const pct = Math.min((elapsed / durationMs) * 100, 100);
        setProgress(pct);
        if (pct >= 100) {
          clearTimer();
          goToStop(currentStopIndex + 1);
        }
      }, 50);
    } else {
      // Pause
      clearTimer();
      pausedAtRef.current = Date.now();
      setIsPaused(true);
    }
  };

  const skipToNext = () => {
    clearTimer();
    goToStop(currentStopIndex + 1);
  };

  if (!isRecruiterMode) return null;

  const overallProgress = ((currentStopIndex + progress / 100) / totalStops) * 100;

  return (
    <div className="fixed inset-x-0 top-0 z-50 pointer-events-none">
      {/* Top cinematic bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="pointer-events-auto mx-auto mt-4 w-full max-w-2xl px-4"
      >
        <div className="rounded-2xl glass-panel border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.6)] overflow-hidden">
          {/* Overall progress bar */}
          <div className="h-1 bg-white/5 relative">
            <motion.div
              className="h-full bg-gradient-to-r from-amber-400 via-cyan-400 to-purple-500"
              animate={{ width: `${overallProgress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          <div className="px-5 py-3 flex items-center gap-4">
            {/* Current stop indicator */}
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span className="text-lg">{currentStop.emoji}</span>
              <div className="min-w-0">
                <div className="text-[10px] font-bold font-orbitron tracking-[0.15em] text-amber-400">
                  ⚡ RECRUITER TOUR • STOP {currentStopIndex + 1}/{totalStops}
                </div>
                <div className="text-xs font-bold font-orbitron text-white truncate">
                  {currentStop.label}
                </div>
              </div>
            </div>

            {/* Stop progress ring */}
            <div className="relative w-8 h-8 flex-shrink-0">
              <svg className="w-8 h-8 -rotate-90" viewBox="0 0 32 32">
                <circle cx="16" cy="16" r="14" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="2" />
                <circle
                  cx="16" cy="16" r="14"
                  fill="none"
                  stroke="#00f0ff"
                  strokeWidth="2"
                  strokeDasharray={`${progress * 0.88} 88`}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[7px] font-bold font-orbitron text-white/60">
                {Math.round(progress)}%
              </span>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button
                onClick={togglePause}
                className="p-2 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-400/30 hover:text-cyan-400 text-white/60 transition-all cursor-pointer"
                title={isPaused ? 'Resume' : 'Pause'}
              >
                {isPaused ? <Play size={14} /> : <Pause size={14} />}
              </button>
              <button
                onClick={skipToNext}
                className="p-2 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-400/30 hover:text-cyan-400 text-white/60 transition-all cursor-pointer"
                title="Skip to next"
              >
                <SkipForward size={14} />
              </button>
              <button
                onClick={exitTour}
                className="p-2 rounded-lg bg-white/5 border border-red-500/20 hover:border-red-400/40 hover:text-red-400 text-white/40 transition-all cursor-pointer"
                title="Exit tour"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Tour stops indicator dots */}
          <div className="px-5 pb-3 flex items-center gap-1">
            {tourRoute.map((stop, idx) => (
              <div
                key={stop.zone}
                className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                  idx < currentStopIndex
                    ? 'bg-cyan-400'
                    : idx === currentStopIndex
                    ? 'bg-gradient-to-r from-amber-400 to-cyan-400'
                    : 'bg-white/10'
                }`}
              />
            ))}
          </div>

          {/* Quick Actions Panel */}
          <div className="px-5 py-2.5 border-t border-white/5 bg-white/1 flex flex-wrap items-center justify-between gap-2 pointer-events-auto">
            <span className="text-[8px] font-bold font-orbitron tracking-wider text-amber-400">
              QUICK ACTIONS:
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => {
                  audio.playClick();
                  window.open('https://github.com/abinayaramothil', '_blank');
                }}
                className="flex items-center gap-1 px-2 py-0.5 rounded bg-white/5 border border-white/10 hover:border-cyan-400 hover:text-cyan-300 text-white/80 text-[8px] font-orbitron font-bold transition-all cursor-pointer"
              >
                <Github size={10} />
                <span>GITHUB</span>
              </button>
              <button
                onClick={() => {
                  audio.playClick();
                  window.open('https://www.figma.com/design/cpwZMiFyTGzZOuuo7aPktG/Website-Design?node-id=0-1&t=mYJWjOaJy7tIO33G-1', '_blank');
                }}
                className="flex items-center gap-1 px-2 py-0.5 rounded bg-white/5 border border-white/10 hover:border-cyan-400 hover:text-cyan-300 text-white/80 text-[8px] font-orbitron font-bold transition-all cursor-pointer"
              >
                <Palette size={10} />
                <span>FIGMA</span>
              </button>
              <button
                onClick={() => {
                  audio.playClick();
                  window.open('https://shopsphere-demo.onrender.com', '_blank');
                }}
                className="flex items-center gap-1 px-2 py-0.5 rounded bg-white/5 border border-white/10 hover:border-cyan-400 hover:text-cyan-300 text-white/80 text-[8px] font-orbitron font-bold transition-all cursor-pointer"
              >
                <ExternalLink size={10} />
                <span>LIVE DEMO</span>
              </button>
              <button
                onClick={() => {
                  audio.playSuccess();
                  alert("Downloading Resume (Mockup PDF link)...");
                }}
                className="flex items-center gap-1 px-2.5 py-0.5 rounded bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 hover:border-amber-400 text-amber-300 text-[8px] font-orbitron font-bold transition-all cursor-pointer"
              >
                <FileText size={10} />
                <span>RESUME</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Cinematic letterbox bars */}
      <div className="fixed top-0 left-0 right-0 h-12 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />
      <div className="fixed bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
    </div>
  );
};
export default RecruiterMode;
