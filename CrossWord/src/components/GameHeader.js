import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useGame } from '../context/GameContext';

const GameHeader = ({ onBack }) => {
  const { gameState, formatTime, getProgress, pauseGame, resumeGame } = useGame();
  const { timer, isPaused, category, difficulty } = gameState;

  const progress = getProgress();

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        
        <View style={styles.centerInfo}>
          <Text style={styles.categoryText}>
            {category} - {difficulty}
          </Text>
        </View>

        <TouchableOpacity
          onPress={isPaused ? resumeGame : pauseGame}
          style={styles.pauseButton}
        >
          <Text style={styles.pauseText}>{isPaused ? '▶' : '❚❚'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>TIME</Text>
          <Text style={styles.statValue}>{formatTime(timer)}</Text>
        </View>

        <View style={styles.statItem}>
          <Text style={styles.statLabel}>PROGRESS</Text>
          <Text style={styles.statValue}>{Math.round(progress)}%</Text>
        </View>
      </View>

      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  backButton: {
    padding: 8
  },
  backText: {
    fontSize: 16,
    color: '#007bff',
    fontWeight: '600'
  },
  centerInfo: {
    flex: 1,
    alignItems: 'center'
  },
  categoryText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textTransform: 'capitalize'
  },
  pauseButton: {
    padding: 8
  },
  pauseText: {
    fontSize: 20,
    color: '#007bff'
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12
  },
  statItem: {
    alignItems: 'center'
  },
  statLabel: {
    fontSize: 12,
    color: '#6c757d',
    fontWeight: '600',
    marginBottom: 4
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333'
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e9ecef',
    borderRadius: 3,
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4caf50',
    borderRadius: 3
  }
});

export default GameHeader;
