import React, { useState, useEffect } from 'react';
import { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Alert,
  Image,
  TouchableOpacity
} from 'react-native';
import LetterTile from '../components/LetterTile';
import GridGenerator from '../utils/GridGenerator';
import LevelManager from '../utils/LevelManager';
import StarProgress from '../components/TimeBasedStarRating';
import TimeUpModal from '../components/TimeUpModal';
import homeImage from '../assets/images/home.png';
import restartImage from '../assets/images/restart.png';
import LevelCompleteModal from '../components/LevelCompleteModal';

const { width } = Dimensions.get('window');
const GAME_TIME = 30;

const GameScreen = ({ route, navigation }) => {
  const { levelNumber } = route.params;

  const [level, setLevel] = useState(null);
  const [grid, setGrid] = useState([]);
  const [selectedTiles, setSelectedTiles] = useState([]);
  const [foundWords, setFoundWords] = useState([]);
  const [score, setScore] = useState(0);
  const [userScore, setUserScore] = useState(0);
  const [targetWords, setTargetWords] = useState([]);

  const [timeLeft, setTimeLeft] = useState(GAME_TIME);
  const [timeUp, setTimeUp] = useState(false);
  const [showTimeUp, setShowTimeUp] = useState(false);
  const [modalLevelCompletedVisible, setModalLevelCompletedVisible] = useState(false);

  const [usedTiles, setUsedTiles] = useState([]);

  useEffect(() => {
    loadLevel();
  }, []);

  /* ⏱ Timer */
  useEffect(() => {
    if (timeUp) return;

    if (timeLeft <= 0) {
      setTimeUp(true);
      setShowTimeUp(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(t => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, timeUp]);

  /* 🔁 Auto-submit when max word reached */
  useEffect(() => {
    if (!selectedTiles.length) return;

    const word = selectedTiles.map(t => t.letter).join('').toUpperCase();

    const remainingWords = targetWords.filter(w => !foundWords.includes(w));

    // 🟢 EXACT MATCH
    if (remainingWords.includes(word)) {

      const wordScore = word.length * 10 + timeLeft * 2;
      setScore(prev => prev + wordScore);

      setUsedTiles(prev => [
        ...prev,
        ...selectedTiles.map(t => t.key),
      ]);

      console.log(newFound, "newFound")
      const newFound = [...foundWords, word];
      setFoundWords(newFound);
      setSelectedTiles([]);
      // setCurrentWord('');

      // 🎉 ALL WORDS FOUND → LEVEL COMPLETE
      if (newFound.length === targetWords.length) {
        setTimeout(() => {
          levelComplete(wordScore);
        }, 300);
      }

      return;
    }

    // 🟡 PREFIX → WAIT
    const isPrefix = remainingWords.some(w => w.startsWith(word));
    if (isPrefix) return;

    setSelectedTiles([]);

  }, [selectedTiles]);

  const loadLevel = () => {
    const levelData = LevelManager.getLevel(levelNumber);
    const getUserScore = LevelManager.getScore();
    setUserScore(getUserScore);
    if (!levelData) return;

    setLevel(levelData);
    setTargetWords(levelData.words.map(w => w.toUpperCase()));
    setGrid(GridGenerator.generateGrid(levelData.gridSize, levelData.words));
    setFoundWords([]);
    setSelectedTiles([]);
    setTimeLeft(GAME_TIME);
    setTimeUp(false);
    setUsedTiles([]);
  };


  const handleTilePress = (x, y) => {
    const key = `${x},${y}`;

    if (timeUp) return;
    if (!grid[y][x]) return;


    if (usedTiles.includes(key)) return;

    setSelectedTiles(prev => {
      const exists = prev.find(t => t.key === key);
      if (exists) {
        // Deselect tile
        return prev.filter(t => t.key !== key);
      }
      return [...prev, { x, y, key, letter: grid[y][x] }];
    });
  };

  const getCurrentWord = () => selectedTiles.map(t => t.letter).join('');

  const getStarsByTime = () => {
    if (timeLeft >= 20) return 3;
    if (timeLeft >= 10) return 2;
    return 1;
  };

  const levelComplete = (levelScore = 0) => {
    setTimeUp(true);
    const stars = getStarsByTime();
    LevelManager.completeLevel(levelNumber, stars, levelScore);
    setModalLevelCompletedVisible(true);
  };

  const goNextLevel = () => {
    setModalLevelCompletedVisible(false);
    navigation.replace('Game', { levelNumber: levelNumber + 1 });
  };

  const onHomePress = () => {
    navigation.navigate('LevelSelect');
  };

  const onResetPress = () => {
    loadLevel();
  }

  const getTileSize = () => {
    if (!level) return 60;
    return Math.floor((width - 40 - level.gridSize * 6) / level.gridSize);
  };



  if (!level) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <><View style={styles.container}>


      <View style={styles.header}>
        <View style={styles.scoreBadge}>
          <Text style={styles.scoreTitle}>Score</Text>
          <Text style={styles.scoreValue}>{userScore}</Text>
        </View>
        <View style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Text style={styles.levelText}>Level</Text>
          <Text style={styles.levelText}>{levelNumber}</Text>
        </View>
        <View
          style={[
            styles.timerBadge,
            timeLeft <= 5 && styles.timerDanger,
          ]}
        >
          <Text style={styles.timerTitle}>Time</Text>
          <Text style={styles.timerValue}>{timeLeft}s</Text>
        </View>
      </View>

      <View style={styles.starBarContainer}>
        <StarProgress totalTime={GAME_TIME} timeLeft={timeLeft} starCount={3} size={30} barWidth={200} />
      </View>


      <View style={styles.gridContainer}>
        {grid.map((row, y) => (
          <View key={y} style={styles.row}>
            {row.map((letter, x) => (
              <LetterTile
                key={`${x},${y}`}
                letter={letter}
                isSelected={selectedTiles.some(t => t.key === `${x},${y}`)}
                isUsed={usedTiles.includes(`${x},${y}`)}
                onPress={() => handleTilePress(x, y)}
                size={getTileSize()} />
            ))}
          </View>
        ))}
      </View>

      {/* <View style={styles.wordsContainer}>
      <ScrollView horizontal>
        {targetWords.map((w, i) => (
          <View
            key={i}
            style={[
              styles.wordItem,
              foundWords.includes(w) && styles.wordItemFound,
            ]}>
            <Text style={styles.wordText}>
              {foundWords.includes(w) ? w : '_ '.repeat(w.length)}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View> */}

      <View style={styles.wordFindContainer}>
        <Text style={styles.wordFindTitle}>WORD TO FIND</Text>

        <View style={styles.letterBoxesContainer}>
          {targetWords.map((word, i) => {
            const isFound = foundWords.includes(word);
            return word.split('').map((char, j) => (
              <View
                key={`${i}-${j}`}
                style={[
                  styles.letterBox,
                  isFound && styles.letterBoxFound,
                  j == 0 && { marginLeft: 8 }
                ]}
              >
                <Text style={styles.letterText}>
                  {isFound ? char : ''}
                </Text>
              </View>
            ));
          })}
        </View>
      </View>

      {/* <View style={styles.wordFindContainer}>
        <Text style={styles.wordFindTitle}>WORD TO FIND</Text>

        <View style={styles.letterBoxes}>
          {(getCurrentWord() || '').padEnd(level.gridSize * level.gridSize || 5).split('').map((char, i) => (
            <View key={i} style={styles.letterBox}>
              <Text style={styles.letterText}>{char !== ' ' ? char : ''}</Text>
            </View>
          ))}
        </View>
      </View> */}

      <View style={styles.btnContainer}>
        <TouchableOpacity style={[styles.button, styles.homeButton]} onPress={onHomePress}>
          <Image
            source={homeImage}
            style={{ width: 30, height: 30 }} // icon size
          />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.resetButton]} onPress={onResetPress}>
          <Image
            source={restartImage}
            style={{ width: 30, height: 30 }} // icon size
          />
        </TouchableOpacity>
      </View>

    </View>
      <TimeUpModal
        visible={showTimeUp}
        onRetry={() => {
          setShowTimeUp(false);
          loadLevel();
        }}
        onExit={() => navigation.navigate('LevelSelect')} />

      <LevelCompleteModal
        visible={modalLevelCompletedVisible}
        stars={getStarsByTime()}
        score={score}
        onNextLevel={goNextLevel}
        onMenu={onHomePress}
      />

    </>
  );
};

// Screen padding
const SCREEN_PADDING = 10;
const MIN_BOX_SIZE = 34;
const BOX_MARGIN = 2

const availableWidth = width - SCREEN_PADDING * 2;

let boxesPerRow = Math.floor((availableWidth + BOX_MARGIN * 2) / (MIN_BOX_SIZE + BOX_MARGIN * 2));

const letterBoxSize = ((availableWidth - BOX_MARGIN * 2 * boxesPerRow) / boxesPerRow) - 5;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#a1ceedff', padding: 10, paddingTop: 5 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, marginBottom: 20 },
  levelText: { fontSize: 26, fontWeight: 'bold', color: '#FFF' },
  scoreBadge: {
    alignSelf: 'center',
    backgroundColor: '#5DA9FF', // blue pill
    borderRadius: 18,
    paddingVertical: 6,
    paddingHorizontal: 22,
    alignItems: 'center',
    marginVertical: 10,

    // subtle shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },

  scoreTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.9,
  },

  scoreValue: {
    color: '#FFF176', // yellow number
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: -2,
  },
  currentWordContainer: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    padding: 15,
    borderRadius: 10,
    marginVertical: 15,
    alignItems: 'center',
  },
  starBarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  timerBadge: {
    alignSelf: 'center',
    backgroundColor: '#5DA9FF', // same blue
    borderRadius: 18,           // SAME
    paddingVertical: 8,         // SAME
    paddingHorizontal: 22,      // SAME
    alignItems: 'center',
    marginVertical: 10,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },

  timerTitle: {
    color: '#FFFFFF',
    fontSize: 14,               // SAME as scoreTitle
    fontWeight: '600',
    opacity: 0.9,
    includeFontPadding: false,  // 🔥 IMPORTANT
    lineHeight: 16,
  },

  timerValue: {
    color: '#FFF176',
    fontSize: 25,               // SAME as scoreValue
    fontWeight: 'bold',
    marginTop: 2,              // SAME
    includeFontPadding: false,  // 🔥 IMPORTANT
    lineHeight: 30,
  },

  timerDanger: {
    backgroundColor: '#E53935',
  },

  wordFindContainer: {
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 15,
    alignItems: 'center',
  },

  wordFindTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 10,
  },

  letterBoxesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap', // wrap to next line if too long
    justifyContent: 'center',
    gap: 6,
  },

  letterBox: {
    width: letterBoxSize,
    height: letterBoxSize,
    borderRadius: 4,
    backgroundColor: '#7babd9',
    borderWidth: 2,
    borderColor: '#5587b9',
    alignItems: 'center',
    justifyContent: 'center',
  },

  letterBoxFound: {
    backgroundColor: '#4CAF50',
    borderColor: '#388E3C',
  },

  letterText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },

  currentWord: { fontSize: 24, fontWeight: 'bold', color: '#FFF' },
  gridContainer: { alignItems: 'center' },
  row: { flexDirection: 'row' },
  wordsContainer: { marginTop: 15 },
  wordItem: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  wordItemFound: { backgroundColor: '#4CAF50' },
  wordText: { color: '#FFF', fontWeight: 'bold' },
  loadingText: { fontSize: 24, color: '#FFF', textAlign: 'center', marginTop: 100 },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: "center",
    marginVertical: 5,
    paddingHorizontal: 5,
    gap: 10,
  },
  button: {
    width: 60, // fixed width
    height: 60, // fixed height
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    elevation: 3,
  },
  homeButton: {
    backgroundColor: '#4A90E2',
  },
  resetButton: {
    backgroundColor: '#FFC107',
  },
});

export default GameScreen;
