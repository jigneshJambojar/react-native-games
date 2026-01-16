import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import LevelManager from '../utils/LevelManager';
import star from '../assets/images/star-filled.png';
import levelLocked from '../assets/images/level-locked.png';

const LEVEL_COLORS = [
  '#f39c4d', // light pink
  '#fde489', // peach
  '#c4c92e', // light yellow
  '#c5e9f7', // mint green
  '#d8acd0', // baby blue
  '#e3e753', // lavender
  '#f38aa8', // soft green
];

const { width } = Dimensions.get('window');
const numColumns = 4;
const buttonSize = (width - 40) / numColumns;

const getLevelColor = (level) => {
  return LEVEL_COLORS[(level - 1) % LEVEL_COLORS.length];
};

const LevelSelectScreen = ({ navigation }) => {
  const [levels, setLevels] = useState([]);

  useEffect(() => {
    loadLevels();
  }, []);

  const loadLevels = async () => {
    await LevelManager.loadProgress();
    const totalLevels = LevelManager.getTotalLevels();
    const levelArray = Array.from({ length: totalLevels }, (_, i) => i + 1);
    setLevels(levelArray);
  };

  const renderLevelButton = ({ item }) => {
    const isUnlocked = LevelManager.isLevelUnlocked(item);
    const stars = LevelManager.getLevelStars(item);

    return (
      <TouchableOpacity
        style={[
          styles.levelButton,
          {
            width: buttonSize, height: buttonSize, backgroundColor: isUnlocked
              ? getLevelColor(item)
              : '#999',
          },
          !isUnlocked && styles.lockedButton,
        ]}
        onPress={() => isUnlocked && navigation.navigate('Game', { levelNumber: item })}
        disabled={!isUnlocked}>
        {isUnlocked && <Text style={[styles.levelText, !isUnlocked && styles.lockedText]}>
          {item}
        </Text>
        }
        {isUnlocked && stars > 0 && (
          <View style={styles.starsRow}>

            {Array.from({ length: stars }).map((_, index) => (
              <Image
                key={index}
                source={star}
                style={styles.starImage}
              />
            ))}

          </View>
        )}
        {!isUnlocked &&
          //  <Text style={styles.lockIcon}>🔒</Text>
          <Image
            source={levelLocked}
            style={styles.lockIcon}
          />
        }
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Level</Text>
      <FlatList
        data={levels}
        renderItem={renderLevelButton}
        keyExtractor={item => item.toString()}
        numColumns={numColumns}
        contentContainerStyle={styles.gridContainer}
      />
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#87CEEB',
    paddingTop: 20,
  },
  title: {
    fontSize: 42,
    fontWeight: '700',
    color: '#FFFFFF',

    // Shadow for iOS
    textShadowColor: 'rgba(80, 140, 200, 0.9)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,

    textAlign: 'center',
    marginBottom: 5,
  },
  gridContainer: {
    padding: 5,
    alignItems: 'center',
  },
  levelButton: {
    backgroundColor: '#c4c92e',
    margin: 2,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFF',

    // iOS shadow (BOTTOM only)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 }, // 👈 push shadow down
    shadowOpacity: 0.35,
    shadowRadius: 2, // 👈 small radius = no side blur

    // Android shadow (BOTTOM only)
    elevation: 5,
  },
  lockedButton: {
    backgroundColor: '#999',
  },
  levelText: {
    fontSize: 42,
    fontWeight: '700',
    color: '#FFFFFF',

    // Shadow for iOS
    textShadowColor: 'rgba(80, 140, 200, 0.9)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,

    textAlign: 'center',
    marginBottom: 5,
  },
  lockedText: {
    color: '#cdcdcd',
  },
  starsRow: {
    flexDirection: 'row',
    marginTop: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  starImage: {
    width: 18,
    height: 18,
    marginHorizontal: 1,
  },
  lockIcon: {
    width: '50%',
    height: '50%',
  },
  backButton: {
    backgroundColor: '#FF6347',
    padding: 15,
    margin: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LevelSelectScreen;
