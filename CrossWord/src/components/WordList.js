import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useGame } from '../context/GameContext';

const WordItem = ({ word, isFound }) => (
  <View style={[styles.wordItem, isFound && styles.wordItemFound]}>
    <Text style={[styles.wordText, isFound && styles.wordTextFound]}>
      {word}
    </Text>
  </View>
);

const WordList = () => {
  const { gameState, isWordFound } = useGame();
  const { placedWords } = gameState;

  const renderItem = ({ item }) => (
    <WordItem word={item.word} isFound={isWordFound(item.word)} />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Find these words:</Text>
      <FlatList
        data={placedWords}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.word}-${index}`}
        numColumns={2}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333'
  },
  listContent: {
    paddingBottom: 8
  },
  wordItem: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 8,
    margin: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#dee2e6'
  },
  wordItemFound: {
    backgroundColor: '#d4edda',
    borderColor: '#4caf50'
  },
  wordText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    textTransform: 'capitalize'
  },
  wordTextFound: {
    textDecorationLine: 'line-through',
    color: '#155724'
  }
});

export default WordList;
