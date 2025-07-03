import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function TextAnalysisPuzzle({ 
  puzzle, 
  onComplete, 
  onIncorrectAttempt, 
  isCompleted, 
  showAnswer 
}) {
  const [userInput, setUserInput] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);

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

  const toggleSelection = (item) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter(i => i !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  if (isCompleted) {
    return (
      <div className="text-center p-6">
        <div className="text-6xl mb-4">📝</div>
        <h4 className="text-xl font-semibold text-gold-400 mb-2">Analysis Complete!</h4>
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

      {/* Email Data */}
      {puzzle.data?.emails && (
        <div className="space-y-4">
          {puzzle.data.emails.map((email, index) => (
            <div key={index} className="bg-mystery-800 rounded-lg p-4">
              <div className="border-b border-mystery-600 pb-3 mb-3">
                <div className="flex justify-between text-sm">
                  <span className="text-mystery-300">From: {email.from}</span>
                  <span className="text-mystery-300">To: {email.to}</span>
                </div>
                <div className="text-gold-400 font-semibold mt-1">{email.subject}</div>
              </div>
              
              {email.headers && (
                <div className="bg-mystery-700 rounded p-3">
                  <h6 className="text-sm font-semibold text-gold-400 mb-2">Headers:</h6>
                  {Object.entries(email.headers).map(([key, value]) => (
                    <div key={key} className="text-xs text-mystery-300 font-mono">
                      {key}: {value}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Photo Metadata */}
      {puzzle.data?.photos && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {puzzle.data.photos.map((photo, index) => (
            <div key={index} className="bg-mystery-800 rounded-lg p-4">
              <h6 className="font-semibold text-gold-400 mb-2">{photo.filename}</h6>
              <div className="space-y-1 text-sm text-mystery-300">
                <div>Location: {photo.metadata.location}</div>
                <div>Camera: {photo.metadata.camera}</div>
                <div>Timestamp: {photo.metadata.timestamp}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Network Logs */}
      {puzzle.data?.logs && (
        <div className="space-y-2">
          {puzzle.data.logs.map((log, index) => (
            <div 
              key={index} 
              className={`
                p-3 rounded-lg cursor-pointer transition-all
                ${log.user === 'Unknown' 
                  ? 'bg-danger-600/20 border border-danger-600' 
                  : 'bg-mystery-800 border border-mystery-600'}
              `}
              onClick={() => toggleSelection(log.time)}
            >
              <div className="flex justify-between items-center">
                <span className="text-mystery-200">{log.time}</span>
                <span className="text-gold-400">{log.action}</span>
              </div>
              <div className="text-sm text-mystery-300">
                IP: {log.ip} | User: {log.user}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Badge Logs */}
      {puzzle.data?.badgeLog && (
        <div className="space-y-2">
          {puzzle.data.badgeLog.map((entry, index) => (
            <div key={index} className="bg-mystery-800 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-semibold text-gold-400">{entry.badge}</div>
                  <div className="text-sm text-mystery-300">{entry.location}</div>
                </div>
                <div className="text-right">
                  <div className="text-mystery-200">{entry.time}</div>
                  <div className={`
                    text-xs px-2 py-1 rounded-full mt-1
                    ${entry.status.includes('not scheduled') 
                      ? 'bg-danger-600 text-white' 
                      : 'bg-mystery-600 text-mystery-200'}
                  `}>
                    {entry.status}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* UV Messages */}
      {puzzle.data?.uvMessages && (
        <div className="grid grid-cols-2 gap-4">
          {puzzle.data.uvMessages.map((message, index) => (
            <div
              key={index}
              className="bg-mystery-800 rounded-lg p-4 text-center cursor-pointer hover:bg-mystery-700 transition-colors"
              onClick={() => toggleSelection(message.text)}
            >
              <div className="text-gold-400 font-semibold mb-2">{message.location}</div>
              <div className="text-2xl font-bold text-purple-400">{message.text}</div>
            </div>
          ))}
        </div>
      )}

      {/* Evidence Connections */}
      {puzzle.data?.evidence && (
        <div className="space-y-3">
          {puzzle.data.evidence.map((item, index) => (
            <div key={index} className="bg-mystery-800 rounded-lg p-4">
              <div className="font-semibold text-gold-400 mb-2">{item.type}</div>
              <div className="text-sm text-mystery-300">
                Connects: {item.connects.join(', ')}
              </div>
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