import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import FeedbackButton from './FeedbackButton';
import * as FiIcons from 'react-icons/fi';

const { FiMessageSquare, FiStar, FiHeart, FiUsers } = FiIcons;

export default function FeedbackSection({ className = '' }) {
  const feedbackStats = [
    { icon: FiStar, label: 'Average Rating', value: '4.8/5', color: 'text-gold-400' },
    { icon: FiUsers, label: 'Players Surveyed', value: '2,500+', color: 'text-blue-400' },
    { icon: FiHeart, label: 'Would Recommend', value: '94%', color: 'text-red-400' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass-effect rounded-2xl p-8 ${className}`}
    >
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-3 mb-4">
          <SafeIcon icon={FiMessageSquare} className="text-3xl text-gold-400" />
          <h2 className="text-2xl font-serif font-semibold text-gold-400">
            Share Your Experience
          </h2>
        </div>
        <p className="text-mystery-200">
          Help us improve The Vanishing Curator with your valuable feedback
        </p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {feedbackStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="text-center p-4 bg-mystery-800 rounded-lg"
          >
            <SafeIcon icon={stat.icon} className={`text-2xl ${stat.color} mx-auto mb-2`} />
            <div className="text-xl font-bold text-white">{stat.value}</div>
            <div className="text-sm text-mystery-400">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="text-center">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-mystery-200 mb-2">
            Your Opinion Matters
          </h3>
          <p className="text-mystery-300 text-sm">
            Whether you loved it, found bugs, or have ideas for improvement - we want to hear from you!
          </p>
        </div>

        <FeedbackButton 
          variant="inline" 
          size="large" 
          className="mx-auto"
        />
      </div>

      {/* Benefits */}
      <div className="mt-6 p-4 bg-mystery-700 rounded-lg">
        <h4 className="font-semibold text-mystery-200 mb-2 text-center">
          Why Your Feedback Helps
        </h4>
        <ul className="text-sm text-mystery-400 space-y-1">
          <li>• Improve puzzle difficulty and clarity</li>
          <li>• Fix bugs and technical issues</li>
          <li>• Add new features and content</li>
          <li>• Enhance the overall experience</li>
        </ul>
      </div>
    </motion.div>
  );
}