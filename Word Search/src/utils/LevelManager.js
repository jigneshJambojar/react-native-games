import levelData from '../data/LevelData.json';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@word_search_progress';

class LevelManager {
  constructor() {
    this.levels = levelData.levels;
    this.maxUnlockedLevel = 1;
    this.levelStars = new Array(this.levels.length).fill(0);
    this.levelScore = 0;
  }

  async loadProgress() {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        const progress = JSON.parse(data);
        this.maxUnlockedLevel = progress.maxUnlockedLevel || 1;
        this.levelStars = progress.levelStars || new Array(this.levels.length).fill(0);
        this.levelScore = progress.levelScore || 0;
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  }

  async saveProgress() {
    try {
      const progress = {
        maxUnlockedLevel: this.maxUnlockedLevel,
        levelStars: this.levelStars,
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  }

  getLevel(levelNumber) {
    if (levelNumber > 0 && levelNumber <= this.levels.length) {
      return this.levels[levelNumber - 1];
    }
    return null;
  }

  async completeLevel(levelNumber, stars, currentScore) {
    if (levelNumber > 0 && levelNumber <= this.levels.length) {
      // Update stars if better
      if (stars > this.levelStars[levelNumber - 1]) {
        this.levelStars[levelNumber - 1] = stars;
      }

      // Unlock next level
      if (levelNumber === this.maxUnlockedLevel && levelNumber < this.levels.length) {
        this.maxUnlockedLevel = levelNumber + 1;
      }

      if (currentScore !== undefined) {
        this.levelScore = this.levelScore + currentScore;
      }

      await this.saveProgress();
    }
  }

  getLevelStars(levelNumber) {
    if (levelNumber > 0 && levelNumber <= this.levels.length) {
      return this.levelStars[levelNumber - 1];
    }
    return 0;
  }

  getScore() {
    return this.levelScore;
  }

  isLevelUnlocked(levelNumber) {
    return levelNumber <= this.maxUnlockedLevel;
  }

  getTotalLevels() {
    return this.levels.length;
  }

  async resetProgress() {
    this.maxUnlockedLevel = 1;
    this.levelStars = new Array(this.levels.length).fill(0);
    await this.saveProgress();
  }
}

export default new LevelManager();
