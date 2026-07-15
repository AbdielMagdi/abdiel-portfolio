import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { audio } from '../utils/audio';

export const AudioController: React.FC = () => {
  const [isMuted, setIsMuted] = useState(true);

  // Sync mute state with audio engine
  useEffect(() => {
    setIsMuted(audio.getMutedState());
  }, []);

  const handleToggle = () => {
    audio.playClick();
    const newMute = audio.toggleMute();
    setIsMuted(newMute);
  };

  return (
    <button
      onClick={handleToggle}
      onMouseEnter={() => audio.playHover()}
      className="flex items-center gap-3 px-4 py-2 rounded-full glass-panel-light hover:border-cyan-500/40 hover:bg-white/10 transition-all duration-300 pointer-events-auto"
      title={isMuted ? "Unmute Ambient Audio" : "Mute Audio"}
      id="hud-audio-toggle"
    >
      <div className="relative w-4 h-4 flex items-center justify-center text-white/70">
        {isMuted ? (
          <VolumeX size={16} className="text-white/40" />
        ) : (
          <Volume2 size={16} className="text-cyan-400 animate-pulse" />
        )}
      </div>
      
      {/* Audio bars animations */}
      <div className="flex gap-[2px] items-end h-3 w-5">
        {[1, 2, 3, 4].map((bar) => (
          <div
            key={bar}
            className={`w-[2px] bg-gradient-to-t from-cyan-400 to-purple-400 rounded-full transition-all ${
              isMuted ? 'h-[2px] opacity-20' : 'animate-bounce h-full'
            }`}
            style={{
              animationDelay: `${bar * 0.15}s`,
              animationDuration: isMuted ? '0s' : '0.8s',
            }}
          />
        ))}
      </div>
      <span className="text-[10px] tracking-[0.2em] font-orbitron font-semibold text-white/50 hidden sm:inline">
        {isMuted ? "AUDIO OFF" : "AUDIO ON"}
      </span>
    </button>
  );
};
