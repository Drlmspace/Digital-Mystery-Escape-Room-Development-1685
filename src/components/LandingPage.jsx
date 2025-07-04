import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import SafeIcon from '../common/SafeIcon';
import PolicyFooter from './common/PolicyFooter';
import * as FiIcons from 'react-icons/fi';

const { FiPlay, FiUsers, FiInfo, FiTrophy, FiDatabase, FiUserPlus, FiLogIn } = FiIcons;

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen mystery-gradient flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-6xl font-serif font-bold text-gold-400 mb-4 text-glow">
            The Vanishing Curator
          </h1>
          <p className="text-xl text-mystery-200 max-w-2xl mx-auto mb-8">
            A 60-minute interactive investigation experience. Can you solve the mysterious disappearance of Dr. Eleanor Blackwood?
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              onClick={() => navigate('/login')}
              className="px-8 py-4 gold-gradient text-mystery-900 font-semibold rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-3 text-lg"
            >
              <SafeIcon icon={FiLogIn} className="text-xl" />
              Sign In to Play
            </motion.button>
            
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              onClick={() => navigate('/register')}
              className="px-8 py-4 bg-mystery-700 text-mystery-200 font-semibold rounded-lg hover:bg-mystery-600 transition-colors flex items-center justify-center gap-3 text-lg"
            >
              <SafeIcon icon={FiUserPlus} className="text-xl" />
              Create Account
            </motion.button>
          </div>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Game Features */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="glass-effect rounded-2xl p-8"
          >
            <h2 className="text-2xl font-serif font-semibold text-gold-400 mb-4 flex items-center gap-3">
              <SafeIcon icon={FiInfo} className="text-3xl" />
              Game Features
            </h2>
            <ul className="space-y-2 text-mystery-200">
              <li>• 6 immersive investigation stages</li>
              <li>• Multiple puzzle types and challenges</li>
              <li>• Team-based collaborative gameplay</li>
              <li>• <strong className="text-gold-400">Auto-save progress</strong> - continue anytime</li>
              <li>• Cloud backup with Supabase</li>
              <li>• Real-time team monitoring</li>
              <li>• Global leaderboard rankings</li>
              <li>• Fully accessible design</li>
            </ul>
          </motion.div>

          {/* Quick Access */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="glass-effect rounded-2xl p-8"
          >
            <h2 className="text-2xl font-serif font-semibold text-gold-400 mb-4 flex items-center gap-3">
              <SafeIcon icon={FiUsers} className="text-3xl" />
              Quick Access
            </h2>
            <div className="space-y-4">
              <button
                onClick={() => navigate('/leaderboard')}
                className="w-full flex items-center gap-3 px-4 py-2 bg-gold-500 text-mystery-900 rounded-lg hover:bg-gold-600 transition-colors font-semibold"
              >
                <SafeIcon icon={FiTrophy} className="text-xl" />
                View Leaderboard
              </button>
              
              <button
                onClick={() => navigate('/admin')}
                className="w-full flex items-center gap-3 px-4 py-2 bg-mystery-700 text-mystery-200 rounded-lg hover:bg-mystery-600 transition-colors"
              >
                <SafeIcon icon={FiDatabase} className="text-xl" />
                Admin Dashboard
              </button>
            </div>

            <div className="mt-6 p-4 bg-mystery-800 rounded-lg">
              <h3 className="text-sm font-semibold text-gold-400 mb-2">Getting Started</h3>
              <p className="text-xs text-mystery-300">
                Create an account or sign in to start your investigation. Your progress is automatically saved, 
                so you can continue anytime. Work with your team to solve puzzles and uncover the mystery!
              </p>
            </div>
          </motion.div>
        </div>

        {/* Story Preview */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="glass-effect rounded-2xl p-8 mb-8"
        >
          <h2 className="text-2xl font-serif font-semibold text-gold-400 mb-4 text-center">
            The Mystery Awaits
          </h2>
          <div className="prose prose-lg max-w-none text-mystery-100 narrative-text">
            <p className="mb-4">
              Dr. Eleanor Blackwood, the renowned curator of the Metropolitan Museum of Digital Arts, 
              has vanished without a trace. Her office remains locked, her research incomplete, 
              and strange inconsistencies have been discovered in the museum's latest acquisitions.
            </p>
            <p className="text-center font-semibold text-gold-400">
              Can you uncover the truth behind her disappearance and expose the conspiracy within?
            </p>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <PolicyFooter />
        </motion.div>
      </div>
    </div>
  );
}