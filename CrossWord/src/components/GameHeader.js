import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useGame } from '../context/GameContext';

const GameHeader = ({ onBack }) => {
  const { gameState, formatTime, getProgress, pauseGame, resumeGame } = useGame();
  const { timer, isPaused, category, difficulty } = gameState;

  const progress = getProgress();

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Image
            source={require('../../assets/btn/bt-back.png')}
            style={styles.backText}
            resizeMode="contain"
          />
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
          {isPaused && <Image
            source={require('../../assets/btn/bt-continue.png')}
            style={styles.backText}
            resizeMode="contain"
          />
          }
          {!isPaused && <Image
            source={require('../../assets/btn/bt-pause.png')}
            style={styles.backText}
            resizeMode="contain"
          />
          }
        </TouchableOpacity>
      </View>

      <View style={styles.statsRow}>
        {/* Time */}
        <View style={styles.inlineItem}>
          <Image
            source={require('../../assets/btn/bt-watch.png')}
            style={styles.statIcon}
          />
          <Text style={styles.inlineText}>{formatTime(timer)}</Text>
        </View>

        {/* Progress bar */}
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${progress}%` }
            ]}
          />
        </View>

        {/* Progress % */}
        <View style={styles.inlineItem}>
          {/* <Image
            source={require('../../assets/icons/ic-progress.png')}
            style={styles.statIcon}
          /> */}
          <Text style={styles.inlineText}>{Math.round(progress)}%</Text>
        </View>
      </View>


    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fec702',
    paddingTop: 20,
    paddingHorizontal: 10,
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
    width: 40,
    height: 40,
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
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 8
  },

  inlineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },

  inlineText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333'
  },

  statIcon: {
    width: 18,
    height: 18,
    resizeMode: 'contain'
  },

  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#e9ecef',
    borderRadius: 8,
    overflow: 'hidden'
  },

  progressFill: {
    height: '100%',
    backgroundColor: '#4caf50',
    borderRadius: 8
  }
});

export default GameHeader;
