import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPlay, FiPause, FiVolume2 } = FiIcons;

export default function AudioAnalysisPuzzle({ 
  puzzle, 
  onComplete, 
  onIncorrectAttempt, 
  isCompleted, 
  showAnswer 
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [showSpectrogram, setShowSpectrogram] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isCompleted) return;

    const answer = userInput.trim().toUpperCase();
    if (answer === puzzle.solution) {
      onComplete(answer);
    } else {
      onIncorrectAttempt();
      setUserInput('');
    }
  };

  const toggleAudio = () => {
    setIsPlaying(!isPlaying);
    // Audio implementation would go here
  };

  if (isCompleted) {
    return (
      <div className="text-center p-6">
        <div className="text-6xl mb-4">🎵</div>
        <h4 className="text-xl font-semibold text-gold-400 mb-2">Audio Analyzed!</h4>
        <p className="text-mystery-200">Solution: {puzzle.solution}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h4 className="text-lg font-semibold text-gold-400 mb-2">
          {puzzle.question}
        </h4>
      </div>

      {/* Audio Player */}
      <div className="bg-mystery-800 rounded-lg p-6">
        <div className="flex items-center justify-center mb-4">
          <button
            onClick={toggleAudio}
            className="flex items-center gap-3 px-6 py-3 bg-gold-500 text-mystery-900 rounded-lg hover:bg-gold-600 transition-colors font-semibold accessibility-focus"
          >
            <SafeIcon icon={isPlaying ? FiPause : FiPlay} className="text-xl" />
            {isPlaying ? 'Pause' : 'Play'} Audio Message
          </button>
        </div>

        {/* Audio Visualization */}
        <div className="h-20 bg-mystery-700 rounded-lg flex items-center justify-center mb-4">
          <div className="flex items-center gap-1">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className={`
                  w-2 bg-gold-400 rounded-full transition-all duration-300
                  ${isPlaying ? 'animate-pulse' : ''}
                `}
                style={{ 
                  height: `${Math.random() * 40 + 10}px`,
                  animationDelay: `${i * 0.1}s`
                }}
              />
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setShowSpectrogram(!showSpectrogram)}
            className="flex items-center gap-2 px-4 py-2 bg-mystery-700 text-mystery-200 rounded-lg hover:bg-mystery-600 transition-colors accessibility-focus"
          >
            <SafeIcon icon={FiVolume2} className="text-lg" />
            {showSpectrogram ? 'Hide' : 'Show'} Spectrogram
          </button>
        </div>
      </div>

      {/* Spectrogram */}
      {showSpectrogram && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-mystery-800 rounded-lg p-4"
        >
          <h5 className="font-semibold text-gold-400 mb-3">Audio Spectrogram</h5>
          <div className="h-32 bg-mystery-700 rounded-lg flex items-center justify-center">
            <div className="grid grid-cols-10 gap-1 h-full w-full p-2">
              {[...Array(40)].map((_, i) => (
                <div
                  key={i}
                  className="bg-gold-400 rounded-sm opacity-60"
                  style={{ height: `${Math.random() * 100}%` }}
                />
              ))}
            </div>
          </div>
          <p className="text-sm text-mystery-300 mt-2">
            Look for patterns in the frequency data that might represent numbers or letters.
          </p>
        </motion.div>
      )}

      {/* Answer Input */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-mystery-200 text-sm font-medium mb-2">
            Hidden Numbers/Code:
          </label>
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="w-full px-4 py-3 bg-mystery-800 text-white rounded-lg border border-mystery-600 focus:border-gold-400 focus:outline-none accessibility-focus"
            placeholder="Enter the hidden code..."
            disabled={isCompleted}
          />
        </div>

        <button
          type="submit"
          disabled={!userInput.trim() || isCompleted}
          className="w-full py-3 gold-gradient text-mystery-900 font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed accessibility-focus"
        >
          Submit Code
        </button>
      </form>

      {/* Show Answer */}
      {showAnswer && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-danger-600/20 border border-danger-600 rounded-lg"
        >
          <h5 className="font-semibold text-danger-400 mb-2">Answer Revealed:</h5>
          <p className="text-mystery-200">{puzzle.solution}</p>
        </motion.div>
      )}
    </div>
  );
}