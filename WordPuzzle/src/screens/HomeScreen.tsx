import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { useGame } from '../context/GameContext';
import { RootStackParamList } from '../../App';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import adService from '../services/AdService';
// import Info from '../../assets/button-info.png';
import Coin from '../../assets/coin.png';
import Shop from '../../assets/btn-shop.png';
import WINS from '../../assets/btn-achievements.png';
import Lock from '../../assets/lock.png';
import { useEffect, useState } from 'react';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { levels, progress } = useGame();
  const [hasAd, setHasAd] = useState(false);
  const [adUnits, setAdUnits] = useState(null);

  useEffect(() => {
    fetch('https://d22swxawtpfyg.cloudfront.net/react-native-game-settings/word-puzzle-adunit.json?v=' + new Date())
      .then(res => res.json())
      .then(json => {
        setAdUnits(json.banner);
      })
      .catch(err => console.log('Failed to load ads', err.message));
  }, []);

  const getLevelStatus = (levelId: number) => {
    if (progress.completedLevels.includes(levelId)) return 'completed';
    if (levelId === progress.currentLevel) return 'current';
    if (levelId < progress.currentLevel) return 'completed';
    return 'locked';
  };

  const handleLevelPress = (levelId: number) => {
    const status = getLevelStatus(levelId);
    if (status !== 'locked') {
      navigation.navigate('Game', { levelId });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>

        <View style={styles.logoContainer}>
          <View style={styles.wordContainer}>
            <Text style={styles.strokeText}>WORD</Text>
            <Text style={styles.fillText}>WORD</Text>
          </View>

          <View style={styles.wordContainer}>
            <Text style={styles.strokeText}>Puzzle</Text>
            <Text style={styles.fillText}>Puzzle</Text>
          </View>
        </View>

        {/* <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>W</Text>
          </View>
          <Text style={styles.title}>Word Puzzle</Text>
        </View> */}

        <View style={styles.headerButtons}>
          {/* <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate('Guide')}
          >
            <Image source={Info} style={{ width: 25, height: 25, marginTop: 5 }} />
          </TouchableOpacity> */}
          <TouchableOpacity
            style={styles.coinsButton}
            onPress={() => navigation.navigate('Shop')}
          >
            {/* <Text style={styles.coinIcon}>🪙</Text> */}
            <Image source={Coin} style={{ width: 25, height: 25, marginTop: 3 }} />
            <View style={styles.numberWrapper}>
              <Text style={styles.stroke}>{progress.coins}</Text>
              <Text style={styles.fill}>{progress.coins}</Text>
            </View>
            {/* <Text style={styles.coinText}>{progress.coins}</Text> */}
            <Image source={Shop} style={{ width: 25, height: 25, marginTop: 3, marginLeft: 10 }} />
            {/* <Text style={styles.shopIcon}>🛒</Text> */}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.progressCard}>
        <View style={styles.progressIcon}>
          <Image source={WINS} style={{ width: 60, height: 60 }} />
          {/* <Text style={styles.trophyIcon}>🏆</Text> */}
        </View>
        <View style={styles.progressInfo}>
          <Text style={styles.progressLabel}>Progress</Text>
          <Text style={styles.progressText}>
            {progress.completedLevels.length} / {levels.length} Levels
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${(progress.completedLevels.length / levels.length) * 100}%` },
              ]}
            />
          </View>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Levels</Text>

      <ScrollView style={styles.levelsContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.levelsGrid}>
          {levels.map((level) => {
            const status = getLevelStatus(level.id);
            return (
              <TouchableOpacity
                key={level.id}
                style={[
                  styles.levelButton,
                  status === 'completed' && styles.levelCompleted,
                  status === 'current' && styles.levelCurrent,
                  status === 'locked' && styles.levelLocked,
                ]}
                onPress={() => handleLevelPress(level.id)}
                disabled={status === 'locked'}
              >
                {status === 'completed' ? (
                  <>
                    <Text style={styles.checkIcon}>✓</Text>
                    <Text style={styles.levelNumberSmall}>{level.id}</Text>
                  </>
                ) : status === 'current' ? (
                  <>
                    <Text style={styles.levelNumberCurrent}>{level.id}</Text>
                    {/* <Text style={styles.playText}>Play</Text> */}
                  </>
                ) : (
                  <>
                    <Image source={Lock} style={{ width: 60, height: 60 }} />
                    {/* <Text style={styles.levelNumberLocked}>{level.id}</Text> */}
                  </>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {adUnits && (<View style={[styles.stickyAd, { display: hasAd ? 'flex' : 'none' }]}>
        <BannerAd
          unitId={adService.getBannerAdsUnitId(adUnits)}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          requestOptions={{
            requestNonPersonalizedAdsOnly: false,
          }}
          onAdLoaded={() => setHasAd(true)}
          onAdFailedToLoad={() => setHasAd(false)}
        />
      </View>
      )}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffedbb',
  },
  stickyAd: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 110,              // ✅ FIXED HEIGHT
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffedbb',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  wordContainer: {
    position: 'relative',
    marginVertical: 4,
  },

  // BLACK OUTLINE (STROKE)
  strokeText: {
    position: 'absolute',
    fontSize: 28,
    fontWeight: '900',
    color: '#000',
    letterSpacing: 2,
    textTransform: 'uppercase',

    // Stroke simulation
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 1,
  },

  numberWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // BLACK OUTLINE
  stroke: {
    position: 'absolute',
    fontSize: 20,
    fontWeight: '900',
    color: '#000',
    textAlign: 'center',

    textShadowColor: '#000',
    textShadowOffset: { width: 1.5, height: 1.5 },
    textShadowRadius: 1,
  },

  // WHITE FILL
  fill: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FF7A18',
    textAlign: 'center',
  },

  // ORANGE FILL
  fillText: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FF7A18',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 0,
  },
  iconButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButtonText: {
    fontSize: 18,
    color: '#64748b',
  },
  coinsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  coinIcon: {
    fontSize: 14,
  },
  coinText: {
    fontWeight: 'bold',
    color: '#FF7A18',
    fontSize: 16,
  },
  shopIcon: {
    fontSize: 12,
  },
  progressCard: {
    flexDirection: 'row',
    margin: 16,
    padding: 16,
    backgroundColor: '#eef2ff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#c7d2fe',
    gap: 16,
  },
  progressIcon: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: '#eef2ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  trophyIcon: {
    fontSize: 32,
  },
  progressInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  progressLabel: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  progressText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#cbd5e1',
    borderRadius: 4,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#e6a00e',
    borderRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  levelsContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  levelsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingBottom: 24,
  },
  levelButton: {
    width: '22%',
    aspectRatio: 1,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 2,
  },
  levelCompleted: {
    backgroundColor: '#dcfce7',
    borderWidth: 2,
    borderColor: '#22c55e',
  },
  levelCurrent: {
    backgroundColor: '#e6a00e',
    shadowColor: '#e6a00e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
    elevation: 8,
  },
  levelLocked: {
    backgroundColor: '#ece5e5',
    borderWidth: 1,
    borderColor: '#cdcdcd',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.6,
    padding: 4,
  },
  checkIcon: {
    fontSize: 24,
    color: '#22c55e',
  },
  levelNumberSmall: {
    fontSize: 12,
    fontWeight: '600',
    color: '#15803d',
  },
  levelNumberCurrent: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  playText: {
    fontSize: 11,
    color: '#fff',
    opacity: 0.8,
  },
  lockIcon: {
    fontSize: 20,
  },
  levelNumberLocked: {
    fontSize: 12,
    color: '#94a3b8',
  },
});
