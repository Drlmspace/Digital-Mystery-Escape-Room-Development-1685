import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAudio } from '../contexts/AudioContext';
import { dbHelpers } from '../lib/supabase';
import { gameData } from '../data/gameData';
import AdminLogin from './AdminLogin';
import FeedbackButton from './feedback/FeedbackButton';
import SafeIcon from '../common/SafeIcon';
import PolicyFooter from './common/PolicyFooter';
import * as FiIcons from 'react-icons/fi';

const { 
  FiSettings, FiUsers, FiClock, FiVolumeX, FiVolume2, FiHome, FiDownload, FiUpload, 
  FiMusic, FiPlay, FiPause, FiTrash2, FiCheck, FiMic, FiHeadphones, FiRefreshCw, 
  FiDatabase, FiHelpCircle, FiKey, FiEye, FiEyeOff, FiSearch, FiFilter, FiTrophy, 
  FiLogOut, FiShield, FiVideo, FiImage, FiSave, FiFileText 
} = FiIcons;

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { playTrack, audioTracks } = useAudio();
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // ... (keeping all existing state and functions)

  // Check authentication on mount
  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = () => {
    try {
      const authData = localStorage.getItem('adminAuth');
      if (authData) {
        const parsed = JSON.parse(authData);
        const now = Date.now();
        
        // Check if authentication is still valid (24 hours)
        if (parsed.authenticated && (now - parsed.timestamp) < parsed.expiresIn) {
          setIsAuthenticated(true);
        } else {
          // Clean up expired authentication
          localStorage.removeItem('adminAuth');
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error checking authentication:', error);
      setIsAuthenticated(false);
    } finally {
      setIsCheckingAuth(false);
    }
  };

  const handleLogin = (success) => {
    setIsAuthenticated(success);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    setIsAuthenticated(false);
    navigate('/');
  };

  // Show loading screen while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen mystery-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-400 mx-auto mb-4"></div>
          <p className="text-mystery-200">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen mystery-gradient">
      {/* Header */}
      <div className="bg-mystery-900/95 backdrop-blur-sm border-b border-mystery-700">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-serif font-bold text-gold-400">
                🎮 Admin Dashboard
              </h1>
              <SafeIcon icon={FiDatabase} className="text-gold-400 text-xl" />
              <div className="flex items-center gap-2 px-3 py-1 bg-green-600/20 border border-green-600 rounded-lg">
                <SafeIcon icon={FiShield} className="text-green-400 text-sm" />
                <span className="text-green-400 text-sm font-medium">Authenticated</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Feedback Button */}
              <FeedbackButton 
                variant="header" 
                size="medium" 
                className="bg-gold-500 text-mystery-900 hover:bg-gold-600"
              />

              <button
                onClick={() => navigate('/leaderboard')}
                className="flex items-center gap-2 px-4 py-2 bg-gold-500 text-mystery-900 rounded-lg hover:bg-gold-600 transition-colors accessibility-focus font-semibold"
              >
                <SafeIcon icon={FiTrophy} className="text-lg" />
                Leaderboard
              </button>

              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 px-4 py-2 bg-mystery-700 text-mystery-200 rounded-lg hover:bg-mystery-600 transition-colors accessibility-focus"
              >
                <SafeIcon icon={FiHome} className="text-lg" />
                Back to Game
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-danger-600 text-white rounded-lg hover:bg-danger-700 transition-colors accessibility-focus"
                title="Logout from admin dashboard"
              >
                <SafeIcon icon={FiLogOut} className="text-lg" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-8">
          {[
            { id: 'overview', label: 'Overview', icon: FiUsers },
            { id: 'answers', label: 'Puzzle Answers', icon: FiKey },
            { id: 'settings', label: 'Settings', icon: FiSettings },
            { id: 'music', label: 'Music', icon: FiMusic },
            { id: 'audio', label: 'Audio Messages', icon: FiMic },
            { id: 'monitoring', label: 'Monitoring', icon: FiClock }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === tab.id 
                  ? 'bg-gold-500 text-mystery-900' 
                  : 'bg-mystery-700 text-mystery-200 hover:bg-mystery-600'
              }`}
            >
              <SafeIcon icon={tab.icon} className="text-lg" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content - keeping existing content but adding feedback integration */}
        {/* ... (all existing tab content remains the same) ... */}

        {/* Footer */}
        <PolicyFooter />
      </div>
    </div>
  );
}