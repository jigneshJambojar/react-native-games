import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Modal, Text, TouchableOpacity, Alert, Image, Dimensions } from 'react-native';
import { useGame } from '../context/GameContext';
import GameHeader from '../components/GameHeader';
import WordGrid from '../components/WordGrid';
import WordList from '../components/WordList';
import LeaveGamePopup from '../components/LeaveGamePopup';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const CompletionModal = ({ visible, time, isNewRecord, onRestart, onBack }) => (
  <Modal visible={visible} transparent animationType="fade">
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>🎉 Congratulations!</Text>
        <Text style={styles.modalText}>You found all words!</Text>
        <Text style={styles.modalTime}>Time: {time}</Text>
        {isNewRecord && (
          <Text style={styles.newRecordText}>🏆 New Best Time!</Text>
        )}
        <View style={styles.modalButtons}>
          <TouchableOpacity style={styles.modalButton} onPress={onRestart}>
            <Text style={styles.modalButtonText}>Play Again</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modalButton, styles.modalButtonSecondary]}
            onPress={onBack}
          >
            <Text style={styles.modalButtonText}>Back to Menu</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

const PauseOverlay = ({ visible, onResume }) => {
  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableOpacity
        style={styles.pauseOverlay}
        activeOpacity={1}
        onPress={onResume}
      >
        <Text style={styles.pauseText}>PAUSED</Text>
        <Image
          source={require('../../assets/btn/bt-continue.png')}
          style={styles.backText}
          resizeMode="contain"
        />
        <Text style={styles.pauseSubtext}>Tap anywhere to resume</Text>
      </TouchableOpacity>
    </Modal>
  );
};

const GameScreen = ({ navigation, route }) => {
  const { category, difficulty } = route.params;
  const { gameState, formatTime, getBestTime, resetGame, resumeGame } = useGame();
  const [showCompletion, setShowCompletion] = useState(false);
  const [isNewRecord, setIsNewRecord] = useState(false);
  const [leavePopupVisible, setLeavePopupVisible] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [gridHeight, setGridHeight] = useState(0);

  useEffect(() => {
    if (!gameState.isPlaying && gameState.timer > 0 && gameState.foundWords.size > 0) {
      // Game completed
      const previousBest = getBestTime(category, difficulty);
      const isRecord = !previousBest || gameState.timer < previousBest;
      setIsNewRecord(isRecord);
      setShowCompletion(true);
    }
  }, [gameState.isPlaying]);


  const handleLeave = () => {
    resetGame();
    navigation.goBack();
  };

  const handleRestart = () => {
    setShowCompletion(false);
    resetGame();
    navigation.replace('Game', { category, difficulty });
  };

  const handleBackToMenu = () => {
    setShowCompletion(false);
    resetGame();
    navigation.goBack();
  };

  // Safety check - if no game loaded, show loading or go back
  if (!gameState.grid || gameState.grid.length === 0) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ fontSize: 18, color: '#666' }}>Loading game...</Text>
      </View>
    );
  }

  const wordListMaxHeight = SCREEN_HEIGHT - headerHeight - gridHeight;

  return (
    <View style={styles.container}>
      <View onLayout={e => setHeaderHeight(e.nativeEvent.layout.height)}>
        <GameHeader onBack={() => setLeavePopupVisible(true)} />
      </View>
      <View style={styles.mainContent}>
        {/* WordGrid - 70% height */}
        <View style={styles.gridContainer}>
          <View>
            <WordGrid onHeight={setGridHeight}/>
          </View>

          <View style={{ maxHeight: wordListMaxHeight }}>
            <WordList />
          </View>

        </View>

      </View>

      <PauseOverlay
        visible={gameState.isPaused}
        onResume={resumeGame}
      />

      <CompletionModal
        visible={showCompletion}
        time={formatTime(gameState.timer)}
        isNewRecord={isNewRecord}
        onRestart={handleRestart}
        onBack={handleBackToMenu}
      />

      <LeaveGamePopup
        visible={leavePopupVisible}
        onCancel={() => setLeavePopupVisible(false)}
        onLeave={handleLeave}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fec702'
  },
  mainContent: {
    flex: 1,
  },
  gridContainer: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    width: '80%',
    maxWidth: 400
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16
  },
  modalText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 8
  },
  modalTime: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4caf50',
    marginBottom: 8
  },
  newRecordText: {
    fontSize: 18,
    color: '#ffc107',
    fontWeight: 'bold',
    marginBottom: 24
  },
  modalButtons: {
    flexDirection: 'column',
    width: '100%',
    gap: 12
  },
  modalButton: {
    backgroundColor: '#007bff',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%'
  },
  modalButtonSecondary: {
    backgroundColor: '#6c757d'
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  pauseOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  pauseText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16
  },
  pauseSubtext: {
    marginTop: 16,
    fontSize: 18,
    color: '#ccc'
  }
});

export default GameScreen;
