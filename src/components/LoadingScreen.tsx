import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
  onFinished: () => void;
}

const words = [
  "Abdiel Magdi",
  "UI/UX Designer",
  "Full Stack Developer",
  "Problem Solver"
];

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onFinished }) => {
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Progress loader running from 0 to 100%
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        // Smoothly accelerate/decelerate progress
        const diff = Math.random() * 8 + 2;
        return Math.min(prev + diff, 100);
      });
    }, 150);

    return () => clearInterval(progressInterval);
  }, []);

  useEffect(() => {
    // Morph text words every 1.6 seconds
    const wordInterval = setInterval(() => {
      setIndex((prev) => {
        if (prev < words.length - 1) {
          return prev + 1;
        } else if (progress >= 100) {
          // Once progress is 100% and we've cycled through all texts
          clearInterval(wordInterval);
          // Wait briefly for final fade-out
          setTimeout(() => {
            onFinished();
          }, 800);
          return prev;
        }
        return prev; // Hold on final word until progress hits 100
      });
    }, 1600);

    return () => clearInterval(wordInterval);
  }, [progress, onFinished]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050505] select-none"
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
    >
      {/* Background neon lights */}
      <div className="absolute top-1/4 left-1/4 w-[30vw] h-[30vw] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[30vw] h-[30vw] rounded-full bg-purple-500/10 blur-[120px] pointer-events-none animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>

      <div className="relative z-10 w-full max-w-xl px-6 flex flex-col items-center text-center">
        {/* Futuristic Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8 px-4 py-1 text-xs tracking-[0.3em] font-medium text-cyan-400 bg-cyan-950/20 border border-cyan-500/30 rounded-full font-orbitron"
        >
          INITIALIZING CORE SYSTEM
        </motion.div>

        {/* Morphing Words */}
        <div className="h-24 md:h-32 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.h1
              key={index}
              initial={{ opacity: 0, y: 15, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -15, filter: 'blur(10px)' }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="text-4xl md:text-6xl font-extrabold tracking-tight font-orbitron bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent filter drop-shadow-[0_0_20px_rgba(0,240,255,0.2)]"
            >
              {words[index]}
            </motion.h1>
          </AnimatePresence>
        </div>

        {/* Loading Progress Bar */}
        <div className="w-full h-[2px] bg-white/5 rounded-full overflow-hidden mt-12 mb-4 relative">
          <motion.div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500"
            style={{ width: `${progress}%` }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: "easeOut", duration: 0.1 }}
          />
        </div>

        {/* Progress Telemetry */}
        <div className="w-full flex justify-between text-[10px] text-white/40 tracking-[0.2em] font-orbitron">
          <span>SAMUEL_MAGDI_v1.0.4</span>
          <span>{Math.round(progress)}% LOADED</span>
        </div>
      </div>
    </motion.div>
  );
};
