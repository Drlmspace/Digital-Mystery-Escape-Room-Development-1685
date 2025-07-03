import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../../contexts/GameContext';
import PuzzleCard from './puzzles/PuzzleCard';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiArrowRight, FiCheck } = FiIcons;

export default function PuzzleSection({ puzzles, onAdvance }) {
  const { canAdvance, currentStage } = useGame();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-serif font-semibold text-gold-400 mb-2">
          Investigation Challenges
        </h3>
        <p className="text-mystery-200">
          Complete all puzzles to advance to the next stage
        </p>
      </div>

      {/* Puzzles Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {puzzles.map((puzzle, index) => (
          <PuzzleCard
            key={puzzle.id}
            puzzle={puzzle}
            index={index}
            stageIndex={currentStage}
          />
        ))}
      </div>

      {/* Advance Button */}
      {canAdvance() && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mt-8"
        >
          <button
            onClick={onAdvance}
            className="px-8 py-4 gold-gradient text-mystery-900 font-semibold rounded-lg hover:opacity-90 transition-opacity flex items-center gap-3 mx-auto text-lg accessibility-focus"
          >
            <SafeIcon icon={FiCheck} className="text-xl" />
            Stage Complete - Continue Investigation
            <SafeIcon icon={FiArrowRight} className="text-xl" />
          </button>
        </motion.div>
      )}
    </div>
  );
}