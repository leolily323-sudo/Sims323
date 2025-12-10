import React, { useState, useEffect } from 'react';
import { AppState, CosmicResponse } from '../types';

interface CrystalBallProps {
  appState: AppState;
  onGaze: () => void;
  prediction: CosmicResponse | null;
  reset: () => void;
}

const CrystalBall: React.FC<CrystalBallProps> = ({ appState, onGaze, prediction, reset }) => {
  const [innerMistColor, setInnerMistColor] = useState('text-indigo-500');
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    // Reset internal state when a new prediction arrives or we reset
    if (appState === AppState.GAZING || appState === AppState.IDLE) {
      setShowExplanation(false);
    }
    
    if (prediction && appState === AppState.REVEALED) {
      // Set color based on theme
      switch (prediction.theme) {
        case 'occult': setInnerMistColor('text-red-600'); break; // Dark red/blood
        case 'conspiracy': setInnerMistColor('text-green-500'); break; // Matrix/Alien green
        case 'paranormal': setInnerMistColor('text-purple-600'); break; // Ghostly purple
        case 'mysticism': setInnerMistColor('text-amber-500'); break; // Gold/Ancient
        default: setInnerMistColor('text-indigo-500');
      }

      // Timer to reveal the explanation
      const timer = setTimeout(() => {
        setShowExplanation(true);
      }, 3000); // 3 seconds delay for suspense

      return () => clearTimeout(timer);
    } else {
      setInnerMistColor('text-indigo-500');
    }
  }, [prediction, appState]);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[60vh] z-10 p-4">
      
      {/* Container for the ball to handle hover/click areas */}
      <div 
        className={`relative w-72 h-72 md:w-96 md:h-96 group cursor-pointer transition-transform duration-500 ${appState === AppState.IDLE ? 'hover:scale-105' : ''}`}
        onClick={() => {
          if (appState === AppState.IDLE || appState === AppState.REVEALED) {
            // Only trigger click on background if not clicking the link (handled by propagation but good to be safe)
            if(appState === AppState.REVEALED) {
               // If clicking the ball but not the link, maybe we don't reset immediately to allow reading? 
               // The prompt implies we should reset. But if scrolling, we might accidentally click.
               // Let's rely on the button for resetting or explicit click outside text.
               // Actually, let's keep the existing behavior but ensure text clicks don't bubble if they are interactional.
               // The link has its own click handler implicitly via <a> tag.
               reset();
            } else {
               onGaze();
            }
          }
        }}
      >
        
        {/* Outer Glow / Aura */}
        <div className={`absolute inset-0 rounded-full bg-gradient-to-r from-gray-900 to-indigo-900 blur-3xl opacity-40 transition-opacity duration-1000 ${appState === AppState.GAZING ? 'opacity-80 animate-pulse-glow' : 'animate-pulse'}`}></div>

        {/* The Ball Itself */}
        <div className={`
          relative w-full h-full rounded-full 
          bg-black 
          shadow-[inset_-10px_-10px_30px_rgba(50,50,50,0.2),inset_10px_10px_40px_rgba(0,0,0,0.9),0_0_50px_rgba(20,20,20,0.8)]
          overflow-hidden border border-white/5
          flex items-center justify-center
          animate-float
        `}>
          
          {/* Reflection / Shine */}
          <div className="absolute top-4 left-8 w-1/3 h-1/6 bg-white/5 rounded-[50%] blur-sm rotate-[135deg] pointer-events-none"></div>
          
          {/* Inner Mist / Clouds */}
          <div className={`
             absolute inset-0 opacity-60 mix-blend-screen pointer-events-none transition-all duration-1000 
             ${appState === AppState.GAZING ? 'animate-mist-fast scale-125 opacity-80' : 'animate-mist scale-100'}
             ${appState === AppState.REVEALED ? 'opacity-40' : ''}
          `}>
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className={`w-full h-full fill-current ${innerMistColor} blur-2xl opacity-50`}>
              <path d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,81.6,-46.6C91.4,-34.1,98.1,-19.2,95.9,-5.3C93.7,8.6,82.6,21.5,71.5,32.2C60.4,42.9,49.3,51.4,37.6,58.8C25.9,66.2,13.6,72.5,-0.6,73.5C-14.8,74.5,-27.9,70.2,-40.3,63.1C-52.7,56,-64.4,46.1,-73.4,33.5C-82.4,20.9,-88.7,5.6,-86.3,-8.3C-83.9,-22.2,-72.8,-34.7,-61.2,-44.6C-49.6,-54.5,-37.5,-61.8,-24.9,-69.8C-12.3,-77.8,0.8,-86.5,14.2,-86.7C27.6,-86.9,41.2,-78.6,44.7,-76.4Z" transform="translate(100 100)" />
            </svg>
          </div>

          {/* Central Core (Eye of the oracle) */}
          <div className={`absolute w-4 h-4 rounded-full bg-white transition-all duration-700 blur-sm
            ${appState === AppState.GAZING ? 'scale-[20] opacity-10' : 'scale-0 opacity-0'}
          `}></div>

          {/* Text Display Area */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-20 pointer-events-none">
             {appState === AppState.GAZING && (
                <div className="text-white/60 font-mystical animate-pulse text-xl tracking-[0.2em]">
                  PIERCING THE VEIL...
                </div>
             )}
             
             {appState === AppState.IDLE && !prediction && (
               <div className="text-white/30 font-mystical text-sm tracking-widest uppercase">
                 Touch the Void
               </div>
             )}

             {appState === AppState.REVEALED && prediction && (
               <div className="w-full h-full flex flex-col items-center justify-center p-8">
                  {/* The Cryptic Phrase */}
                  <div className={`animate-coalesce shrink-0 transition-all duration-[2000ms] ${showExplanation ? 'mb-2' : 'mb-0'}`}>
                    <h2 className="text-white font-mystical text-2xl md:text-3xl font-bold tracking-widest drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] uppercase">
                      {prediction.phrase}
                    </h2>
                  </div>

                  {/* The Delayed Explanation */}
                  <div 
                    className={`
                      pointer-events-auto
                      flex flex-col items-center gap-2 
                      transition-all duration-[2500ms] ease-out 
                      ${showExplanation ? 'opacity-100 translate-y-0 max-h-[60%]' : 'opacity-0 translate-y-4 max-h-0'}
                      overflow-y-auto scrollbar-thin
                      w-full
                    `}
                    onClick={(e) => e.stopPropagation()} 
                  >
                     <p className="text-white/80 font-sans text-xs md:text-sm font-medium leading-relaxed drop-shadow-md border-t border-white/10 pt-2 mx-4">
                       {prediction.explanation}
                     </p>
                     
                     <a 
                       href={prediction.sourceUrl} 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="shrink-0 text-[10px] md:text-xs text-indigo-300/80 hover:text-indigo-200 uppercase tracking-[0.2em] border-b border-indigo-500/30 hover:border-indigo-400 pb-1 transition-all duration-300 mt-2 mb-2 animate-pulse hover:animate-none"
                     >
                       Dive Deeper
                     </a>
                  </div>
               </div>
             )}
          </div>

        </div>

        {/* Base / Stand */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-40 h-8 bg-black blur-xl opacity-80 rounded-[100%]"></div>
      </div>
      
      {/* Control Button */}
      <div className="mt-12 z-20">
        <button
          disabled={appState === AppState.GAZING}
          onClick={(e) => {
             e.stopPropagation(); // Prevent bubbling to the ball click handler
             if (appState === AppState.REVEALED) {
               reset();
             } else {
               onGaze();
             }
          }}
          className={`
            relative overflow-hidden group px-8 py-3 rounded-full 
            border border-white/10 bg-black/40 backdrop-blur-sm
            text-gray-300 font-mystical tracking-[0.2em] uppercase text-sm
            transition-all duration-300
            ${appState === AppState.GAZING ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/5 hover:border-white/30 hover:text-white'}
          `}
        >
          <span className="relative z-10">
            {appState === AppState.GAZING ? 'Summoning...' : appState === AppState.REVEALED ? 'Seek More' : 'Summon Truth'}
          </span>
        </button>
      </div>

    </div>
  );
};

export default CrystalBall;