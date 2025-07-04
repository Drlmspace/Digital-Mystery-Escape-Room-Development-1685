import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import FeedbackModal from './FeedbackModal';
import * as FiIcons from 'react-icons/fi';

const { FiMessageSquare } = FiIcons;

export default function FeedbackButton({ 
  variant = 'floating', // floating, inline, header
  size = 'medium', // small, medium, large
  className = '',
  showText = true 
}) {
  const [showModal, setShowModal] = useState(false);

  const sizeClasses = {
    small: 'p-2 text-sm',
    medium: 'px-4 py-2',
    large: 'px-6 py-3 text-lg'
  };

  const variantClasses = {
    floating: 'fixed bottom-6 right-6 z-40 bg-gold-500 text-mystery-900 rounded-full shadow-lg hover:bg-gold-600 hover:scale-105',
    inline: 'bg-mystery-700 text-mystery-200 rounded-lg hover:bg-mystery-600',
    header: 'bg-mystery-700 text-mystery-200 rounded-lg hover:bg-mystery-600'
  };

  return (
    <>
      <motion.button
        onClick={() => setShowModal(true)}
        className={`
          ${variantClasses[variant]}
          ${sizeClasses[size]}
          ${className}
          transition-all duration-200 font-medium flex items-center gap-2 accessibility-focus
        `}
        whileHover={{ scale: variant === 'floating' ? 1.05 : 1.02 }}
        whileTap={{ scale: 0.95 }}
        title="Share feedback about your experience"
      >
        <SafeIcon icon={FiMessageSquare} className="text-lg" />
        {showText && (
          <span className={variant === 'floating' ? 'hidden sm:inline' : ''}>
            Feedback
          </span>
        )}
      </motion.button>

      <FeedbackModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
      />
    </>
  );
}