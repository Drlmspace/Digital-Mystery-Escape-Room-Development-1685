import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../contexts/GameContext';
import { useAudio } from '../contexts/AudioContext';
import StageNavigation from './game/StageNavigation';
import NarrativeSection from './game/NarrativeSection';
import PuzzleSection from './game/PuzzleSection';
import GameHUD from './game/GameHUD';
import GameComplete from './game/GameComplete';

export default function GameScreen() {
  const { gameState, currentStage, currentStageData, canAdvance, dispatch } = useGame();
  const { playTrack } = useAudio();
  const [showTransition, setShowTransition] = useState(false);

  useEffect(() => {
    if (currentStageData?.musicTrack) {
      playTrack('ambient', currentStageData.musicTrack);
    }
  }, [currentStage, currentStageData, playTrack]);

  const handleAdvanceStage = () => {
    if (canAdvance()) {
      setShowTransition(true);
      setTimeout(() => {
        dispatch({ type: 'ADVANCE_STAGE' });
        setShowTransition(false);
      }, 2000);
    }
  };

  if (gameState === 'completed') {
    return <GameComplete />;
  }

  if (!currentStageData) {
    return (
      <div className="min-h-screen mystery-gradient flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-serif text-gold-400 mb-4">Investigation Complete</h2>
          <p className="text-mystery-200">Processing final results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mystery-gradient">
      <GameHUD />
      
      <div className="pt-20 pb-8 px-4">
        <div className="max-w-6xl mx-auto">
          <StageNavigation />
          
          <AnimatePresence mode="wait">
            {showTransition ? (
              <motion.div
                key="transition"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center h-96"
              >
                <div className="text-center">
                  <div className="animate-pulse text-6xl text-gold-400 mb-4">🔍</div>
                  <h3 className="text-2xl font-serif text-gold-400 mb-2">
                    Advancing to Next Stage
                  </h3>
                  <p className="text-mystery-200">
                    Processing your discoveries...
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={`stage-${currentStage}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
              >
                <NarrativeSection 
                  narrative={currentStageData.narrative}
                  stageTitle={currentStageData.title}
                />
                
                <PuzzleSection 
                  puzzles={currentStageData.puzzles}
                  onAdvance={handleAdvanceStage}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}