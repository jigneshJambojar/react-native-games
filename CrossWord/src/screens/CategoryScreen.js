import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
  Dimensions,
  PixelRatio
} from 'react-native';
import { useGame } from '../context/GameContext';
import {
  getCategoryList,
  getWordsForCategory,
  GRID_SIZES,
  DIFFICULTY_LABELS
} from '../constants/categoryData';
import { generateWordSearchGrid } from '../utils/wordGenerator';
import Header from '../components/Header';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BASE_WIDTH = 375;

export const scaleFont = (size) => {
  const scale = SCREEN_WIDTH / BASE_WIDTH;
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

const CategoryScreen = ({ navigation }) => {
  const { startGame, getBestTime, formatTime } = useGame();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [popupCategory, setPopupCategory] = useState(null);
  const categories = getCategoryList();

  const handleDifficultySelect = (categoryId, difficulty) => {
    try {
      setIsLoading(true);
      const words = getWordsForCategory(categoryId, difficulty);
      const gridSize = GRID_SIZES[difficulty];

      const { grid, placedWords } = generateWordSearchGrid(words, gridSize);

      if (!grid || !placedWords || placedWords.length === 0) {
        alert('Error generating game. Please try again.');
        setIsLoading(false);
        return;
      }

      startGame(grid, gridSize, placedWords, categoryId, difficulty);

      setTimeout(() => {
        setIsLoading(false);
        navigation.navigate('Game', { category: categoryId, difficulty });
      }, 100);
    } catch (error) {
      console.error('Error starting game:', error);
      alert('Error starting game. Please try again.');
      setIsLoading(false);
    }
  };

  const renderDifficultyButtons = (categoryId) => {
    const difficulties = ['easy', 'medium', 'hard'];

    return (
      <View style={styles.difficultyContainer}>
        {difficulties.map((diff) => {
          const bestTime = getBestTime(categoryId, diff);
          return (
            <TouchableOpacity
              key={diff}
              style={styles.difficultyButton}
              onPress={() => handleDifficultySelect(categoryId, diff)}
              disabled={isLoading}
            >
              <Text style={styles.difficultyText}>
                {isLoading
                  ? 'Loading...'
                  : `${diff.toUpperCase()} ${DIFFICULTY_LABELS[diff]}`}
              </Text>

              {bestTime && !isLoading && (
                <Text style={styles.bestTimeText}>
                  Best: {formatTime(bestTime)}
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header onHomePress={() => navigation.navigate('Home')} />

      <View style={styles.header}>
        <Text style={styles.subtitle}>
          Select a category and difficulty
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {categories.map((category) => {
          const isExpanded = selectedCategory === category.id;

          return (
            <View key={category.id} style={styles.categoryCard}>
              <TouchableOpacity
                style={styles.categoryHeader}
                onPress={() => setPopupCategory(category)}
              >
                <Image
                  source={category.image}
                  style={styles.catImage}
                  resizeMode="contain"
                />
                <Text style={styles.categoryName}>{category.name}</Text>
              </TouchableOpacity>

              {isExpanded && renderDifficultyButtons(category.id)}
            </View>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Hint: Words can be horizontal, vertical, diagonal, and backwards!
        </Text>
      </View>

      {popupCategory && (
        <View style={styles.overlay}>
          <View style={styles.popup}>
            <Text style={styles.popupTitle}>
              {popupCategory.name}
            </Text>

            {['easy', 'medium', 'hard'].map((diff) => {
              const bestTime = getBestTime(popupCategory.id, diff);
              return (
                <TouchableOpacity
                  key={diff}
                  style={styles.popupButton}
                  onPress={() => {
                    setPopupCategory(null);
                    handleDifficultySelect(popupCategory.id, diff);
                  }}
                  disabled={isLoading}
                >
                  <Text style={styles.popupButtonText}>
                    {diff.toUpperCase()} {DIFFICULTY_LABELS[diff]}
                  </Text>

                  {bestTime && (
                    <Text style={styles.popupBestTime}>
                      Best: {formatTime(bestTime)}
                    </Text>
                  )}
                </TouchableOpacity>
              );
            })}

            <TouchableOpacity
              style={styles.popupClose}
              onPress={() => setPopupCategory(null)}
            >
              <Text style={styles.popupCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fec702'
  },

  header: {
    backgroundColor: '#fec702',
    padding: 10,
    paddingTop: 30,
    alignItems: 'center'
  },

  subtitle: {
    fontSize: 16,
    color: '#0a83ec',
    fontWeight: '900',
    textTransform: 'uppercase'
  },

  scrollView: {
    flex: 1
  },

  scrollContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 10
  },

  categoryCard: {
    backgroundColor: '#fff',
    borderRadius: 2,
    width: '31%',
    marginBottom: 10,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,

    overflow: 'hidden'
  },

  categoryHeader: {
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderColor: '#0a83ec',
    borderWidth: 2
  },

  categoryName: {
    fontSize: scaleFont(12),
    fontWeight: 'bold',
    color: '#333'
  },

  difficultyContainer: {
    padding: 16,
    paddingTop: 0,
    gap: 12
  },

  difficultyButton: {
    backgroundColor: '#007bff',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center'
  },

  difficultyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4
  },

  bestTimeText: {
    fontSize: 12,
    color: '#e3f2fd'
  },

  footer: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#dee2e6'
  },

  footerText: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center'
  },

  catImage: {
    width: 40,
    height: 40
  },

  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },

  popup: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    elevation: 10,
  },

  popupTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0a83ec',
    textAlign: 'center',
    marginBottom: 16,
    textTransform: 'uppercase',
  },

  popupButton: {
    backgroundColor: '#007bff',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
  },

  popupButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },

  popupBestTime: {
    fontSize: 12,
    color: '#e3f2fd',
    marginTop: 4,
  },

  popupClose: {
    marginTop: 10,
    padding: 12,
    alignItems: 'center',
  },

  popupCloseText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#777',
  },
});

export default CategoryScreen;
