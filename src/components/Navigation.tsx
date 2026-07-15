import React from 'react';
import { Home, Briefcase, GraduationCap, Code2, Trophy, Mail, Sparkles, Users, Palette, Zap, Search, Map } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePortfolio } from '../context/PortfolioContext';
import type { PortfolioZone } from '../context/PortfolioContext';
import { audio } from '../utils/audio';

interface NavItem {
  id: PortfolioZone;
  label: string;
  icon: React.ReactNode;
}

export const Navigation: React.FC = () => {
  const { 
    currentZone, setCurrentZone, collectedGems, showSecretMode, setShowSecretMode,
    setIsRecruiterMode, setIsDirectoryOpen, setIsSearchOpen, isRecruiterMode
  } = usePortfolio();

  const navItems: NavItem[] = [
    { id: 'home', label: 'Home Base', icon: <Home size={18} /> },
    { id: 'projects', label: 'Projects', icon: <Code2 size={18} /> },
    { id: 'uiux', label: 'UI/UX Studio', icon: <Palette size={18} /> },
    { id: 'skills', label: 'Skills Universe', icon: <Sparkles size={18} /> },
    { id: 'communities', label: 'Communities', icon: <Users size={18} /> },
    { id: 'internship', label: 'Internship', icon: <Briefcase size={18} /> },
    { id: 'education', label: 'Education', icon: <GraduationCap size={18} /> },
    { id: 'achievements', label: 'Hall of Fame', icon: <Trophy size={18} /> },
    { id: 'contact', label: 'Observatory', icon: <Mail size={18} /> },
  ];

  // Don't show navigation during recruiter mode
  if (isRecruiterMode) return null;

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-fit px-4 pointer-events-none">
      <div className="flex items-center gap-1 sm:gap-2 px-3 py-2 rounded-2xl glass-panel pointer-events-auto relative border border-white/10 shadow-[0_15px_35px_rgba(0,0,0,0.6)]">
        
        {/* Nav Items */}
        {navItems.map((item) => {
          const isActive = currentZone === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                if (currentZone !== item.id) {
                  setCurrentZone(item.id);
                }
              }}
              onMouseEnter={() => audio.playHover()}
              className={`relative flex items-center justify-center p-3 rounded-xl transition-all duration-300 text-white/50 hover:text-white group`}
              title={item.label}
              id={`nav-item-${item.id}`}
            >
              {/* Active Pill Background */}
              {isActive && (
                <motion.div
                  layoutId="activePill"
                  className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 border border-cyan-500/30 rounded-xl"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}

              {/* Icon */}
              <span className={`relative z-10 ${isActive ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]' : ''}`}>
                {item.icon}
              </span>

              {/* Hover Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-1.5 rounded-lg bg-black/90 border border-white/10 text-[10px] tracking-[0.15em] font-orbitron font-semibold text-white/90 whitespace-nowrap opacity-0 pointer-events-none translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-xl">
                {item.label}
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 border-r border-b border-white/10 bg-black/90 rotate-45 -translate-y-[4px]"></div>
              </div>
            </button>
          );
        })}

        {/* Separator */}
        <div className="w-px h-6 bg-white/10 mx-1" />

        {/* Search trigger */}
        <button
          onClick={() => { audio.playClick(); setIsSearchOpen(true); }}
          onMouseEnter={() => audio.playHover()}
          className="relative flex items-center justify-center p-3 rounded-xl transition-all duration-300 text-white/40 hover:text-cyan-400 group"
          title="Search (/ or Ctrl+K)"
        >
          <Search size={16} />
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-1.5 rounded-lg bg-black/90 border border-white/10 text-[10px] tracking-[0.15em] font-orbitron font-semibold text-white/90 whitespace-nowrap opacity-0 pointer-events-none translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-xl">
            Search
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 border-r border-b border-white/10 bg-black/90 rotate-45 -translate-y-[4px]"></div>
          </div>
        </button>

        {/* Directory trigger */}
        <button
          onClick={() => { audio.playClick(); setIsDirectoryOpen(true); }}
          onMouseEnter={() => audio.playHover()}
          className="relative flex items-center justify-center p-3 rounded-xl transition-all duration-300 text-white/40 hover:text-cyan-400 group"
          title="Directory (M)"
        >
          <Map size={16} />
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-1.5 rounded-lg bg-black/90 border border-white/10 text-[10px] tracking-[0.15em] font-orbitron font-semibold text-white/90 whitespace-nowrap opacity-0 pointer-events-none translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-xl">
            Directory
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 border-r border-b border-white/10 bg-black/90 rotate-45 -translate-y-[4px]"></div>
          </div>
        </button>

        {/* Recruiter Mode trigger */}
        <button
          onClick={() => { audio.playSuccess(); setIsRecruiterMode(true); }}
          onMouseEnter={() => audio.playHover()}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-300 hover:text-amber-200 hover:border-amber-400/40 text-[10px] tracking-[0.1em] font-orbitron font-bold transition-all cursor-pointer group"
          title="Start Guided Recruiter Tour"
        >
          <Zap size={14} className="text-amber-400" />
          <span className="hidden sm:inline">RECRUITER</span>
        </button>

        {/* Easter Egg Gem Counter in Navigation (displays if at least 1 gem is collected) */}
        {collectedGems.length > 0 && (
          <div 
            onClick={() => {
              if (collectedGems.length === 3) {
                setShowSecretMode(!showSecretMode);
                audio.playSuccess();
              }
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] tracking-[0.1em] font-orbitron font-bold border ml-2 transition-all cursor-pointer ${
              showSecretMode 
                ? 'bg-purple-950/40 border-purple-500/40 text-purple-300 animate-pulse'
                : 'bg-cyan-950/20 border-cyan-500/20 text-cyan-300'
            }`}
            title={collectedGems.length === 3 ? "Click to toggle Developer Joke Mode!" : `Collected ${collectedGems.length}/3 Hidden Gems`}
          >
            <Sparkles size={12} className={collectedGems.length === 3 ? "text-purple-400" : "text-cyan-400"} />
            <span>
              {collectedGems.length === 3 ? "SECRET ACTIVE" : `${collectedGems.length}/3 GEMS`}
            </span>
          </div>
        )}
      </div>
    </nav>
  );
};
export default Navigation;
