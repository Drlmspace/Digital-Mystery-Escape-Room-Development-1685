import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../../contexts/GameContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiCheck, FiLock, FiCircle } = FiIcons;

export default function StageNavigation() {
  const { currentStage, completedStages, gameData, dispatch } = useGame();

  const goToStage = (stageIndex) => {
    if (completedStages.includes(stageIndex) || stageIndex === currentStage) {
      dispatch({ type: 'GO_TO_STAGE', payload: { stageIndex } });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <div className="glass-effect rounded-2xl p-6">
        <h2 className="text-lg font-serif font-semibold text-gold-400 mb-4">
          Investigation Progress
        </h2>
        
        <div className="flex flex-wrap gap-2">
          {gameData.stages.map((stage, index) => {
            const isCompleted = completedStages.includes(index);
            const isCurrent = index === currentStage;
            const isAccessible = isCompleted || isCurrent;
            
            return (
              <button
                key={index}
                onClick={() => goToStage(index)}
                disabled={!isAccessible}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200
                  ${isCurrent 
                    ? 'bg-gold-500 text-mystery-900 font-semibold' 
                    : isCompleted 
                      ? 'bg-mystery-700 text-mystery-200 hover:bg-mystery-600' 
                      : 'bg-mystery-800 text-mystery-500 cursor-not-allowed'
                  }
                  accessibility-focus
                `}
                aria-label={`Stage ${index + 1}: ${stage.title}`}
              >
                <SafeIcon 
                  icon={isCompleted ? FiCheck : isCurrent ? FiCircle : FiLock} 
                  className="text-sm" 
                />
                <span className="text-sm font-medium">
                  {index + 1}. {stage.title}
                </span>
              </button>
            );
          })}
        </div>
        
        <div className="mt-4 text-sm text-mystery-400">
          <p>
            Progress: {completedStages.length} of {gameData.stages.length} stages completed
          </p>
        </div>
      </div>
    </motion.div>
  );
}