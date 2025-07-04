import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiMessageSquare, FiX, FiExternalLink, FiStar, FiThumbsUp, FiThumbsDown } = FiIcons;

export default function FeedbackModal({ isOpen, onClose }) {
  const [feedbackType, setFeedbackType] = useState('general');
  const [showThankYou, setShowThankYou] = useState(false);

  const FEEDBACK_FORM_URL = 'https://formdesigner.pro/form/view/230279';

  const feedbackTypes = [
    {
      id: 'general',
      title: 'General Feedback',
      description: 'Share your overall experience',
      icon: FiMessageSquare,
      color: 'text-blue-400'
    },
    {
      id: 'bug',
      title: 'Report a Bug',
      description: 'Found something that isn\'t working?',
      icon: FiThumbsDown,
      color: 'text-red-400'
    },
    {
      id: 'suggestion',
      title: 'Feature Request',
      description: 'Suggest improvements or new features',
      icon: FiThumbsUp,
      color: 'text-green-400'
    },
    {
      id: 'rating',
      title: 'Rate Your Experience',
      description: 'How was your escape room experience?',
      icon: FiStar,
      color: 'text-gold-400'
    }
  ];

  const handleFeedbackSubmit = () => {
    // Open the feedback form in a new tab with context
    const formUrl = new URL(FEEDBACK_FORM_URL);
    
    // Add context parameters if the form supports them
    const urlParams = new URLSearchParams({
      feedback_type: feedbackType,
      game: 'The Vanishing Curator',
      timestamp: new Date().toISOString(),
      source: 'game_app'
    });

    // Open form in new tab
    window.open(`${formUrl}?${urlParams}`, '_blank', 'noopener,noreferrer');
    
    // Show thank you message
    setShowThankYou(true);
    
    // Auto close after showing thank you
    setTimeout(() => {
      setShowThankYou(false);
      onClose();
    }, 3000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
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
          className="bg-mystery-800 border border-mystery-600 rounded-2xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <SafeIcon icon={FiMessageSquare} className="text-2xl text-gold-400" />
              <h2 className="text-2xl font-serif font-bold text-gold-400">
                Share Your Feedback
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-mystery-400 hover:text-mystery-200 transition-colors"
              aria-label="Close feedback modal"
            >
              <SafeIcon icon={FiX} className="text-xl" />
            </button>
          </div>

          {showThankYou ? (
            // Thank You Message
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-8"
            >
              <div className="text-6xl mb-4">🙏</div>
              <h3 className="text-xl font-semibold text-gold-400 mb-2">
                Thank You!
              </h3>
              <p className="text-mystery-200">
                Your feedback helps us improve The Vanishing Curator experience.
                The feedback form has opened in a new tab.
              </p>
            </motion.div>
          ) : (
            <>
              {/* Description */}
              <div className="mb-6">
                <p className="text-mystery-200 mb-4">
                  We'd love to hear about your experience with The Vanishing Curator! 
                  Your feedback helps us create better escape room experiences.
                </p>
                <div className="p-4 bg-gold-500/20 border border-gold-400 rounded-lg">
                  <p className="text-gold-400 text-sm">
                    <SafeIcon icon={FiExternalLink} className="inline mr-2" />
                    This will open our secure feedback form in a new tab
                  </p>
                </div>
              </div>

              {/* Feedback Type Selection */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-mystery-200 mb-4">
                  What type of feedback would you like to share?
                </h3>
                <div className="grid gap-3">
                  {feedbackTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setFeedbackType(type.id)}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        feedbackType === type.id
                          ? 'border-gold-400 bg-gold-400/10'
                          : 'border-mystery-600 bg-mystery-700 hover:border-mystery-500'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <SafeIcon 
                          icon={type.icon} 
                          className={`text-xl ${feedbackType === type.id ? 'text-gold-400' : type.color}`} 
                        />
                        <div>
                          <h4 className={`font-semibold ${
                            feedbackType === type.id ? 'text-gold-400' : 'text-mystery-200'
                          }`}>
                            {type.title}
                          </h4>
                          <p className="text-sm text-mystery-400">
                            {type.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Info */}
              <div className="mb-6 p-4 bg-mystery-700 rounded-lg">
                <h4 className="font-semibold text-mystery-200 mb-2">
                  Your feedback will include:
                </h4>
                <ul className="text-sm text-mystery-400 space-y-1">
                  <li>• Feedback type: {feedbackTypes.find(t => t.id === feedbackType)?.title}</li>
                  <li>• Game: The Vanishing Curator</li>
                  <li>• Timestamp: {new Date().toLocaleString()}</li>
                  <li>• Anonymous unless you choose to share contact info</li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-3 bg-mystery-700 text-mystery-200 rounded-lg hover:bg-mystery-600 transition-colors font-medium"
                >
                  Maybe Later
                </button>
                <button
                  onClick={handleFeedbackSubmit}
                  className="flex-1 px-4 py-3 gold-gradient text-mystery-900 rounded-lg hover:opacity-90 transition-opacity font-semibold flex items-center justify-center gap-2"
                >
                  <SafeIcon icon={FiExternalLink} className="text-lg" />
                  Open Feedback Form
                </button>
              </div>

              {/* Privacy Note */}
              <div className="mt-4 text-xs text-mystery-400 text-center">
                <p>
                  Your privacy is important to us. Feedback is collected securely and used only to improve our games.
                </p>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}