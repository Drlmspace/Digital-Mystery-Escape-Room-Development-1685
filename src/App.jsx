import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { GameProvider } from './contexts/GameContext';
import { AudioProvider } from './contexts/AudioContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LandingPage from './components/LandingPage';
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import Dashboard from './components/Dashboard';
import GameScreen from './components/GameScreen';
import AdminDashboard from './components/AdminDashboard';
import Leaderboard from './components/Leaderboard';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <AudioProvider>
        <GameProvider>
          <Router>
            <div className="min-h-screen bg-mystery-900">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/game" 
                  element={
                    <ProtectedRoute>
                      <GameScreen />
                    </ProtectedRoute>
                  } 
                />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
              </Routes>
            </div>
          </Router>
        </GameProvider>
      </AudioProvider>
    </AuthProvider>
  );
}

export default App;