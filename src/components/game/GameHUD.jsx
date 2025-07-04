import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../../contexts/GameContext';
import { useAudio } from '../../contexts/AudioContext';
import { useNavigate } from 'react-router-dom';
import SaveExitModal from './SaveExitModal';
import FeedbackButton from '../feedback/FeedbackButton';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiClock, FiHelpCircle, FiPause, FiPlay, FiVolumeX, FiVolume2, FiHome, FiSave, FiMenu, FiX } = FiIcons;

export default function GameHUD() {
  const navigate = useNavigate();
  const { currentStage, startTime, gameState, dispatch, getAvailableHints, currentStageData } = useGame();
  const { isMuted, dispatch: audioDispatch } = useAudio();

  const [timeElapsed, setTimeElapsed] = useState(0);
  const [showHints, setShowHints] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showSaveExitModal, setShowSaveExitModal] = useState(false);

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

  const handleSaveAndExit = () => {
    setShowSaveExitModal(true);
    setShowMenu(false);
  };

  const handleGoHome = () => {
    if (confirm('Are you sure you want to return to the main menu? Your progress will be automatically saved.')) {
      navigate('/');
    }
    setShowMenu(false);
  };

  const availableHints = getAvailableHints();

  return (
    <>
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
              <div className="text-mystery-300 text-sm hidden md:block">
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

              {/* Feedback Button in Header */}
              <FeedbackButton 
                variant="header" 
                size="small" 
                showText={false}
              />

              {/* Menu Button */}
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-2 bg-mystery-700 text-mystery-200 rounded-lg hover:bg-mystery-600 transition-colors accessibility-focus"
                  aria-label="Game menu"
                >
                  <SafeIcon icon={showMenu ? FiX : FiMenu} className="text-lg" />
                </button>

                {/* Dropdown Menu */}
                {showMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="absolute right-0 top-full mt-2 w-56 bg-mystery-800 border border-mystery-600 rounded-lg shadow-xl overflow-hidden"
                  >
                    <div className="p-2 space-y-1">
                      {/* Pause/Resume */}
                      <button
                        onClick={togglePause}
                        className="w-full flex items-center gap-3 px-3 py-2 text-mystery-200 hover:bg-mystery-700 rounded-lg transition-colors text-left"
                      >
                        <SafeIcon icon={gameState === 'playing' ? FiPause : FiPlay} className="text-lg" />
                        {gameState === 'playing' ? 'Pause Game' : 'Resume Game'}
                      </button>

                      {/* Audio Toggle */}
                      <button
                        onClick={toggleMute}
                        className="w-full flex items-center gap-3 px-3 py-2 text-mystery-200 hover:bg-mystery-700 rounded-lg transition-colors text-left"
                      >
                        <SafeIcon icon={isMuted ? FiVolumeX : FiVolume2} className="text-lg" />
                        {isMuted ? 'Unmute Audio' : 'Mute Audio'}
                      </button>

                      <div className="h-px bg-mystery-600 my-2"></div>

                      {/* Save and Exit */}
                      <button
                        onClick={handleSaveAndExit}
                        className="w-full flex items-center gap-3 px-3 py-2 text-gold-400 hover:bg-mystery-700 rounded-lg transition-colors text-left font-medium"
                      >
                        <SafeIcon icon={FiSave} className="text-lg" />
                        Save & Exit Game
                      </button>

                      {/* Go Home */}
                      <button
                        onClick={handleGoHome}
                        className="w-full flex items-center gap-3 px-3 py-2 text-mystery-200 hover:bg-mystery-700 rounded-lg transition-colors text-left"
                      >
                        <SafeIcon icon={FiHome} className="text-lg" />
                        Return to Menu
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Pause Overlay */}
      {gameState === 'paused' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-mystery-900/80 backdrop-blur-sm z-40 flex items-center justify-center"
        >
          <div className="text-center">
            <h2 className="text-4xl font-serif text-gold-400 mb-4">Game Paused</h2>
            <p className="text-mystery-200 mb-6">Click resume to continue your investigation</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={togglePause}
                className="px-6 py-3 gold-gradient text-mystery-900 font-semibold rounded-lg hover:opacity-90 transition-opacity flex items-center gap-3"
              >
                <SafeIcon icon={FiPlay} className="text-lg" />
                Resume Game
              </button>
              <button
                onClick={handleSaveAndExit}
                className="px-6 py-3 bg-mystery-700 text-mystery-200 font-semibold rounded-lg hover:bg-mystery-600 transition-colors flex items-center gap-3"
              >
                <SafeIcon icon={FiSave} className="text-lg" />
                Save & Exit
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Save and Exit Modal */}
      {showSaveExitModal && (
        <SaveExitModal
          onClose={() => setShowSaveExitModal(false)}
          onConfirm={() => {
            setShowSaveExitModal(false);
            navigate('/');
          }}
        />
      )}

      {/* Click outside to close menu */}
      {showMenu && (
        <div className="fixed inset-0 z-30" onClick={() => setShowMenu(false)} />
      )}
    </>
  );
}