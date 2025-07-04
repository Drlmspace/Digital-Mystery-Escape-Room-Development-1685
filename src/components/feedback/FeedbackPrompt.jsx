import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../contexts/GameContext';
import SafeIcon from '../../common/SafeIcon';
import FeedbackModal from './FeedbackModal';
import * as FiIcons from 'react-icons/fi';

const { FiMessageSquare, FiX, FiStar } = FiIcons;

export default function FeedbackPrompt() {
  const { gameState, completedStages, currentStage } = useGame();
  const [showPrompt, setShowPrompt] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [hasShownPrompt, setHasShownPrompt] = useState(false);

  useEffect(() => {
    // Check if we should show feedback prompt
    const shouldShowPrompt = () => {
      // Don't show if already shown this session
      if (hasShownPrompt) return false;

      // Check localStorage to see if user recently gave feedback
      const lastFeedback = localStorage.getItem('lastFeedbackPrompt');
      const now = Date.now();
      
      if (lastFeedback) {
        const daysSinceLastPrompt = (now - parseInt(lastFeedback)) / (1000 * 60 * 60 * 24);
        // Don't show again for 7 days
        if (daysSinceLastPrompt < 7) return false;
      }

      // Show prompt after completing stage 3 (mid-game feedback)
      if (completedStages.length === 3 && currentStage === 3) {
        return true;
      }

      // Show prompt after game completion
      if (gameState === 'completed') {
        return true;
      }

      return false;
    };

    if (shouldShowPrompt()) {
      // Delay showing prompt to not interrupt gameplay
      const timer = setTimeout(() => {
        setShowPrompt(true);
        setHasShownPrompt(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [gameState, completedStages, currentStage, hasShownPrompt]);

  const handleDismiss = () => {
    setShowPrompt(false);
    // Record that we showed the prompt
    localStorage.setItem('lastFeedbackPrompt', Date.now().toString());
  };

  const handleOpenFeedback = () => {
    setShowPrompt(false);
    setShowModal(true);
    // Record that we showed the prompt
    localStorage.setItem('lastFeedbackPrompt', Date.now().toString());
  };

  const getPromptMessage = () => {
    if (gameState === 'completed') {
      return {
        title: "🎉 Congratulations!",
        message: "You've completed The Vanishing Curator! How was your escape room experience?",
        cta: "Share Your Experience"
      };
    } else if (completedStages.length === 3) {
      return {
        title: "🔍 Halfway Through!",
        message: "You're doing great! How are you finding the puzzles and story so far?",
        cta: "Quick Feedback"
      };
    }
    return null;
  };

  const promptData = getPromptMessage();

  if (!promptData) return null;

  return (
    <>
      <AnimatePresence>
        {showPrompt && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed bottom-6 right-6 z-50 max-w-sm"
          >
            <div className="bg-mystery-800 border border-gold-400 rounded-2xl p-6 shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <SafeIcon icon={FiStar} className="text-gold-400 text-xl" />
                  <h3 className="font-serif font-semibold text-gold-400">
                    {promptData.title}
                  </h3>
                </div>
                <button
                  onClick={handleDismiss}
                  className="p-1 text-mystery-400 hover:text-mystery-200 transition-colors"
                  aria-label="Dismiss feedback prompt"
                >
                  <SafeIcon icon={FiX} className="text-lg" />
                </button>
              </div>

              {/* Message */}
              <p className="text-mystery-200 text-sm mb-4">
                {promptData.message}
              </p>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={handleDismiss}
                  className="flex-1 px-3 py-2 bg-mystery-700 text-mystery-300 rounded-lg hover:bg-mystery-600 transition-colors text-sm font-medium"
                >
                  Not Now
                </button>
                <button
                  onClick={handleOpenFeedback}
                  className="flex-1 px-3 py-2 gold-gradient text-mystery-900 rounded-lg hover:opacity-90 transition-opacity font-semibold text-sm flex items-center justify-center gap-1"
                >
                  <SafeIcon icon={FiMessageSquare} className="text-sm" />
                  {promptData.cta}
                </button>
              </div>

              {/* Small note */}
              <p className="text-xs text-mystery-400 mt-2 text-center">
                Takes less than 2 minutes
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <FeedbackModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
      />
    </>
  );
}