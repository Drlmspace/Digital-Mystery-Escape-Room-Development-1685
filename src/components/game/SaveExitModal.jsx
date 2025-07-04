import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../../contexts/GameContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiSave, FiX, FiCheck, FiClock, FiUsers, FiTarget } = FiIcons;

export default function SaveExitModal({ onClose, onConfirm }) {
  const { teamName, playerNames, currentStage, completedStages, gameStats } = useGame();

  const formatTime = (milliseconds) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}:${(minutes % 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
    }
    return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-mystery-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-mystery-800 border border-mystery-600 rounded-2xl p-8 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-6">
          <div className="text-5xl mb-4">💾</div>
          <h2 className="text-2xl font-serif font-bold text-gold-400 mb-2">
            Save Your Progress
          </h2>
          <p className="text-mystery-200">
            Your game will be automatically saved and you can continue later from where you left off.
          </p>
        </div>

        {/* Current Progress Summary */}
        <div className="bg-mystery-700 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gold-400 mb-3 flex items-center gap-2">
            <SafeIcon icon={FiTarget} className="text-lg" />
            Current Progress
          </h3>
          
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-mystery-300 flex items-center gap-2">
                <SafeIcon icon={FiUsers} className="text-sm" />
                Team:
              </span>
              <span className="text-white font-medium">{teamName}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-mystery-300">Players:</span>
              <span className="text-white">{playerNames.length} players</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-mystery-300">Current Stage:</span>
              <span className="text-white">Stage {currentStage + 1} of 6</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-mystery-300">Stages Completed:</span>
              <span className="text-white">{completedStages.length}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-mystery-300 flex items-center gap-2">
                <SafeIcon icon={FiClock} className="text-sm" />
                Time Played:
              </span>
              <span className="text-white">{formatTime(gameStats.totalTime)}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-mystery-300">Puzzles Solved:</span>
              <span className="text-white">{gameStats.puzzlesSolved}</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-mystery-400 mb-2">
              <span>Investigation Progress</span>
              <span>{Math.round(((currentStage + completedStages.length) / 6) * 100)}%</span>
            </div>
            <div className="w-full bg-mystery-600 rounded-full h-2">
              <div 
                className="bg-gold-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStage + completedStages.length) / 6) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Save Notice */}
        <div className="bg-green-600/20 border border-green-600 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 text-green-400 mb-2">
            <SafeIcon icon={FiCheck} className="text-lg" />
            <span className="font-semibold">Auto-Save Enabled</span>
          </div>
          <p className="text-green-300 text-sm">
            Your progress is automatically saved every few seconds. You can return anytime and continue exactly where you left off.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-mystery-700 text-mystery-200 rounded-lg hover:bg-mystery-600 transition-colors font-medium"
          >
            Keep Playing
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-3 gold-gradient text-mystery-900 rounded-lg hover:opacity-90 transition-opacity font-semibold flex items-center justify-center gap-2"
          >
            <SafeIcon icon={FiSave} className="text-lg" />
            Save & Exit
          </button>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-mystery-400 hover:text-mystery-200 transition-colors"
          aria-label="Close modal"
        >
          <SafeIcon icon={FiX} className="text-xl" />
        </button>
      </motion.div>
    </motion.div>
  );
}