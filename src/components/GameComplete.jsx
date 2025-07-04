import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';
import FeedbackSection from './feedback/FeedbackSection';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiTrophy, FiClock, FiHelpCircle, FiTarget, FiHome, FiRotateCcw } = FiIcons;

export default function GameComplete() {
  const navigate = useNavigate();
  const { gameStats, teamName, playerNames, difficulty, completedStages } = useGame();

  const formatTime = (milliseconds) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getPerformanceRating = () => {
    const totalTime = gameStats.totalTime;
    const hintsUsed = gameStats.hintsUsed;
    const stagesCompleted = completedStages.length;

    if (stagesCompleted === 6 && totalTime < 3000000 && hintsUsed <= 2) {
      return { rating: 'Exceptional', color: 'text-gold-400', icon: '🏆' };
    } else if (stagesCompleted >= 5 && totalTime < 3600000 && hintsUsed <= 4) {
      return { rating: 'Excellent', color: 'text-green-400', icon: '⭐' };
    } else if (stagesCompleted >= 4) {
      return { rating: 'Good', color: 'text-blue-400', icon: '👍' };
    } else {
      return { rating: 'Needs Improvement', color: 'text-yellow-400', icon: '📈' };
    }
  };

  const performance = getPerformanceRating();

  const restartGame = () => {
    localStorage.removeItem('escaperoomSave');
    navigate('/');
  };

  return (
    <div className="min-h-screen mystery-gradient flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl w-full"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-8xl mb-6"
          >
            {performance.icon}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-5xl font-serif font-bold text-gold-400 mb-4 text-glow"
          >
            Investigation Complete!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-xl text-mystery-200"
          >
            The mystery of Dr. Eleanor Blackwood has been solved
          </motion.p>
        </div>

        {/* Results Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Team Stats */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="glass-effect rounded-2xl p-8"
          >
            <h2 className="text-2xl font-serif font-semibold text-gold-400 mb-6 flex items-center gap-3">
              <SafeIcon icon={FiTrophy} className="text-3xl" />
              Team Performance
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-mystery-200 mb-2">Team: {teamName}</h3>
                <div className="flex flex-wrap gap-2">
                  {playerNames.map((name, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-mystery-700 text-mystery-200 rounded-full text-sm"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-mystery-200 mb-2">Difficulty</h3>
                <span className="px-3 py-1 bg-gold-500 text-mystery-900 rounded-full text-sm font-semibold capitalize">
                  {difficulty}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-mystery-200 mb-2">Overall Rating</h3>
                <span className={`text-xl font-bold ${performance.color}`}>
                  {performance.rating}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Game Statistics */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.0 }}
            className="glass-effect rounded-2xl p-8"
          >
            <h2 className="text-2xl font-serif font-semibold text-gold-400 mb-6 flex items-center gap-3">
              <SafeIcon icon={FiTarget} className="text-3xl" />
              Statistics
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <SafeIcon icon={FiClock} className="text-gold-400" />
                  <span className="text-mystery-200">Total Time</span>
                </div>
                <span className="text-white font-semibold">
                  {formatTime(gameStats.totalTime)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <SafeIcon icon={FiHelpCircle} className="text-gold-400" />
                  <span className="text-mystery-200">Hints Used</span>
                </div>
                <span className="text-white font-semibold">
                  {gameStats.hintsUsed}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <SafeIcon icon={FiTarget} className="text-gold-400" />
                  <span className="text-mystery-200">Stages Completed</span>
                </div>
                <span className="text-white font-semibold">
                  {completedStages.length} / 6
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <SafeIcon icon={FiTrophy} className="text-gold-400" />
                  <span className="text-mystery-200">Puzzles Solved</span>
                </div>
                <span className="text-white font-semibold">
                  {gameStats.puzzlesSolved}
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Story Conclusion */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="glass-effect rounded-2xl p-8 mb-8"
        >
          <h2 className="text-2xl font-serif font-semibold text-gold-400 mb-4 text-center">
            The Truth Revealed
          </h2>
          <div className="prose prose-lg max-w-none text-mystery-100 narrative-text">
            <p className="mb-4">
              Through your meticulous investigation, you've uncovered the truth behind Dr. Eleanor Blackwood's disappearance. 
              The forgery ring operating within the Metropolitan Museum of Digital Arts has been exposed, and the corrupt 
              board members have been brought to justice.
            </p>
            <p className="mb-4">
              Dr. Blackwood's dedication to preserving the integrity of art and culture has been vindicated. The real artworks 
              have been recovered, and the museum can now rebuild its reputation on a foundation of truth and authenticity.
            </p>
            <p className="text-center font-semibold text-gold-400">
              Your team's detective work has saved both Dr. Blackwood and the museum's legacy.
            </p>
          </div>
        </motion.div>

        {/* Feedback Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          className="mb-8"
        >
          <FeedbackSection />
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6 }}
          className="flex justify-center gap-6"
        >
          <button
            onClick={restartGame}
            className="flex items-center gap-3 px-8 py-4 gold-gradient text-mystery-900 font-semibold rounded-lg hover:opacity-90 transition-opacity accessibility-focus"
          >
            <SafeIcon icon={FiRotateCcw} className="text-xl" />
            Play Again
          </button>

          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-3 px-8 py-4 bg-mystery-700 text-mystery-200 font-semibold rounded-lg hover:bg-mystery-600 transition-colors accessibility-focus"
          >
            <SafeIcon icon={FiHome} className="text-xl" />
            Main Menu
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}