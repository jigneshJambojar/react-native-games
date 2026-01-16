import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const TILE_COLORS = [
  '#c5e9f7',
  '#e2e651',
  '#cda7ce',
  '#f38aa8',
  '#c4c92e',
  '#ffe38a',
  '#ffc30e',
];

const LetterTile = ({ letter, isSelected, isUsed, locked, onPress, size = 60 }) => {

  // TILE_COLORS[Math.floor(Math.random() * TILE_COLORS.length)]

  const getBackgroundColor = () => {
    if (locked) return '#5df33a';
    if (isSelected) return '#4A90E2';
    if (isUsed) return '#4CAF50';
    return '#FFD700';
  };

  return (
    <TouchableOpacity
      style={[
        styles.tile,
        {
          width: size,
          height: size,
          backgroundColor: getBackgroundColor(),
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}>
      <Text style={[styles.letter, { fontSize: size * 0.4 }]}>{letter}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tile: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 3,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  letter: {
    fontWeight: 'bold',
    color: '#FFF',
  },
});

export default LetterTile;
