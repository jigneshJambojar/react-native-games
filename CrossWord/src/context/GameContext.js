import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GameContext = createContext();

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
};

export const GameProvider = ({ children }) => {
  const [gameState, setGameState] = useState({
    grid: [],
    gridSize: 0,
    placedWords: [],
    foundWords: new Set(),
    category: null,
    difficulty: null,
    isPlaying: false,
    isPaused: false,
    timer: 0,
    bestTimes: {}
  });

  const timerRef = useRef(null);

  // Load best times from storage
  useEffect(() => {
    loadBestTimes();
  }, []);

  // Timer effect
  useEffect(() => {
    if (gameState.isPlaying && !gameState.isPaused) {
      timerRef.current = setInterval(() => {
        setGameState(prev => ({ ...prev, timer: prev.timer + 1 }));
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameState.isPlaying, gameState.isPaused]);

  const loadBestTimes = async () => {
    try {
      const stored = await AsyncStorage.getItem('bestTimes');
      if (stored) {
        const bestTimes = JSON.parse(stored);
        setGameState(prev => ({ ...prev, bestTimes }));
      }
    } catch (error) {
      console.error('Error loading best times:', error);
    }
  };

  const saveBestTime = async (category, difficulty, time) => {
    try {
      const key = `${category}_${difficulty}`;
      const currentBest = gameState.bestTimes[key];
      
      if (!currentBest || time < currentBest) {
        const newBestTimes = { ...gameState.bestTimes, [key]: time };
        await AsyncStorage.setItem('bestTimes', JSON.stringify(newBestTimes));
        setGameState(prev => ({ ...prev, bestTimes: newBestTimes }));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error saving best time:', error);
      return false;
    }
  };

  const startGame = (grid, gridSize, placedWords, category, difficulty) => {
    setGameState({
      grid,
      gridSize,
      placedWords,
      foundWords: new Set(),
      category,
      difficulty,
      isPlaying: true,
      isPaused: false,
      timer: 0,
      bestTimes: gameState.bestTimes
    });
  };

  const pauseGame = () => {
    setGameState(prev => ({ ...prev, isPaused: true }));
  };

  const resumeGame = () => {
    setGameState(prev => ({ ...prev, isPaused: false }));
  };

  const markWordAsFound = (word) => {
    setGameState(prev => {
      const newFoundWords = new Set(prev.foundWords);
      newFoundWords.add(word.toLowerCase());
      
      // Check if all words are found
      const allWordsFound = prev.placedWords.every(
        w => newFoundWords.has(w.word.toLowerCase())
      );
      
      if (allWordsFound) {
        // Game completed
        saveBestTime(prev.category, prev.difficulty, prev.timer);
        return {
          ...prev,
          foundWords: newFoundWords,
          isPlaying: false
        };
      }
      
      return {
        ...prev,
        foundWords: newFoundWords
      };
    });
  };

  const isWordFound = (word) => {
    return gameState.foundWords.has(word.toLowerCase());
  };

  const resetGame = () => {
    setGameState({
      grid: [],
      gridSize: 0,
      placedWords: [],
      foundWords: new Set(),
      category: null,
      difficulty: null,
      isPlaying: false,
      isPaused: false,
      timer: 0,
      bestTimes: gameState.bestTimes
    });
  };

  const getBestTime = (category, difficulty) => {
    const key = `${category}_${difficulty}`;
    return gameState.bestTimes[key] || null;
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    if (gameState.placedWords.length === 0) return 0;
    return (gameState.foundWords.size / gameState.placedWords.length) * 100;
  };

  const value = {
    gameState,
    startGame,
    pauseGame,
    resumeGame,
    markWordAsFound,
    isWordFound,
    resetGame,
    getBestTime,
    formatTime,
    getProgress
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export default GameContext;
