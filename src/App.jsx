import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { GameProvider } from './contexts/GameContext';
import { AudioProvider } from './contexts/AudioContext';
import StartScreen from './components/StartScreen';
import GameScreen from './components/GameScreen';
import AdminDashboard from './components/AdminDashboard';
import './App.css';

function App() {
  return (
    <AudioProvider>
      <GameProvider>
        <Router>
          <div className="min-h-screen bg-mystery-900">
            <Routes>
              <Route path="/" element={<StartScreen />} />
              <Route path="/game" element={<GameScreen />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </div>
        </Router>
      </GameProvider>
    </AudioProvider>
  );
}

export default App;