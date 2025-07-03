import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../../contexts/GameContext';
import { useAudio } from '../../contexts/AudioContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiClock, FiHelpCircle, FiPause, FiPlay, FiVolumeX, FiVolume2, FiHome } = FiIcons;

export default function GameHUD() {
  const { 
    currentStage, 
    startTime, 
    gameState, 
    dispatch, 
    getAvailableHints,
    currentStageData
  } = useGame();
  
  const { isMuted, dispatch: audioDispatch } = useAudio();
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [showHints, setShowHints] = useState(false);

  useEffect(() => {
    if (gameState === 'playing' && startTime) {
      const timer = setInterval(() => {
        setTimeElapsed(Date.now() - startTime);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameState, startTime]);

  const formatTime = (milliseconds) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}:${(minutes % 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
    }
    return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  const togglePause = () => {
    if (gameState === 'playing') {
      dispatch({ type: 'PAUSE_GAME' });
    } else if (gameState === 'paused') {
      dispatch({ type: 'RESUME_GAME' });
    }
  };

  const toggleMute = () => {
    audioDispatch({ type: 'TOGGLE_MUTE' });
  };

  const availableHints = getAvailableHints();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-mystery-900/95 backdrop-blur-sm border-b border-mystery-700"
    >
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left Side - Stage Info */}
          <div className="flex items-center gap-4">
            <div className="text-gold-400 font-serif font-semibold">
              Stage {currentStage + 1}: {currentStageData?.title}
            </div>
            <div className="text-mystery-300 text-sm">
              {currentStageData?.description}
            </div>
          </div>

          {/* Right Side - Controls */}
          <div className="flex items-center gap-4">
            {/* Timer */}
            <div className="flex items-center gap-2 text-mystery-200">
              <SafeIcon icon={FiClock} className="text-lg" />
              <span className="font-mono">{formatTime(timeElapsed)}</span>
            </div>

            {/* Hints */}
            <div className="relative">
              <button
                onClick={() => setShowHints(!showHints)}
                className="flex items-center gap-2 px-3 py-1 bg-mystery-700 text-mystery-200 rounded-lg hover:bg-mystery-600 transition-colors accessibility-focus"
                disabled={availableHints === 0}
              >
                <SafeIcon icon={FiHelpCircle} className="text-lg" />
                <span>{availableHints}</span>
              </button>

              {showHints && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute right-0 top-full mt-2 w-64 bg-mystery-800 border border-mystery-600 rounded-lg p-4 shadow-xl"
                >
                  <h4 className="font-semibold text-gold-400 mb-2">Available Hints</h4>
                  <p className="text-mystery-200 text-sm mb-3">
                    You have {availableHints} hints remaining for this game.
                  </p>
                  <button
                    onClick={() => setShowHints(false)}
                    className="text-sm text-mystery-400 hover:text-mystery-200"
                  >
                    Close
                  </button>
                </motion.div>
              )}
            </div>

            {/* Pause/Play */}
            <button
              onClick={togglePause}
              className="p-2 bg-mystery-700 text-mystery-200 rounded-lg hover:bg-mystery-600 transition-colors accessibility-focus"
              aria-label={gameState === 'playing' ? 'Pause game' : 'Resume game'}
            >
              <SafeIcon icon={gameState === 'playing' ? FiPause : FiPlay} className="text-lg" />
            </button>

            {/* Audio Toggle */}
            <button
              onClick={toggleMute}
              className="p-2 bg-mystery-700 text-mystery-200 rounded-lg hover:bg-mystery-600 transition-colors accessibility-focus"
              aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
            >
              <SafeIcon icon={isMuted ? FiVolumeX : FiVolume2} className="text-lg" />
            </button>

            {/* Home */}
            <button
              onClick={() => window.location.href = '/'}
              className="p-2 bg-mystery-700 text-mystery-200 rounded-lg hover:bg-mystery-600 transition-colors accessibility-focus"
              aria-label="Return to start screen"
            >
              <SafeIcon icon={FiHome} className="text-lg" />
            </button>
          </div>
        </div>
      </div>

      {/* Pause Overlay */}
      {gameState === 'paused' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-mystery-900/80 backdrop-blur-sm z-40 flex items-center justify-center"
        >
          <div className="text-center">
            <h2 className="text-4xl font-serif text-gold-400 mb-4">Game Paused</h2>
            <p className="text-mystery-200 mb-6">Click play to resume your investigation</p>
            <button
              onClick={togglePause}
              className="px-6 py-3 gold-gradient text-mystery-900 font-semibold rounded-lg hover:opacity-90 transition-opacity"
            >
              Resume Game
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}