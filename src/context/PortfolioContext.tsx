import React, { createContext, useContext, useState } from 'react';
import { audio } from '../utils/audio';

export type PortfolioZone = 'home' | 'projects' | 'skills' | 'education' | 'internship' | 'communities' | 'achievements' | 'contact' | 'uiux';

interface PortfolioContextType {
  isLoading: boolean;
  setFinishedLoading: () => void;
  currentZone: PortfolioZone;
  setCurrentZone: (zone: PortfolioZone) => void;
  activeOverlay: PortfolioZone | null;
  setActiveOverlay: (overlay: PortfolioZone | null) => void;
  collectedGems: number[];
  collectGem: (id: number) => void;
  showSecretMode: boolean;
  setShowSecretMode: (show: boolean) => void;
  selectedCommunityOrg: string | null;
  setSelectedCommunityOrg: (org: string | null) => void;
  selectedAchievement: string | null;
  setSelectedAchievement: (id: string | null) => void;
  selectedFigmaProject: string | null;
  setSelectedFigmaProject: (id: string | null) => void;
  isRecruiterMode: boolean;
  setIsRecruiterMode: (active: boolean) => void;
  isDirectoryOpen: boolean;
  setIsDirectoryOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentZone, setCurrentZone] = useState<PortfolioZone>('home');
  const [activeOverlay, setActiveOverlay] = useState<PortfolioZone | null>(null);
  const [collectedGems, setCollectedGems] = useState<number[]>([]);
  const [showSecretMode, setShowSecretMode] = useState(false);
  const [selectedCommunityOrg, setSelectedCommunityOrg] = useState<string | null>(null);
  const [selectedAchievement, setSelectedAchievement] = useState<string | null>(null);
  const [selectedFigmaProject, setSelectedFigmaProject] = useState<string | null>(null);
  const [isRecruiterMode, setIsRecruiterMode] = useState(false);
  const [isDirectoryOpen, setIsDirectoryOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const setFinishedLoading = () => {
    setIsLoading(false);
    // Play startup sweeping sound when loading screen completes
    setTimeout(() => {
      audio.playStartup();
    }, 100);
  };

  const handleSetCurrentZone = (zone: PortfolioZone) => {
    audio.playTransition();
    setCurrentZone(zone);
    
    // Automatically open the corresponding overlay panel after the camera transitions
    // Wait briefly (800ms) for camera fly-to transition to complete
    setActiveOverlay(null);
    setTimeout(() => {
      setActiveOverlay(zone);
    }, 850);
  };

  const collectGem = (id: number) => {
    if (collectedGems.includes(id)) return;
    
    audio.playSuccess();
    const updated = [...collectedGems, id];
    setCollectedGems(updated);
    
    // If all 3 gems are collected, trigger secret mode!
    if (updated.length === 3) {
      setShowSecretMode(true);
    }
  };

  return (
    <PortfolioContext.Provider
      value={{
        isLoading,
        setFinishedLoading,
        currentZone,
        setCurrentZone: handleSetCurrentZone,
        activeOverlay,
        setActiveOverlay,
        collectedGems,
        collectGem,
        showSecretMode,
        setShowSecretMode,
        selectedCommunityOrg,
        setSelectedCommunityOrg,
        selectedAchievement,
        setSelectedAchievement,
        selectedFigmaProject,
        setSelectedFigmaProject,
        isRecruiterMode,
        setIsRecruiterMode,
        isDirectoryOpen,
        setIsDirectoryOpen,
        isSearchOpen,
        setIsSearchOpen
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
export default PortfolioContext;
