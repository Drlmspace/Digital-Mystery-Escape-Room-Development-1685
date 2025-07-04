import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPlay, FiTrash2, FiUsers, FiClock, FiTarget, FiCalendar, FiPlus } = FiIcons;

export default function SavedGameCard({ savedGame, onContinue, onDelete, onStartNew }) {
  const formatTime = (milliseconds) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    return `${minutes}m ${seconds % 60}s`;
  };

  const getProgressPercentage = () => {
    const totalStages = 6;
    const currentProgress = savedGame.currentStage + savedGame.completedStages.length;
    return Math.round((currentProgress / totalStages) * 100);
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-effect rounded-2xl p-6 border-2 border-gold-400"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-serif font-semibold text-gold-400 flex items-center gap-2">
          💾 Continue Investigation
        </h2>
        <div className="text-mystery-400 text-sm flex items-center gap-1">
          <SafeIcon icon={FiCalendar} className="text-xs" />
          {formatDate(savedGame.lastSaved)}
        </div>
      </div>

      {/* Team Info */}
      <div className="bg-mystery-800 rounded-lg p-4 mb-4">
        <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
          <SafeIcon icon={FiUsers} className="text-gold-400" />
          {savedGame.teamName}
        </h3>
        <div className="text-sm text-mystery-300 mb-3">
          <p>Players: {savedGame.playerNames.join(', ')}</p>
          <p className="capitalize">Difficulty: {savedGame.difficulty}</p>
        </div>

        {/* Progress Stats */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="text-center">
            <div className="text-lg font-bold text-gold-400">
              Stage {savedGame.currentStage + 1}
            </div>
            <div className="text-mystery-400">Current Stage</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-400 flex items-center justify-center gap-1">
              <SafeIcon icon={FiClock} className="text-sm" />
              {formatTime(savedGame.gameStats?.totalTime || 0)}
            </div>
            <div className="text-mystery-400">Time Played</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-mystery-400 mb-2">
            <span>Investigation Progress</span>
            <span>{getProgressPercentage()}%</span>
          </div>
          <div className="w-full bg-mystery-700 rounded-full h-2">
            <div 
              className="bg-gold-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>
        </div>

        {/* Additional Stats */}
        <div className="flex justify-between text-xs text-mystery-400 mt-3">
          <span>Puzzles Solved: {savedGame.gameStats?.puzzlesSolved || 0}</span>
          <span>Hints Used: {savedGame.hintsUsed || 0}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        {/* Continue Button */}
        <button
          onClick={onContinue}
          className="w-full py-3 gold-gradient text-mystery-900 font-semibold rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-3"
        >
          <SafeIcon icon={FiPlay} className="text-xl" />
          Continue Investigation
        </button>

        {/* Secondary Actions */}
        <div className="flex gap-3">
          <button
            onClick={onStartNew}
            className="flex-1 px-4 py-2 bg-mystery-700 text-mystery-200 rounded-lg hover:bg-mystery-600 transition-colors font-medium flex items-center justify-center gap-2"
          >
            <SafeIcon icon={FiPlus} className="text-lg" />
            New Game
          </button>
          <button
            onClick={onDelete}
            className="px-4 py-2 bg-danger-600 text-white rounded-lg hover:bg-danger-700 transition-colors flex items-center gap-2"
            title="Delete saved game"
          >
            <SafeIcon icon={FiTrash2} className="text-lg" />
            Delete Save
          </button>
        </div>
      </div>

      {/* Save Notice */}
      <div className="mt-4 text-xs text-mystery-400 text-center">
        Your progress is automatically saved. You can exit anytime and continue later.
      </div>
    </motion.div>
  );
}