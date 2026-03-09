import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Level {
  id: number;
  wordCount: number;
  wordLength: number;
  timeSeconds: number;
}

interface GameState {
  levelId: number;
  wordsToGuess: string[];
  solvedWords: string[];
  availableLetters: string[];
  timeRemaining: number;
  totalTime: number;
  coinsEarned: number;
  isComplete: boolean;
}

interface GameProgress {
  coins: number;
  completedLevels: number[];
  currentLevel: number;
  gamesCompletedSinceLastAd: number;
}

interface GameContextType {
  progress: GameProgress;
  currentGame: GameState | null;
  levels: Level[];
  startLevel: (levelId: number) => void;
  submitWord: (word: string) => { success: boolean; coinsEarned: number };
  useHint: () => { success: boolean; revealedWord: string | null };
  completeLevel: (timeUsed: number) => { baseCoins: number; bonusCoins: number; totalCoins: number };
  addCoins: (amount: number) => void;
  updateTimeRemaining: (time: number) => void;
  resetAdCounter: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const WORD_LISTS: Record<number, string[]> = {
  3: ['CAT', 'DOG', 'SUN', 'RUN', 'FUN', 'HAT', 'BAT', 'RAT', 'MAP', 'CAP', 'TAP', 'PAN', 'CAN', 'MAN', 'ANT', 'BAG', 'CUP', 'EGG', 'MAX', 'ZOO', 'TAX', 'BOX', 'FOX', 'MIX', 'SIX', 'FIX', 'BIG', 'DIG', 'PIG', 'WAR', 'ROW', 'OIL', 'BED', 'RED', 'LED', 'FED', 'WET', 'PET', 'SET', 'ZIP', 'LET', 'NET', 'MET', 'JET', 'BET', 'ICE', 'JAR', 'PEN', 'TEN', 'COW', 'MEN'],
  4: ['CAKE', 'LAKE', 'MAKE', 'TAKE', 'WAKE', 'BAKE', 'FAKE', 'RAKE', 'GAME', 'NAME', 'SAME', 'FAME', 'CAME', 'TAME', 'DAME', 'LAME', 'FIRE', 'HIRE', 'WIRE', 'TIRE', 'DIVE', 'FIVE', 'GIVE', 'HIVE', 'LIVE', 'BONE', 'CONE', 'DONE', 'GONE', 'LONE', 'NONE', 'TONE', 'ZONE', 'HOME', 'DOME', 'ROME', 'COME', 'SOME', 'BOOK', 'COOK', 'HOOK', 'LOOK', 'TOOK', 'NOOK', 'ROOM', 'BOOM', 'DOOM', 'ZOOM', 'LOOM'],
  5: ['APPLE', 'HAPPY', 'CANDY', 'DANCE', 'EARTH', 'FANCY', 'GRACE', 'HEART', 'IMAGE', 'JOLLY', 'KNIFE', 'LEMON', 'MANGO', 'NIGHT', 'OCEAN', 'PEACH', 'QUEEN', 'ROBOT', 'STONE', 'TIGER', 'UNCLE', 'VIVID', 'WATER', 'YOUTH', 'ZEBRA', 'BRAVE', 'CRAZY', 'DREAM', 'EAGLE', 'FLAME', 'GHOST', 'HORSE', 'IVORY', 'JEWEL', 'KARMA', 'LUNAR', 'MAGIC', 'NOBLE', 'OASIS', 'PIANO', 'QUEST', 'ROYAL', 'STORM', 'TOWER', 'UNITY', 'VOICE', 'WORLD', 'XYLON', 'YOUNG'],
  6: ['BANANA', 'CASTLE', 'DRAGON', 'ENERGY', 'FAMILY', 'GARDEN', 'HEAVEN', 'ISLAND', 'JUNGLE', 'KITTEN', 'LAPTOP', 'MONKEY', 'NATURE', 'ORANGE', 'PALACE', 'RABBIT', 'SALMON', 'TEMPLE', 'TURTLE', 'UNICORN', 'VALLEY', 'WINNER', 'YELLOW', 'ZIGZAG', 'BRIDGE', 'CLOUDS', 'DESERT', 'ESCAPE', 'FROZEN', 'GLOBAL', 'HELMET', 'INSECT', 'JOYFUL', 'KNIGHT', 'LEGACY', 'MUSEUM', 'NATIVE', 'OUTFIT', 'PLANET', 'QUARTZ', 'RESCUE', 'SHIELD', 'THRONE', 'UPBEAT', 'VISION', 'WISDOM', 'ZENITH'],
  7: ['BALANCE', 'CAPTAIN', 'DIAMOND', 'ELEMENT', 'FANTASY', 'GATEWAY', 'HARMONY', 'IMAGINE', 'JOURNEY', 'KINGDOM', 'LIBERTY', 'MYSTERY', 'NETWORK', 'OLYMPUS', 'PHOENIX', 'QUALITY', 'RAINBOW', 'SILENCE', 'THUNDER', 'UNIFORM', 'VICTORY', 'WARRIOR', 'XYLOGEN', 'YARDAGE', 'ZEALOUS', 'ANCIENT', 'BILLION', 'CHAPTER', 'ECLIPSE', 'FORTUNE', 'GLACIER', 'HORIZON', 'JUSTICE', 'KITCHEN', 'LIBRARY', 'MACHINE', 'NATURAL', 'OPINION', 'PATTERN', 'QUARTER', 'REALITY', 'SURFACE', 'TRAFFIC', 'UPGRADE', 'VENTURE', 'WEATHER'],
};

const generateLevels = (): Level[] => {
  const levels: Level[] = [];
  const config = [
    { range: [1, 5], wordCount: 2, wordLength: 3, time: 60 },
    { range: [6, 10], wordCount: 3, wordLength: 3, time: 90 },
    { range: [11, 15], wordCount: 3, wordLength: 4, time: 120 },
    { range: [16, 20], wordCount: 4, wordLength: 4, time: 150 },
    { range: [21, 25], wordCount: 4, wordLength: 5, time: 180 },
    { range: [26, 30], wordCount: 5, wordLength: 5, time: 210 },
    { range: [31, 35], wordCount: 5, wordLength: 6, time: 240 },
    { range: [36, 40], wordCount: 6, wordLength: 6, time: 270 },
    { range: [41, 45], wordCount: 6, wordLength: 7, time: 300 },
    { range: [46, 50], wordCount: 7, wordLength: 7, time: 330 },
  ];

  config.forEach(({ range, wordCount, wordLength, time }) => {
    for (let i = range[0]; i <= range[1]; i++) {
      levels.push({ id: i, wordCount, wordLength, timeSeconds: time });
    }
  });

  return levels;
};

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const STORAGE_KEY = '@word_puzzle_progress';

export function GameProvider({ children }: { children: ReactNode }) {
  const [levels] = useState<Level[]>(generateLevels);
  const [progress, setProgress] = useState<GameProgress>({
    coins: 100,
    completedLevels: [],
    currentLevel: 1,
    gamesCompletedSinceLastAd: 0,
  });
  const [currentGame, setCurrentGame] = useState<GameState | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const startLevel = useCallback((levelId: number) => {
    const level = levels.find(l => l.id === levelId);
    if (!level) return;

    const wordList = WORD_LISTS[level.wordLength] || WORD_LISTS[3];
    const shuffledWords = shuffleArray(wordList);
    const selectedWords = shuffledWords.slice(0, level.wordCount);
    console.log(selectedWords, "selectedWords")

    const allLetters = selectedWords.join('').split('');
    const extraLetters = shuffleArray(wordList.join('').split('')).slice(0, Math.floor(allLetters.length * 0.2));
    const availableLetters = shuffleArray([...allLetters, ...extraLetters]);

    setCurrentGame({
      levelId,
      wordsToGuess: selectedWords,
      solvedWords: [],
      availableLetters,
      timeRemaining: level.timeSeconds,
      totalTime: level.timeSeconds,
      coinsEarned: 0,
      isComplete: false,
    });
  }, [levels]);

  const submitWord = useCallback((word: string) => {
    if (!currentGame) return { success: false, coinsEarned: 0 };

    const upperWord = word.toUpperCase();
    if (
      currentGame.wordsToGuess.includes(upperWord) &&
      !currentGame.solvedWords.includes(upperWord)
    ) {
      const coinsEarned = 10;
      const newSolvedWords = [...currentGame.solvedWords, upperWord];
      const isComplete = newSolvedWords.length === currentGame.wordsToGuess.length;

      setCurrentGame(prev => prev ? {
        ...prev,
        solvedWords: newSolvedWords,
        coinsEarned: prev.coinsEarned + coinsEarned,
        isComplete,
      } : null);

      return { success: true, coinsEarned };
    }

    return { success: false, coinsEarned: 0 };
  }, [currentGame]);

  const useHint = useCallback(() => {
    if (!currentGame || progress.coins < 100) {
      return { success: false, revealedWord: null };
    }

    const unsolvedWords = currentGame.wordsToGuess.filter(
      w => !currentGame.solvedWords.includes(w)
    );

    if (unsolvedWords.length === 0) {
      return { success: false, revealedWord: null };
    }

    const wordToReveal = unsolvedWords[0];
    const newSolvedWords = [...currentGame.solvedWords, wordToReveal];
    const isComplete = newSolvedWords.length === currentGame.wordsToGuess.length;

    setProgress(prev => ({ ...prev, coins: prev.coins - 100 }));
    setCurrentGame(prev => prev ? {
      ...prev,
      solvedWords: newSolvedWords,
      isComplete,
    } : null);

    return { success: true, revealedWord: wordToReveal };
  }, [currentGame, progress.coins]);

  const completeLevel = useCallback((timeUsed: number) => {
    if (!currentGame) return { baseCoins: 0, bonusCoins: 0, totalCoins: 0 };

    const baseCoins = currentGame.coinsEarned;
    const timePercentUsed = timeUsed / currentGame.totalTime;
    const bonusCoins = timePercentUsed < 0.9 ? Math.floor(baseCoins * 0.1) : 0;
    const totalCoins = baseCoins + bonusCoins;

    setProgress(prev => ({
      coins: prev.coins + totalCoins,
      completedLevels: prev.completedLevels.includes(currentGame.levelId)
        ? prev.completedLevels
        : [...prev.completedLevels, currentGame.levelId],
      currentLevel: Math.max(prev.currentLevel, currentGame.levelId + 1),
      gamesCompletedSinceLastAd: prev.gamesCompletedSinceLastAd + 1,
    }));

    return { baseCoins, bonusCoins, totalCoins };
  }, [currentGame]);

  const addCoins = useCallback((amount: number) => {
    setProgress(prev => ({ ...prev, coins: prev.coins + amount }));
  }, []);

  const updateTimeRemaining = useCallback((time: number) => {
    setCurrentGame(prev => prev ? { ...prev, timeRemaining: time } : null);
  }, []);

  const resetAdCounter = useCallback(() => {
    setProgress(prev => ({ ...prev, gamesCompletedSinceLastAd: 0 }));
  }, []);

  // Load progress from storage on mount
  useEffect(() => {
    const loadProgress = async () => {
      try {
        const savedProgress = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedProgress) {
          const parsed = JSON.parse(savedProgress);
          console.log('[GameContext] Loaded progress:', parsed);
          setProgress(parsed);
        }
      } catch (error) {
        console.error('[GameContext] Failed to load progress:', error);
      } finally {
        setIsLoaded(true);
      }
    };
    loadProgress();
  }, []);

  // Save progress to storage whenever it changes
  useEffect(() => {
    if (!isLoaded) return; // Don't save initial state

    const saveProgress = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
        console.log('[GameContext] Saved progress:', progress);
      } catch (error) {
        console.error('[GameContext] Failed to save progress:', error);
      }
    };
    saveProgress();
  }, [progress, isLoaded]);

  return (
    <GameContext.Provider
      value={{
        progress,
        currentGame,
        levels,
        startLevel,
        submitWord,
        useHint,
        completeLevel,
        addCoins,
        updateTimeRemaining,
        resetAdCounter,
      }}
    >
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
