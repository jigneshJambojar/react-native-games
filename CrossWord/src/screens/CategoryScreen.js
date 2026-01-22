import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView
} from 'react-native';
import { useGame } from '../context/GameContext';
import { getCategoryList, getWordsForCategory, GRID_SIZES, DIFFICULTY_LABELS } from '../constants/categoryData';
import { generateWordSearchGrid } from '../utils/wordGenerator';

const CategoryScreen = ({ navigation }) => {
  const { startGame, getBestTime, formatTime } = useGame();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
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
      
      // Small delay to ensure state is set before navigation
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
                {isLoading ? 'Loading...' : `${diff.toUpperCase()} ${DIFFICULTY_LABELS[diff]}`}
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
      <View style={styles.header}>
        <Text style={styles.title}>Word Search Ultimate</Text>
        <Text style={styles.subtitle}>Select a category and difficulty</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {categories.map((category) => {
          const isExpanded = selectedCategory === category.id;
          
          return (
            <View key={category.id} style={styles.categoryCard}>
              <TouchableOpacity
                style={styles.categoryHeader}
                onPress={() => setSelectedCategory(isExpanded ? null : category.id)}
              >
                <Text style={styles.categoryName}>{category.name}</Text>
                <Text style={styles.expandIcon}>{isExpanded ? '▼' : '▶'}</Text>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa'
  },
  header: {
    backgroundColor: '#007bff',
    padding: 24,
    paddingTop: 40,
    alignItems: 'center'
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8
  },
  subtitle: {
    fontSize: 16,
    color: '#e3f2fd'
  },
  scrollView: {
    flex: 1
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32
  },
  categoryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden'
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff'
  },
  categoryName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333'
  },
  expandIcon: {
    fontSize: 18,
    color: '#007bff'
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
  }
});

export default CategoryScreen;
