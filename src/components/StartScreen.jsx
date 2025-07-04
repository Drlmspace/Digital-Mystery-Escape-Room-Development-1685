import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGame } from '../contexts/GameContext';
import { useAudio } from '../contexts/AudioContext';
import SavedGameCard from './SavedGameCard';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPlay, FiUsers, FiSettings, FiInfo, FiVolumeX, FiVolume2, FiDatabase, FiTrophy, FiRefreshCw, FiTrash2 } = FiIcons;

export default function StartScreen() {
  const navigate = useNavigate();
  const { startGameWithDatabase, loadSavedGame, deleteSavedGame } = useGame();
  const { isMuted, dispatch: audioDispatch } = useAudio();
  const [teamName, setTeamName] = useState('');
  const [playerNames, setPlayerNames] = useState(['']);
  const [difficulty, setDifficulty] = useState('medium');
  const [showRules, setShowRules] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [savedGame, setSavedGame] = useState(null);
  const [showNewGameForm, setShowNewGameForm] = useState(false);

  // Check for saved game on component mount
  useEffect(() => {
    checkForSavedGame();
  }, []);

  const checkForSavedGame = () => {
    try {
      const savedData = localStorage.getItem('escaperoomSave');
      if (savedData) {
        const parsedSave = JSON.parse(savedData);
        // Only show if save is less than 30 days old and has meaningful progress
        if (
          Date.now() - parsedSave.lastSaved < 30 * 24 * 60 * 60 * 1000 &&
          (parsedSave.currentStage > 0 || Object.keys(parsedSave.puzzleStates || {}).length > 0)
        ) {
          setSavedGame(parsedSave);
        } else {
          // Clean up old saves
          localStorage.removeItem('escaperoomSave');
        }
      }
    } catch (error) {
      console.error('Error checking for saved game:', error);
      localStorage.removeItem('escaperoomSave');
    }
  };

  const addPlayer = () => {
    if (playerNames.length < 10) {
      setPlayerNames([...playerNames, '']);
    }
  };

  const removePlayer = (index) => {
    if (playerNames.length > 1) {
      setPlayerNames(playerNames.filter((_, i) => i !== index));
    }
  };

  const updatePlayerName = (index, name) => {
    const newNames = [...playerNames];
    newNames[index] = name;
    setPlayerNames(newNames);
  };

  const startNewGame = async () => {
    if (teamName.trim() && playerNames.every(name => name.trim())) {
      setIsStarting(true);
      try {
        const teamInfo = {
          teamName: teamName.trim(),
          playerNames: playerNames.map(name => name.trim()),
          difficulty
        };

        // Try to create team in database
        await startGameWithDatabase(teamInfo);
        navigate('/game');
      } catch (error) {
        console.error('Failed to start game:', error);
        // Still navigate to game even if database fails
        navigate('/game');
      } finally {
        setIsStarting(false);
      }
    }
  };

  const continueGame = async () => {
    if (savedGame) {
      try {
        await loadSavedGame(savedGame);
        navigate('/game');
      } catch (error) {
        console.error('Failed to load saved game:', error);
        alert('Failed to load saved game. Please try starting a new game.');
      }
    }
  };

  const handleDeleteSave = () => {
    if (confirm('Are you sure you want to delete your saved game? This action cannot be undone.')) {
      deleteSavedGame();
      setSavedGame(null);
      setShowNewGameForm(true);
    }
  };

  const toggleMute = () => {
    audioDispatch({ type: 'TOGGLE_MUTE' });
  };

  const goToAdmin = () => {
    navigate('/admin');
  };

  const goToLeaderboard = () => {
    navigate('/leaderboard');
  };

  // If there's a saved game and we're not showing the new game form, show continue options
  const showContinueOptions = savedGame && !showNewGameForm;

  return (
    <div className="min-h-screen mystery-gradient flex items-center justify-center p-4">
      <div className="max-w-5xl w-full">
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
          <p className="text-xl text-mystery-200 max-w-2xl mx-auto">
            A 60-minute interactive investigation experience. Can you solve the mysterious disappearance of Dr. Eleanor Blackwood?
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Side - Game Options */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Continue Game Card */}
            {showContinueOptions && (
              <SavedGameCard
                savedGame={savedGame}
                onContinue={continueGame}
                onDelete={handleDeleteSave}
                onStartNew={() => setShowNewGameForm(true)}
              />
            )}

            {/* New Game Setup */}
            {(!savedGame || showNewGameForm) && (
              <div className="glass-effect rounded-2xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-serif font-semibold text-gold-400 flex items-center gap-3">
                    <SafeIcon icon={FiUsers} className="text-3xl" />
                    {showNewGameForm ? 'New Investigation' : 'Team Setup'}
                  </h2>
                  {showNewGameForm && savedGame && (
                    <button
                      onClick={() => setShowNewGameForm(false)}
                      className="text-mystery-400 hover:text-mystery-200 transition-colors"
                    >
                      <SafeIcon icon={FiRefreshCw} className="text-lg" />
                    </button>
                  )}
                </div>

                {/* Team Name */}
                <div className="mb-6">
                  <label className="block text-mystery-200 text-sm font-medium mb-2">
                    Team Name
                  </label>
                  <input
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    className="w-full px-4 py-3 bg-mystery-800 text-white rounded-lg border border-mystery-600 focus:border-gold-400 focus:outline-none accessibility-focus"
                    placeholder="Enter your team name"
                    maxLength={50}
                    disabled={isStarting}
                  />
                </div>

                {/* Player Names */}
                <div className="mb-6">
                  <label className="block text-mystery-200 text-sm font-medium mb-2">
                    Player Names ({playerNames.length}/10)
                  </label>
                  <div className="space-y-2">
                    {playerNames.map((name, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => updatePlayerName(index, e.target.value)}
                          className="flex-1 px-4 py-2 bg-mystery-800 text-white rounded-lg border border-mystery-600 focus:border-gold-400 focus:outline-none accessibility-focus"
                          placeholder={`Player ${index + 1} name`}
                          maxLength={30}
                          disabled={isStarting}
                        />
                        {playerNames.length > 1 && (
                          <button
                            onClick={() => removePlayer(index)}
                            className="px-3 py-2 bg-danger-600 text-white rounded-lg hover:bg-danger-700 transition-colors accessibility-focus"
                            aria-label={`Remove player ${index + 1}`}
                            disabled={isStarting}
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  {playerNames.length < 10 && (
                    <button
                      onClick={addPlayer}
                      className="mt-2 px-4 py-2 bg-mystery-700 text-mystery-200 rounded-lg hover:bg-mystery-600 transition-colors accessibility-focus"
                      disabled={isStarting}
                    >
                      Add Player
                    </button>
                  )}
                </div>

                {/* Difficulty */}
                <div className="mb-6">
                  <label className="block text-mystery-200 text-sm font-medium mb-2">
                    Difficulty Level
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full px-4 py-3 bg-mystery-800 text-white rounded-lg border border-mystery-600 focus:border-gold-400 focus:outline-none accessibility-focus"
                    disabled={isStarting}
                  >
                    <option value="easy">Easy - More time, 5 hints, guidance</option>
                    <option value="medium">Medium - Standard time, 3 hints</option>
                    <option value="hard">Hard - Less time, 1 hint, expert mode</option>
                  </select>
                </div>

                {/* Start Button */}
                <button
                  onClick={startNewGame}
                  disabled={!teamName.trim() || !playerNames.every(name => name.trim()) || isStarting}
                  className="w-full py-4 gold-gradient text-mystery-900 font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed accessibility-focus flex items-center justify-center gap-3"
                >
                  {isStarting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-mystery-900"></div>
                      Creating Team...
                    </>
                  ) : (
                    <>
                      <SafeIcon icon={FiPlay} className="text-xl" />
                      Start New Investigation
                    </>
                  )}
                </button>
              </div>
            )}
          </motion.div>

          {/* Right Side - Game Info & Controls */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-6"
          >
            {/* Game Overview */}
            <div className="glass-effect rounded-2xl p-8">
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
            </div>

            {/* Controls */}
            <div className="glass-effect rounded-2xl p-8">
              <h2 className="text-2xl font-serif font-semibold text-gold-400 mb-4 flex items-center gap-3">
                <SafeIcon icon={FiSettings} className="text-3xl" />
                Controls
              </h2>
              <div className="space-y-4">
                <button
                  onClick={toggleMute}
                  className="flex items-center gap-3 px-4 py-2 bg-mystery-700 text-mystery-200 rounded-lg hover:bg-mystery-600 transition-colors accessibility-focus"
                >
                  <SafeIcon icon={isMuted ? FiVolumeX : FiVolume2} className="text-xl" />
                  {isMuted ? 'Unmute Audio' : 'Mute Audio'}
                </button>
                <button
                  onClick={() => setShowRules(!showRules)}
                  className="flex items-center gap-3 px-4 py-2 bg-mystery-700 text-mystery-200 rounded-lg hover:bg-mystery-600 transition-colors accessibility-focus"
                >
                  <SafeIcon icon={FiInfo} className="text-xl" />
                  {showRules ? 'Hide Rules' : 'Show Rules'}
                </button>
                <button
                  onClick={goToLeaderboard}
                  className="flex items-center gap-3 px-4 py-2 bg-gold-500 text-mystery-900 rounded-lg hover:bg-gold-600 transition-colors accessibility-focus font-semibold"
                >
                  <SafeIcon icon={FiTrophy} className="text-xl" />
                  View Leaderboard
                </button>
                <button
                  onClick={goToAdmin}
                  className="flex items-center gap-3 px-4 py-2 bg-mystery-700 text-mystery-200 rounded-lg hover:bg-mystery-600 transition-colors accessibility-focus"
                >
                  <SafeIcon icon={FiDatabase} className="text-xl" />
                  Admin Dashboard
                </button>
              </div>
            </div>

            {/* Save Game Notice */}
            {savedGame && (
              <div className="glass-effect rounded-2xl p-6 border-2 border-green-600">
                <div className="text-center">
                  <div className="text-3xl mb-2">💾</div>
                  <h3 className="text-lg font-semibold text-green-400 mb-2">
                    Saved Game Detected
                  </h3>
                  <p className="text-mystery-200 text-sm">
                    You can continue your investigation or start a completely new game.
                  </p>
                </div>
              </div>
            )}

            {/* Rules */}
            {showRules && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="glass-effect rounded-2xl p-8"
              >
                <h3 className="text-xl font-serif font-semibold text-gold-400 mb-4">
                  Game Rules
                </h3>
                <ul className="space-y-2 text-mystery-200 text-sm">
                  <li>• Complete all puzzles in a stage to advance</li>
                  <li>• Use hints wisely - they're limited</li>
                  <li>• After 20 incorrect attempts, answers are revealed</li>
                  <li>• You can revisit completed stages</li>
                  <li>• <strong className="text-gold-400">Progress auto-saves</strong> - exit anytime</li>
                  <li>• Work together as a team</li>
                  <li>• Admin can monitor progress in real-time</li>
                  <li>• Compete on the global leaderboard</li>
                </ul>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-12 text-mystery-400 text-sm"
        >
          <p>Best experienced with headphones • Suitable for ages 12+ • Auto-save enabled</p>
        </motion.div>
      </div>
    </div>
  );
}