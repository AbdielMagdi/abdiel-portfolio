import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Home, Code2, Sparkles, Palette, Users, Briefcase, GraduationCap, Trophy, Mail } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import type { PortfolioZone } from '../context/PortfolioContext';
import { audio } from '../utils/audio';

interface Destination {
  id: PortfolioZone;
  emoji: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const destinations: Destination[] = [
  { id: 'home', emoji: '🏠', label: 'Home Base', description: 'Central command hub and introduction', icon: <Home size={20} />, color: '#00f0ff' },
  { id: 'projects', emoji: '🚀', label: 'Projects District', description: 'Full-stack engineering builds', icon: <Code2 size={20} />, color: '#a855f7' },
  { id: 'uiux', emoji: '🎨', label: 'UI/UX Studio', description: 'Interactive Figma design lab', icon: <Palette size={20} />, color: '#a855f7' },
  { id: 'skills', emoji: '✨', label: 'Skills Universe', description: 'Technical proficiency matrix', icon: <Sparkles size={20} />, color: '#00ff99' },
  { id: 'communities', emoji: '👥', label: 'Communities', description: 'Building through design', icon: <Users size={20} />, color: '#ff0055' },
  { id: 'internship', emoji: '💼', label: 'Internship Office', description: 'YesPanchi & Codoid experiences', icon: <Briefcase size={20} />, color: '#ff8800' },
  { id: 'education', emoji: '🎓', label: 'Education Campus', description: 'SSN Engineering academics', icon: <GraduationCap size={20} />, color: '#0077ff' },
  { id: 'achievements', emoji: '🏆', label: 'Hall of Fame', description: 'Credentials and trophies', icon: <Trophy size={20} />, color: '#a855f7' },
  { id: 'contact', emoji: '📡', label: 'Contact Observatory', description: 'Send a transmission', icon: <Mail size={20} />, color: '#00f0ff' },
];

export const FlightDirectory: React.FC = () => {
  const { isDirectoryOpen, setIsDirectoryOpen, setCurrentZone, currentZone } = usePortfolio();

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDirectoryOpen) {
        setIsDirectoryOpen(false);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isDirectoryOpen, setIsDirectoryOpen]);

  const handleFlyTo = (zone: PortfolioZone) => {
    audio.playTransition();
    setIsDirectoryOpen(false);
    // Small delay so close animation plays before camera moves
    setTimeout(() => {
      setCurrentZone(zone);
    }, 200);
  };

  return (
    <AnimatePresence>
      {isDirectoryOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            onClick={() => setIsDirectoryOpen(false)}
          />

          {/* Directory Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative z-10 w-full max-w-3xl rounded-3xl glass-panel border border-white/10 overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.8)]"
          >
            {/* Gradient header bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-cyan-400 via-purple-500 to-amber-400" />
            
            <div className="p-6 md:p-8">
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-[10px] font-bold tracking-[0.3em] text-cyan-400 font-orbitron">FLIGHT DIRECTORY</span>
                  <h2 className="text-2xl md:text-3xl font-extrabold font-orbitron mt-1 bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                    Choose Destination
                  </h2>
                  <p className="text-xs text-white/40 mt-1">Select a location to fly there instantly</p>
                </div>
                <button
                  onClick={() => setIsDirectoryOpen(false)}
                  className="p-2 rounded-full bg-white/5 border border-white/10 hover:border-cyan-400/40 hover:text-cyan-400 transition-all cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Destination Grid */}
              <div className="grid grid-cols-3 gap-3">
                {destinations.map((dest, idx) => {
                  const isActive = currentZone === dest.id;
                  return (
                    <motion.button
                      key={dest.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.04, type: 'spring', damping: 20 }}
                      onClick={() => handleFlyTo(dest.id)}
                      onMouseEnter={() => audio.playHover()}
                      className={`relative p-4 rounded-2xl text-left transition-all duration-300 cursor-pointer border group ${
                        isActive
                          ? 'bg-cyan-500/10 border-cyan-500/30'
                          : 'bg-white/3 border-white/5 hover:bg-white/6 hover:border-white/15'
                      }`}
                    >
                      {/* Emoji + Icon */}
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{dest.emoji}</span>
                        <span className={`transition-colors ${isActive ? 'text-cyan-400' : 'text-white/30 group-hover:text-white/60'}`}>
                          {dest.icon}
                        </span>
                      </div>

                      <h3 className={`text-xs font-bold font-orbitron tracking-wider ${isActive ? 'text-cyan-400' : 'text-white group-hover:text-cyan-300'}`}>
                        {dest.label}
                      </h3>
                      <p className="text-[10px] text-white/40 mt-1 leading-relaxed">
                        {dest.description}
                      </p>

                      {/* Active indicator */}
                      {isActive && (
                        <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(0,240,255,0.8)]" />
                      )}

                      {/* Hover fly label */}
                      <div className="absolute bottom-2 right-3 text-[8px] font-orbitron font-bold text-cyan-400/0 group-hover:text-cyan-400/60 transition-all tracking-widest">
                        FLY →
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Keyboard hint */}
              <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-[9px] font-orbitron text-white/25 tracking-widest">
                <span>PRESS <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-white/50 mx-1">M</kbd> TO TOGGLE</span>
                <span>PRESS <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-white/50 mx-1">ESC</kbd> TO CLOSE</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
export default FlightDirectory;
