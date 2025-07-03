import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { gameData } from '../data/gameData';
import { dbHelpers } from '../lib/supabase';

const GameContext = createContext();

const initialState = {
  currentStage: 0,
  completedStages: [],
  teamName: '',
  playerNames: [],
  difficulty: 'medium',
  startTime: null,
  gameState: 'setup', // setup, playing, paused, completed
  puzzleStates: {},
  hintsUsed: 0,
  incorrectAttempts: {},
  gameStats: {
    totalTime: 0,
    hintsUsed: 0,
    puzzlesSolved: 0,
    totalPuzzles: 0
  },
  teamId: null,
  isOnline: false
};

function gameReducer(state, action) {
  switch (action.type) {
    case 'SET_TEAM_INFO':
      return {
        ...state,
        teamName: action.payload.teamName,
        playerNames: action.payload.playerNames,
        difficulty: action.payload.difficulty
      };

    case 'SET_TEAM_ID':
      return {
        ...state,
        teamId: action.payload.teamId,
        isOnline: true
      };

    case 'START_GAME':
      return {
        ...state,
        gameState: 'playing',
        startTime: Date.now()
      };

    case 'COMPLETE_PUZZLE':
      const newPuzzleStates = {
        ...state.puzzleStates,
        [`${state.currentStage}-${action.payload.puzzleId}`]: {
          completed: true,
          solution: action.payload.solution,
          completedAt: Date.now()
        }
      };
      return {
        ...state,
        puzzleStates: newPuzzleStates,
        gameStats: {
          ...state.gameStats,
          puzzlesSolved: state.gameStats.puzzlesSolved + 1
        }
      };

    case 'ADVANCE_STAGE':
      const newCompletedStages = [...state.completedStages, state.currentStage];
      return {
        ...state,
        currentStage: state.currentStage + 1,
        completedStages: newCompletedStages
      };

    case 'GO_TO_STAGE':
      return {
        ...state,
        currentStage: action.payload.stageIndex
      };

    case 'USE_HINT':
      return {
        ...state,
        hintsUsed: state.hintsUsed + 1,
        gameStats: {
          ...state.gameStats,
          hintsUsed: state.gameStats.hintsUsed + 1
        }
      };

    case 'RECORD_INCORRECT_ATTEMPT':
      const stageKey = `${state.currentStage}-${action.payload.puzzleId}`;
      const currentAttempts = state.incorrectAttempts[stageKey] || 0;
      return {
        ...state,
        incorrectAttempts: {
          ...state.incorrectAttempts,
          [stageKey]: currentAttempts + 1
        }
      };

    case 'PAUSE_GAME':
      return {
        ...state,
        gameState: 'paused'
      };

    case 'RESUME_GAME':
      return {
        ...state,
        gameState: 'playing'
      };

    case 'COMPLETE_GAME':
      return {
        ...state,
        gameState: 'completed',
        gameStats: {
          ...state.gameStats,
          totalTime: Date.now() - state.startTime
        }
      };

    case 'LOAD_SAVED_GAME':
      return {
        ...state,
        ...action.payload
      };

    case 'SYNC_FROM_DATABASE':
      return {
        ...state,
        ...action.payload
      };

    default:
      return state;
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Auto-save game state to database
  useEffect(() => {
    const saveToDatabase = async () => {
      if (state.gameState === 'playing' && state.teamId) {
        try {
          // Update team status
          await dbHelpers.updateTeam(state.teamId, {
            current_stage: state.currentStage,
            game_state: state.gameState,
            hints_used: state.hintsUsed,
            total_time_seconds: state.startTime ? Math.floor((Date.now() - state.startTime) / 1000) : 0
          });

          // Update game session
          await dbHelpers.updateGameSession(state.teamId, {
            stage_progress: state.completedStages,
            puzzle_states: state.puzzleStates,
            incorrect_attempts: state.incorrectAttempts,
            game_stats: state.gameStats
          });
        } catch (error) {
          console.error('Failed to save to database:', error);
        }
      }
    };

    // Save to database every 10 seconds
    const interval = setInterval(saveToDatabase, 10000);
    return () => clearInterval(interval);
  }, [state]);

  // Local storage fallback
  useEffect(() => {
    if (state.gameState === 'playing') {
      const saveData = {
        ...state,
        lastSaved: Date.now()
      };
      localStorage.setItem('escaperoomSave', JSON.stringify(saveData));
    }
  }, [state]);

  // Load saved game on mount
  useEffect(() => {
    const loadSavedGame = async () => {
      // Try to load from localStorage first
      const savedGame = localStorage.getItem('escaperoomSave');
      if (savedGame) {
        try {
          const parsedSave = JSON.parse(savedGame);
          // Only load if save is less than 24 hours old
          if (Date.now() - parsedSave.lastSaved < 24 * 60 * 60 * 1000) {
            dispatch({ type: 'LOAD_SAVED_GAME', payload: parsedSave });
          }
        } catch (error) {
          console.error('Failed to load saved game:', error);
        }
      }
    };

    loadSavedGame();
  }, []);

  // Create team in database when starting game
  const startGameWithDatabase = async (teamInfo) => {
    try {
      const teamData = {
        team_name: teamInfo.teamName,
        player_names: teamInfo.playerNames,
        difficulty: teamInfo.difficulty,
        game_state: 'playing',
        start_time: new Date().toISOString(),
        current_stage: 0,
        hints_used: 0
      };

      const team = await dbHelpers.createTeam(teamData);
      
      // Create initial game session
      await dbHelpers.createGameSession({
        team_id: team.id,
        session_data: {},
        stage_progress: {},
        puzzle_states: {},
        incorrect_attempts: {}
      });

      dispatch({ type: 'SET_TEAM_ID', payload: { teamId: team.id } });
      dispatch({ type: 'SET_TEAM_INFO', payload: teamInfo });
      dispatch({ type: 'START_GAME' });

      return team.id;
    } catch (error) {
      console.error('Failed to create team in database:', error);
      // Fallback to local storage only
      dispatch({ type: 'SET_TEAM_INFO', payload: teamInfo });
      dispatch({ type: 'START_GAME' });
      return null;
    }
  };

  // Record puzzle attempt in database
  const recordPuzzleAttemptInDB = async (puzzleId, answer, isCorrect) => {
    if (!state.teamId) return;

    try {
      await dbHelpers.recordPuzzleAttempt({
        team_id: state.teamId,
        stage_index: state.currentStage,
        puzzle_id: puzzleId,
        attempt_answer: answer,
        is_correct: isCorrect,
        time_spent_seconds: state.startTime ? Math.floor((Date.now() - state.startTime) / 1000) : 0
      });
    } catch (error) {
      console.error('Failed to record puzzle attempt:', error);
    }
  };

  const value = {
    ...state,
    dispatch,
    gameData,
    currentStageData: gameData.stages[state.currentStage],
    startGameWithDatabase,
    recordPuzzleAttemptInDB,
    canAdvance: () => {
      const currentStageData = gameData.stages[state.currentStage];
      if (!currentStageData) return false;
      return currentStageData.puzzles.every(puzzle => {
        const puzzleKey = `${state.currentStage}-${puzzle.id}`;
        return state.puzzleStates[puzzleKey]?.completed || false;
      });
    },
    getIncorrectAttempts: (puzzleId) => {
      const key = `${state.currentStage}-${puzzleId}`;
      return state.incorrectAttempts[key] || 0;
    },
    isPuzzleCompleted: (puzzleId) => {
      const key = `${state.currentStage}-${puzzleId}`;
      return state.puzzleStates[key]?.completed || false;
    },
    getAvailableHints: () => {
      const difficultyHints = {
        easy: 5,
        medium: 3,
        hard: 1
      };
      return difficultyHints[state.difficulty] - state.hintsUsed;
    }
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}