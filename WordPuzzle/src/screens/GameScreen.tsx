import { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Image, Alert, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { useGame } from '../context/GameContext';
import { RootStackParamList } from '../../App';
import adService from '../services/AdService';

import Coin from '../../assets/coin.png';
import Shop from '../../assets/btn-shop.png';
import Home from '../../assets/btn-home.png';
import Retry from '../../assets/btn-retry.png';
import Hint from '../../assets/btn-hint.png';


type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type GameRouteProp = RouteProp<RootStackParamList, 'Game'>;

export default function GameScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<GameRouteProp>();
  const { levelId } = route.params;

  const { currentGame, progress, startLevel, submitWord, useHint, completeLevel, resetAdCounter, addCoins } = useGame();

  const [currentInput, setCurrentInput] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showHintModal, setShowHintModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [completionData, setCompletionData] = useState<{ baseCoins: number; bonusCoins: number; totalCoins: number } | null>(null);
  const [wrongWord, setWrongWord] = useState(false);
  const [showTimeUpModal, setShowTimeUpModal] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeRemainingRef = useRef(0);

  const [adUnits, setAdUnits] = useState<any>(null);

  useEffect(() => {
    fetch('https://d22swxawtpfyg.cloudfront.net/react-native-game-settings/word-puzzle-adunit.json?v=' + new Date())
      .then(res => res.json())
      .then(json => {
        setAdUnits(json);
      })
      .catch(err => console.log('Failed to load ads', err.message));
  }, []);

  useEffect(() => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      setTimeRemaining(0);
      timerRef.current = null;
    }
    startLevel(levelId);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [levelId, startLevel]);

  useEffect(() => {
    // stop any existing timer
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      setTimeRemaining(0);
      timerRef.current = null;
    }

    if (currentGame) {
      setTimeRemaining(currentGame.totalTime);
      timeRemainingRef.current = currentGame.totalTime;
    }
  }, [currentGame?.levelId]);

  useEffect(() => {
    if (!currentGame || currentGame.isComplete) return;

    // stop any existing timer
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setShowTimeUpModal(true);
          return 0;
        }
        timeRemainingRef.current = prev - 1;
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentGame?.isComplete, currentGame?.levelId]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleLetterPress = useCallback((letter: string, index: number) => {
    setCurrentInput(prev => prev + letter);
  }, []);

  const handleClear = useCallback(() => {
    setCurrentInput('');
  }, []);

  const handleSubmit = useCallback(() => {
    if (currentInput.length === 0 || !currentGame) return;

    const result = submitWord(currentInput);

    if (result.success) {
      if (currentGame.solvedWords.length + 1 === currentGame.wordsToGuess.length) {
        if (timerRef.current) clearInterval(timerRef.current);
        const timeUsed = currentGame.totalTime - timeRemainingRef.current;
        const data = completeLevel(timeUsed);
        setCompletionData(data);
        setShowCompleteModal(true);
      }
    } else {
      setWrongWord(true);
      setTimeout(() => setWrongWord(false), 500);
    }

    setCurrentInput('');
  }, [currentInput, currentGame, submitWord, completeLevel]);

  const handleHint = useCallback(() => {
    if (progress.coins < 100) {
      Alert.alert(
        'Not Enough Coins',
        `You need 100 coins for a hint. You have ${progress.coins} coins.\n\nWatch a video ad to earn ${adService.getRewardAmount()} coins!`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Watch Video',
            onPress: async () => {
              const result = await adService.showRewardedAd(adUnits);
              if (result.success && result.coins > 0) {
                // Reward is given by the ad service
                addCoins(result.coins);
                Alert.alert('Coins Earned!', `You earned ${result.coins} coins!`);
              } else if (result.offline) {
                Alert.alert('Offline', 'Hints are not available offline. Please connect to the internet to earn coins.');
              } else {
                Alert.alert('Error', 'Failed to load ad. Please try again.');
              }
            }
          },
          { text: 'Go to Shop', onPress: () => navigation.navigate('Shop') },
        ]
      );
      return;
    }
    setShowHintModal(true);
  }, [progress.coins, navigation]);

  const confirmHint = useCallback(() => {
    const result = useHint();
    setShowHintModal(false);

    if (result.success && result.revealedWord) {
      if (currentGame && currentGame.solvedWords.length + 1 === currentGame.wordsToGuess.length) {
        if (timerRef.current) clearInterval(timerRef.current);
        const timeUsed = currentGame.totalTime - timeRemainingRef.current;
        const data = completeLevel(timeUsed);
        setCompletionData(data);
        setShowCompleteModal(true);
      }
    }
  }, [useHint, currentGame, completeLevel]);

  const handleNextLevel = useCallback(async () => {
    setShowCompleteModal(false);

    // Show interstitial ad after every 2 completed games
    if (progress.gamesCompletedSinceLastAd >= 2) {
      console.log('[GameScreen] Showing interstitial ad after 2 games');
      await adService.showInterstitialAd(adUnits);
      resetAdCounter();
    }

    navigation.navigate('Game', { levelId: levelId + 1 });
  }, [levelId, navigation, progress.gamesCompletedSinceLastAd, resetAdCounter]);

  if (!currentGame) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  const usedLetters = currentInput.split('');
  const remainingLetters = [...currentGame.availableLetters];
  usedLetters.forEach(letter => {
    const idx = remainingLetters.findIndex(l => l === letter);
    if (idx !== -1) remainingLetters.splice(idx, 1);
  });

  const timerColor = timeRemaining <= currentGame.totalTime * 0.2 ? '#ef4444' : '#1e293b';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Home')}>
          {/* <Text style={styles.homeIcon}>🏠</Text> */}
          <Image source={Home} style={{ width: '100%', height: '100%' }} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.coinsButton} onPress={() => navigation.navigate('Shop')}>
          {/* <Text style={styles.coinIcon}>🪙</Text> */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Image source={Coin} style={{ width: 30, height: 30 }} />
            <Text style={styles.coinText}>{progress.coins}</Text>
          </View>
          {/* <Text style={styles.shopIcon}>🛒</Text> */}
          <Image source={Shop} style={{ width: 30, height: 30 }} />
        </TouchableOpacity>
      </View>

      <View style={styles.levelTimerRow}>
        <Text style={styles.levelText}>Level {levelId}</Text>

        <View
          style={[
            styles.timer,
            timeRemaining <= currentGame.totalTime * 0.2 && styles.timerDanger,
          ]}
        >
          <Text style={styles.timerIcon}>⏱</Text>
          <Text style={[styles.timerText, { color: timerColor }]}>
            {formatTime(timeRemaining)}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.wordsCard}>
          <View style={styles.wordsHeader}>
            <Text style={styles.wordsCount}>
              {currentGame.solvedWords.length} / {currentGame.wordsToGuess.length} words
            </Text>
          </View>

          <View style={styles.wordsList}>
            {currentGame.wordsToGuess.map((word, idx) => {
              const isSolved = currentGame.solvedWords.includes(word);

              return (
                <View
                  key={idx}
                  style={[
                    styles.wordSlot,
                    isSolved && styles.wordSlotSolved,
                  ]}
                >
                  {isSolved ? (
                    <Text style={styles.wordSolvedText}>{word}</Text>
                  ) : (
                    <View style={styles.wordPlaceholder}>
                      {Array.from({ length: word.length }).map((_, i) => (
                        <View key={i} style={styles.letterBox} />
                      ))}
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        </View>

        <View style={[styles.inputDisplay, wrongWord && styles.inputDisplayWrong]}>
          {currentInput.length > 0 ? (
            <View style={styles.inputLetters}>
              {currentInput.split('').map((letter, idx) => (
                <View key={idx} style={styles.inputLetter}>
                  <Text style={styles.inputLetterText}>{letter}</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.inputPlaceholder}>Tap letters to form a word</Text>
          )}
        </View>

        <View style={styles.lettersGrid}>
          {remainingLetters.map((letter, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.letterTile}
              onPress={() => handleLetterPress(letter, idx)}
            >
              <Text style={styles.letterText}>{letter}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleClear}>
            {/* <Text style={styles.actionIcon}>🔄</Text>
            <Text style={styles.actionText}>Clear</Text> */}
            <Image source={Retry} style={{ width: 50, height: 50 }}></Image>
          </TouchableOpacity>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitText}>Submit</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleHint}>
            <Image source={Hint} style={{ width: 50, height: 50 }}></Image>
            {/* <Text style={styles.actionIcon}>💡</Text>
            <Text style={styles.actionText}>Hint</Text> */}
          </TouchableOpacity>
        </View>
      </View>

      {adUnits && adUnits.banner && (<View style={styles.bannerContainer}>
        <BannerAd
          unitId={adService.getBannerAdsUnitId(adUnits.banner)}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          requestOptions={{
            requestNonPersonalizedAdsOnly: false,
          }}
          onAdLoaded={() => {
            console.log('[GameScreen] Banner ad loaded');
          }}
          onAdFailedToLoad={(error) => {
            console.error('[GameScreen] Banner ad failed to load:', error);
          }}
        />
      </View>
      )}

      <Modal visible={showTimeUpModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.timeUpModal}>
            <Text style={styles.timeUpTitle}>⏰ Time’s Up!</Text>
            <Text style={styles.timeUpText}>You ran out of time</Text>

            <View style={styles.timeUpActions}>
              {/* Retry */}
              <TouchableOpacity
                style={styles.timeUpButton}
                onPress={() => {
                  setShowTimeUpModal(false);
                  if (timerRef.current !== null) {
                    setTimeRemaining(0);
                    clearInterval(timerRef.current);
                    timerRef.current = null;
                    timeRemainingRef.current = 0;
                  }

                  setTimeout(() => { navigation.replace('Game', { levelId }) }, 100);
                }}
              >
                <Image source={Retry} style={styles.timeUpIcon} />
                <Text style={styles.timeUpButtonText}>Retry</Text>
              </TouchableOpacity>

              {/* Home */}
              <TouchableOpacity
                style={styles.timeUpButton}
                onPress={() => {
                  setShowTimeUpModal(false);
                  navigation.navigate('Home');
                }}
              >
                <Image source={Home} style={styles.timeUpIcon} />
                <Text style={styles.timeUpButtonText}>Home</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={showHintModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Use Hint?</Text>
            <Text style={styles.modalText}>Spend 100 coins to reveal one word?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButtonCancel} onPress={() => setShowHintModal(false)}>
                <Text style={styles.modalButtonCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButtonConfirm} onPress={confirmHint}>
                <Text style={styles.modalButtonConfirmText}>Use Hint (-100)</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={showCompleteModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.completeIcon}>🎉</Text>
            <Text style={styles.modalTitle}>Level Complete!</Text>
            {completionData && (
              <View style={styles.rewardsList}>
                <View style={styles.rewardRow}>
                  <Text style={styles.rewardLabel}>Words Solved</Text>
                  <Text style={styles.rewardValue}>+{completionData.baseCoins}</Text>
                </View>
                {completionData.bonusCoins > 0 && (
                  <View style={styles.rewardRow}>
                    <Text style={styles.rewardLabel}>Speed Bonus</Text>
                    <Text style={[styles.rewardValue, styles.bonusValue]}>+{completionData.bonusCoins}</Text>
                  </View>
                )}
                <View style={[styles.rewardRow, styles.totalRow]}>
                  <Text style={styles.totalLabel}>Total</Text>
                  <Text style={styles.totalValue}>+{completionData.totalCoins} coins</Text>
                </View>
              </View>
            )}
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButtonCancel} onPress={() => navigation.navigate('Home')}>
                <Text style={styles.modalButtonCancelText}>Home</Text>
              </TouchableOpacity>
              {levelId < 50 && (
                <TouchableOpacity style={styles.modalButtonConfirm} onPress={handleNextLevel}>
                  <Text style={styles.modalButtonConfirmText}>Next Level</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const screenWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6d476',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  homeIcon: {
    fontSize: 20,
  },
  levelTimerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 14,
    marginBottom: 0,
  },

  levelText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1e293b',
  },

  timer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f1f5f9',
    borderRadius: 999,
  },

  timerDanger: {
    backgroundColor: '#fee2e2',
  },

  timerIcon: {
    fontSize: 18,
  },

  timerText: {
    fontSize: 18,
    fontWeight: '800',
  },
  coinsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: '#fef3c7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 8,
  },
  coinIcon: {
    fontSize: 14,
  },
  coinText: {
    fontWeight: 'bold',
    color: '#b45309',
  },
  shopIcon: {
    fontSize: 12,
  },
  content: {
    flex: 1,
    padding: 16,
    gap: 12,
  },
  wordsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },

  wordsHeader: {
    alignItems: 'center',
    marginBottom: 12,
  },

  wordsCount: {
    fontSize: 16,
    fontWeight: '800',
    color: '#334155',
  },

  wordsList: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 5,
  },

  wordSlot: {
    backgroundColor: '#f8fafc',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
  },

  wordSlotSolved: {
    backgroundColor: '#dcfce7',
    borderColor: '#22c55e',
  },

  wordSolvedText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#15803d',
    letterSpacing: 1,
  },

  wordPlaceholder: {
    flexDirection: 'row',
    gap: 6,
  },

  letterBox: {
    width: 22,
    height: 26,
    borderRadius: 6,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#e6a00e',
    shadowColor: '#e6a00e',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  letterDash: {
    width: 20,
    height: 24,
    borderRadius: 4,
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#cbd5f5',
  },
  inputDisplay: {
    minHeight: 60,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  inputDisplayWrong: {
    borderColor: '#ef4444',
    backgroundColor: '#fef2f2',
  },
  inputLetters: {
    flexDirection: 'row',
    gap: 4,
  },
  inputLetter: {
    width: 44,
    height: 44,
    backgroundColor: '#e6a00e',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputLetterText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  inputPlaceholder: {
    color: '#94a3b8',
    fontSize: 16,
  },
  lettersGrid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',          // ✅ key line
    justifyContent: 'center',
    gap: 4,
    paddingHorizontal: 12,
  },
  letterTile: {
    width: Math.min(45, screenWidth / 8),
    height: 45,
    backgroundColor: '#fff',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  letterText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  bannerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f5f9',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingVertical: 8,
    // minHeight: 260,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 8,
  },
  actionButton: {
    alignItems: 'center',
    gap: 4,
  },
  actionIcon: {
    fontSize: 24,
  },
  actionText: {
    fontSize: 12,
    color: '#64748b',
  },
  submitButton: {
    backgroundColor: '#e6a00e',
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 16,
  },
  submitText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    width: '85%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  modalText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButtonCancel: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  modalButtonCancelText: {
    color: '#64748b',
    fontWeight: '600',
  },
  modalButtonConfirm: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#e6a00e',
  },
  modalButtonConfirmText: {
    color: '#fff',
    fontWeight: '600',
  },
  completeIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  rewardsList: {
    width: '100%',
    marginBottom: 24,
    gap: 8,
  },
  rewardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  rewardLabel: {
    fontSize: 16,
    color: '#64748b',
  },
  rewardValue: {
    fontSize: 16,
    color: '#22c55e',
    fontWeight: '600',
  },
  bonusValue: {
    color: '#f59e0b',
  },
  totalRow: {
    borderBottomWidth: 0,
    backgroundColor: '#f1f5f9',
    marginHorizontal: -12,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6366f1',
  },
  timeUpModal: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    width: '65%',
    alignItems: 'center',
  },

  timeUpTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ef4444',
    marginBottom: 8,
  },

  timeUpText: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 24,
  },

  timeUpActions: {
    flexDirection: 'row',
    gap: 20,
  },

  timeUpButton: {
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    paddingVertical: 0,
    paddingHorizontal: 0,
    borderRadius: 16,
    width: 110,
  },

  timeUpIcon: {
    width: 36,
    height: 36,
    marginBottom: 6,
  },

  timeUpButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
});
