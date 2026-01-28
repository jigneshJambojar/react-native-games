import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated } from 'react-native';
import { useGame } from '../context/GameContext';

const WordItem = ({ word, isFound }) => {
  const glow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isFound) {
      Animated.sequence([
        Animated.timing(glow, {
          toValue: 1,
          duration: 250,
          useNativeDriver: false,
        }),
        Animated.timing(glow, {
          toValue: 0,
          duration: 600,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [isFound]);

  return (
    <Animated.View
      style={[
        styles.wordItem,
        isFound && styles.wordItemFound,
        {
          shadowColor: '#4caf50',
          shadowOpacity: glow,
          shadowRadius: glow.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 12],
          }),
          elevation: glow.interpolate({
            inputRange: [0, 1],
            outputRange: [2, 10],
          }),
          transform: [
            {
              scale: glow.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 1.06],
              }),
            },
          ],
        },
      ]}
    >
      <Text style={[styles.wordText, isFound && styles.wordTextFound]}>
        {word}
      </Text>
    </Animated.View>
  );
};

const WordList = () => {
  const { gameState, isWordFound } = useGame();
  const { placedWords } = gameState;

  return (
    <View style={[styles.container]}>
      <Text style={styles.title}>Find these words</Text>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.grid}>
          {placedWords.map((item, index) => (
            <WordItem
              key={`${item.word}-${index}`}
              word={item.word}
              isFound={isWordFound(item.word)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 6,
    padding: 10,
    marginHorizontal: 10,
    marginBottom: 20,
    elevation: 4,
  },

  title: {
    fontSize: 16,
    fontWeight: '900',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
    textTransform: 'uppercase',
  },

  scrollContent: {
    paddingBottom: 10,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  wordItem: {
    width: '48%',
    backgroundColor: '#f1f3f5',
    paddingVertical: 10,
    marginBottom: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#0a83ec',
    alignItems: 'center',
  },

  wordItemFound: {
    backgroundColor: '#d4edda',
    borderColor: '#4caf50',
  },

  wordText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
    textTransform: 'uppercase',
  },

  wordTextFound: {
    textDecorationLine: 'line-through',
    color: '#2e7d32',
  },
});

export default WordList;
