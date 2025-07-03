import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function PatternRecognitionPuzzle({ 
  puzzle, 
  onComplete, 
  onIncorrectAttempt, 
  isCompleted, 
  showAnswer 
}) {
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [userInput, setUserInput] = useState('');

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

  const handlePatternSelect = (item) => {
    if (isCompleted) return;
    
    if (selectedAnswers.includes(item)) {
      setSelectedAnswers(selectedAnswers.filter(a => a !== item));
    } else {
      setSelectedAnswers([...selectedAnswers, item]);
    }
  };

  if (isCompleted) {
    return (
      <div className="text-center p-6">
        <div className="text-6xl mb-4">✅</div>
        <h4 className="text-xl font-semibold text-gold-400 mb-2">Puzzle Solved!</h4>
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

      {/* Pattern Display */}
      {puzzle.data?.calendar && (
        <div className="grid grid-cols-7 gap-2 p-4 bg-mystery-800 rounded-lg">
          {Object.entries(puzzle.data.calendar).map(([date, info]) => (
            <div
              key={date}
              className={`
                p-2 rounded text-center text-sm cursor-pointer transition-colors
                ${info.circled ? 'bg-gold-500 text-mystery-900' : 
                  info.crossed ? 'bg-danger-500 text-white' : 
                  'bg-mystery-700 text-mystery-300'}
              `}
              onClick={() => handlePatternSelect(date)}
            >
              <div className="font-semibold">{new Date(date).getDate()}</div>
              <div className="text-xs">{info.event}</div>
            </div>
          ))}
        </div>
      )}

      {/* Motion Sensors */}
      {puzzle.data?.motionSensors && (
        <div className="space-y-2">
          {puzzle.data.motionSensors.map((sensor, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-mystery-800 rounded-lg"
            >
              <span className="text-mystery-200">{sensor.location}</span>
              <span className="text-gold-400">{sensor.time}</span>
            </div>
          ))}
        </div>
      )}

      {/* Generic Pattern Data */}
      {puzzle.data?.documents && (
        <div className="grid grid-cols-2 gap-4">
          {puzzle.data.documents.map((doc) => (
            <div
              key={doc.id}
              className={`
                p-4 rounded-lg border-2 cursor-pointer transition-all
                ${selectedAnswers.includes(doc.id) 
                  ? 'border-gold-400 bg-gold-400/10' 
                  : 'border-mystery-600 bg-mystery-800 hover:border-mystery-500'}
              `}
              onClick={() => handlePatternSelect(doc.id)}
            >
              <h5 className="font-semibold text-gold-400 mb-2">Document {doc.id}</h5>
              <ul className="text-sm text-mystery-300 space-y-1">
                {doc.clues.map((clue, index) => (
                  <li key={index}>• {clue}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Answer Input */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-mystery-200 text-sm font-medium mb-2">
            Your Answer:
          </label>
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="w-full px-4 py-3 bg-mystery-800 text-white rounded-lg border border-mystery-600 focus:border-gold-400 focus:outline-none accessibility-focus"
            placeholder="Enter your solution..."
            disabled={isCompleted}
          />
        </div>

        <button
          type="submit"
          disabled={!userInput.trim() || isCompleted}
          className="w-full py-3 gold-gradient text-mystery-900 font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed accessibility-focus"
        >
          Submit Answer
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