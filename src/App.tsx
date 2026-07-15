import React, { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { PortfolioProvider, usePortfolio } from './context/PortfolioContext';
import { LoadingScreen } from './components/LoadingScreen';
import { AudioController } from './components/AudioController';
import { Navigation } from './components/Navigation';
import { CanvasContainer } from './components/CanvasContainer';
import { World } from './3d/World';
import { OverlaysContainer } from './sections/OverlaysContainer';
import { MouseFollower } from './components/MouseFollower';
import { FlightDirectory } from './components/FlightDirectory';
import { SearchCommand } from './components/SearchCommand';
import { RecruiterMode } from './components/RecruiterMode';
import { Terminal, ShieldAlert } from 'lucide-react';

const AppContent: React.FC = () => {
  const { 
    isLoading, setFinishedLoading, currentZone, activeOverlay, showSecretMode,
    isDirectoryOpen, setIsDirectoryOpen, isSearchOpen, setIsSearchOpen, isRecruiterMode
  } = usePortfolio();

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        setIsDirectoryOpen(!isDirectoryOpen);
        setIsSearchOpen(false);
      } else if (e.key === '/' || (e.ctrlKey && e.key === 'k')) {
        e.preventDefault();
        setIsSearchOpen(!isSearchOpen);
        setIsDirectoryOpen(false);
      } else if (e.key === 'Escape') {
        if (isSearchOpen) setIsSearchOpen(false);
        if (isDirectoryOpen) setIsDirectoryOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDirectoryOpen, isSearchOpen, setIsDirectoryOpen, setIsSearchOpen]);

  return (
    <div className={`relative w-screen h-screen overflow-hidden bg-[#050505] select-none ${showSecretMode ? 'scanline' : ''}`}>
      
      {/* Background cyber grid overlay for premium look */}
      <div className="absolute inset-0 z-0 pointer-events-none cyber-grid opacity-30" />

      {/* Loading Screen */}
      <AnimatePresence>
        {isLoading && (
          <LoadingScreen onFinished={setFinishedLoading} />
        )}
      </AnimatePresence>

      {!isLoading && (
        <>
          {/* Main 3D WebGL Canvas */}
          <CanvasContainer>
            <World />
          </CanvasContainer>

          {/* Floating UI HUD - Top Left Status Dashboard */}
          <header className="fixed top-6 left-6 z-40 pointer-events-none flex flex-col gap-1 select-none">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel-light border border-white/5 w-fit">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(0,240,255,0.8)]" />
              <span className="text-[10px] tracking-[0.2em] font-orbitron font-bold text-white/80">
                {isRecruiterMode ? 'RECRUITER TOUR' : 'SYSTEM ONLINE'}
              </span>
            </div>
            
            <div className="flex flex-col mt-2 pl-1">
              <h1 className="text-xl md:text-2xl font-black font-orbitron text-white tracking-widest leading-none">
                AM_SAMUEL
              </h1>
              <div className="flex items-center gap-1.5 text-[8px] tracking-[0.2em] font-orbitron text-white/40 mt-1">
                <Terminal size={10} className="text-cyan-400" />
                <span>SECTOR: {currentZone.toUpperCase()}</span>
              </div>
            </div>
          </header>

          {/* Floating UI HUD - Top Right Controller (Audio + Info) */}
          <div className="fixed top-6 right-6 z-40 flex items-center gap-3 pointer-events-none">
            {showSecretMode && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-950/30 border border-purple-500/40 text-[9px] font-orbitron font-extrabold text-purple-300 animate-bounce">
                <ShieldAlert size={12} />
                <span>JOKE MODE ENABLED</span>
              </div>
            )}
            <AudioController />
          </div>

          {/* Overlay card details */}
          <OverlaysContainer />

          {/* Dock Navigation menu */}
          <Navigation />

          {/* Flight Directory Modal */}
          <FlightDirectory />

          {/* Search Command Palette */}
          <SearchCommand />

          {/* Recruiter Mode HUD */}
          <RecruiterMode />

          {/* User Interaction hints */}
          {!activeOverlay && !isRecruiterMode && (
            <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-30 pointer-events-none select-none text-center">
              <span className="text-[9px] tracking-[0.3em] font-orbitron text-white/30 animate-pulse-slow">
                PRESS <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-white/50 mx-1">M</kbd> FOR DIRECTORY
                <span className="mx-2 text-white/10">|</span>
                <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-white/50 mx-1">/</kbd> TO SEARCH
              </span>
            </div>
          )}

          {/* Premium Mouse Follower (Desktop only) */}
          <MouseFollower />
        </>
      )}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <PortfolioProvider>
      <AppContent />
    </PortfolioProvider>
  );
};
export default App;
