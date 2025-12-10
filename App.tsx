import React, { useState } from 'react';
import StarField from './components/StarField';
import CrystalBall from './components/CrystalBall';
import { generateCosmicInsight } from './services/geminiService';
import { audioService } from './services/audioService';
import { AppState, CosmicResponse } from './types';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [prediction, setPrediction] = useState<CosmicResponse | null>(null);

  const handleGaze = async () => {
    if (appState === AppState.GAZING) return;

    // Initialize audio context (requires user gesture) for music and SFX
    await audioService.initialize();
    
    setAppState(AppState.GAZING);
    setPrediction(null);
    audioService.playSummonSound();

    // Minimum wait time for the animation to feel "weighty" and allow summon sound to play
    const minWait = new Promise(resolve => setTimeout(resolve, 2000));
    const insightPromise = generateCosmicInsight();

    const [_, result] = await Promise.all([minWait, insightPromise]);

    setPrediction(result);
    setAppState(AppState.REVEALED);
    audioService.playRevealSound();
  };

  const resetOracle = () => {
    audioService.playResetSound();
    setAppState(AppState.IDLE);
    setPrediction(null);
  };

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-b from-[#020202] via-[#0a0a0a] to-[#050510] overflow-hidden text-white selection:bg-red-900/30">
      
      {/* Background Effects */}
      <StarField />
      
      {/* Main Content Layout */}
      <main className="relative z-10 flex flex-col items-center min-h-screen px-4 py-8">
        
        {/* Header */}
        <header className="w-full text-center mt-4 md:mt-8 mb-4">
          <h1 className="font-mystical text-3xl md:text-5xl text-gray-200 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] tracking-[0.2em] opacity-90 uppercase">
            The Unseen
          </h1>
          <p className="font-sans text-gray-500 text-xs md:text-sm mt-2 tracking-widest uppercase">
            Forbidden Knowledge awaits
          </p>
        </header>

        {/* Oracle Section */}
        <div className="flex-grow flex items-center justify-center w-full">
          <CrystalBall 
            appState={appState} 
            onGaze={handleGaze} 
            prediction={prediction} 
            reset={resetOracle}
          />
        </div>

        {/* Footer */}
        <footer className="w-full text-center py-6 text-white/10 text-[10px] tracking-widest uppercase">
          <p>Powered by Gemini 2.5 Flash</p>
        </footer>

      </main>
      
      {/* Vignette Overlay for deeper atmosphere */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.95)_100%)] z-0"></div>
    </div>
  );
};

export default App;
