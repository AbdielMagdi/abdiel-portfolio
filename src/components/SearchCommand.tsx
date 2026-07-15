import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowRight, Home, Code2, Sparkles, Palette, Users, Briefcase, GraduationCap, Trophy, Mail } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import type { PortfolioZone } from '../context/PortfolioContext';
import { audio } from '../utils/audio';

interface SearchResult {
  id: PortfolioZone;
  label: string;
  icon: React.ReactNode;
  keywords: string[];
  description: string;
}

const searchIndex: SearchResult[] = [
  { id: 'home', label: 'Home Base', icon: <Home size={16} />, keywords: ['home', 'about', 'intro', 'abdiel', 'samuel', 'magdi', 'resume', 'profile'], description: 'Introduction & overview' },
  { id: 'projects', label: 'Projects District', icon: <Code2 size={16} />, keywords: ['project', 'code', 'react', 'node', 'mongodb', 'fullstack', 'full stack', 'careflow', 'hospital', 'neurapaint', 'rag', 'llm', 'cognitivedoc', 'aerocontrol', 'drone', 'spring boot', 'flask', 'python', 'java', 'javascript', 'typescript', 'shopsphere', 'medisync', 'bloodbank', 'mysql', 'redis'], description: 'Engineering builds' },
  { id: 'uiux', label: 'UI/UX Studio', icon: <Palette size={16} />, keywords: ['uiux', 'ui', 'ux', 'design', 'figma', 'website design', 'hrms', 'abinew', 'plants', 'healthcare', 'dashboard', 'mobile app', 'prototype', 'wireframe', 'mockup', 'landing page'], description: 'Interactive Figma designs' },
  { id: 'skills', label: 'Skills Universe', icon: <Sparkles size={16} />, keywords: ['skill', 'programming', 'frontend', 'backend', 'database', 'ai', 'machine learning', 'react', 'tailwind', 'three.js', 'docker', 'git', 'figma'], description: 'Technical proficiencies' },
  { id: 'communities', label: 'Communities Hub', icon: <Users size={16} />, keywords: ['community', 'club', 'chapter', 'csi', 'aisc', 'ace', 'ieee', 'gdsc', 'spotium', 'design team', 'marketing', 'event', 'leadership', 'organization', 'campus'], description: 'Student organizations' },
  { id: 'internship', label: 'Internship Office', icon: <Briefcase size={16} />, keywords: ['internship', 'codoid', 'yespanchi', 'full stack', 'trading', 'kite', 'charts', 'dashboard', 'experience', 'work', 'professional', 'drone hud', 'hospital portal'], description: 'Professional experience' },
  { id: 'education', label: 'Education Campus', icon: <GraduationCap size={16} />, keywords: ['education', 'ssn', 'college', 'university', 'degree', 'computer science', 'engineering', 'gpa', 'academic', 'coursework'], description: 'Academic journey' },
  { id: 'achievements', label: 'Hall of Fame', icon: <Trophy size={16} />, keywords: ['achievement', 'trophy', 'certification', 'hackathon', 'workshop', 'award', 'credential', 'impact', 'leadership'], description: 'Credentials & trophies' },
  { id: 'contact', label: 'Contact Observatory', icon: <Mail size={16} />, keywords: ['contact', 'email', 'linkedin', 'github', 'message', 'connect', 'hire', 'recruiter'], description: 'Send a transmission' },
];

export const SearchCommand: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, setCurrentZone } = usePortfolio();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset on open
  useEffect(() => {
    if (isSearchOpen) {
      setQuery('');
      setSelectedIndex(0);
      // Focus after animation
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isSearchOpen]);

  // Fuzzy search filtering
  const results = useMemo(() => {
    if (!query.trim()) return searchIndex;
    const q = query.toLowerCase().trim();
    return searchIndex.filter((item) => {
      if (item.label.toLowerCase().includes(q)) return true;
      if (item.description.toLowerCase().includes(q)) return true;
      return item.keywords.some((kw) => kw.includes(q));
    });
  }, [query]);

  // Clamp selected index
  useEffect(() => {
    if (selectedIndex >= results.length) {
      setSelectedIndex(Math.max(0, results.length - 1));
    }
  }, [results.length, selectedIndex]);

  const handleSelect = (zone: PortfolioZone) => {
    audio.playTransition();
    setIsSearchOpen(false);
    setTimeout(() => setCurrentZone(zone), 150);
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isSearchOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter' && results.length > 0) {
        handleSelect(results[selectedIndex].id);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isSearchOpen, results, selectedIndex, setIsSearchOpen]);

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] p-4"
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsSearchOpen(false)}
          />

          {/* Command Palette */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 400 }}
            className="relative z-10 w-full max-w-lg rounded-2xl glass-panel border border-white/10 overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.8)]"
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5">
              <Search size={18} className="text-cyan-400 flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search destinations, skills, projects..."
                className="flex-1 bg-transparent text-sm text-white placeholder:text-white/30 outline-none font-orbitron tracking-wider"
              />
              <kbd className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[9px] font-orbitron text-white/30">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div className="max-h-[50vh] overflow-y-auto custom-scrollbar">
              {results.length === 0 ? (
                <div className="px-5 py-8 text-center text-xs text-white/30 font-orbitron tracking-wider">
                  NO MATCHING DESTINATIONS FOUND
                </div>
              ) : (
                results.map((result, idx) => (
                  <button
                    key={result.id}
                    onClick={() => handleSelect(result.id)}
                    onMouseEnter={() => {
                      setSelectedIndex(idx);
                      audio.playHover();
                    }}
                    className={`w-full flex items-center gap-3 px-5 py-3 text-left transition-all cursor-pointer ${
                      idx === selectedIndex
                        ? 'bg-cyan-500/10 text-cyan-400'
                        : 'text-white/60 hover:bg-white/3'
                    }`}
                  >
                    <span className={idx === selectedIndex ? 'text-cyan-400' : 'text-white/30'}>
                      {result.icon}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold font-orbitron tracking-wider truncate">
                        {result.label}
                      </div>
                      <div className="text-[10px] text-white/30 truncate">
                        {result.description}
                      </div>
                    </div>
                    {idx === selectedIndex && (
                      <ArrowRight size={14} className="text-cyan-400 flex-shrink-0" />
                    )}
                  </button>
                ))
              )}
            </div>

            {/* Footer hints */}
            <div className="px-5 py-3 border-t border-white/5 flex items-center gap-4 text-[8px] font-orbitron text-white/20 tracking-widest">
              <span>
                <kbd className="px-1 py-0.5 rounded bg-white/5 border border-white/10 text-white/40 mr-1">↑↓</kbd>
                NAVIGATE
              </span>
              <span>
                <kbd className="px-1 py-0.5 rounded bg-white/5 border border-white/10 text-white/40 mr-1">↵</kbd>
                FLY TO
              </span>
              <span>
                <kbd className="px-1 py-0.5 rounded bg-white/5 border border-white/10 text-white/40 mr-1">/</kbd>
                OPEN
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
export default SearchCommand;
