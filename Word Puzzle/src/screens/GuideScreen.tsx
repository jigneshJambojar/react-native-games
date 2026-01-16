import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../App';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function GuideScreen() {
  const navigation = useNavigation<NavigationProp>();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Word Puzzle</Text>
            <Text style={styles.subtitle}>Unscramble words and beat the clock!</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.sectionIcon}>🎯</Text>
              <Text style={styles.cardTitle}>How to Play</Text>
            </View>
            <View style={styles.stepsList}>
              <View style={styles.step}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>1</Text>
                </View>
                <Text style={styles.stepText}>Tap the letter tiles to form words from the scrambled letters.</Text>
              </View>
              <View style={styles.step}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>2</Text>
                </View>
                <Text style={styles.stepText}>Submit each word before the timer runs out.</Text>
              </View>
              <View style={styles.step}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>3</Text>
                </View>
                <Text style={styles.stepText}>Solve all words in a level to unlock the next one.</Text>
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.sectionIcon}>🪙</Text>
              <Text style={styles.cardTitle}>Earning Coins</Text>
            </View>
            <View style={styles.rewardRow}>
              <View style={styles.rewardInfo}>
                <Text style={styles.rewardAmount}>+10</Text>
                <Text style={styles.rewardUnit}>coins</Text>
              </View>
              <Text style={styles.rewardDesc}>per word solved</Text>
            </View>
            <View style={styles.rewardRow}>
              <View style={styles.rewardInfo}>
                <Text style={styles.bonusIcon}>⚡</Text>
                <Text style={styles.bonusAmount}>+10%</Text>
                <Text style={styles.rewardUnit}>bonus</Text>
              </View>
              <Text style={styles.rewardDesc}>complete quickly</Text>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.sectionIcon}>💡</Text>
              <Text style={styles.cardTitle}>Using Hints</Text>
            </View>
            <View style={styles.rewardRow}>
              <View style={styles.rewardInfo}>
                <Text style={styles.costAmount}>-100</Text>
                <Text style={styles.rewardUnit}>coins</Text>
              </View>
              <Text style={styles.rewardDesc}>reveals one word</Text>
            </View>
            <Text style={styles.hintNote}>
              Stuck on a word? Use a hint to reveal it instantly, but it will cost you coins!
            </Text>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.sectionIcon}>📈</Text>
              <Text style={styles.cardTitle}>Level Progression</Text>
            </View>
            <View style={styles.levelsList}>
              <View style={styles.levelRow}>
                <Text style={styles.levelRange}>Levels 1-5</Text>
                <Text style={styles.levelInfo}>2 words, 3 letters</Text>
              </View>
              <View style={styles.levelRow}>
                <Text style={styles.levelRange}>Levels 6-10</Text>
                <Text style={styles.levelInfo}>3 words, 3 letters</Text>
              </View>
              <View style={styles.levelRow}>
                <Text style={styles.levelRange}>Levels 11-20</Text>
                <Text style={styles.levelInfo}>3-4 words, 4 letters</Text>
              </View>
              <View style={styles.levelRow}>
                <Text style={styles.levelRange}>Levels 21-30</Text>
                <Text style={styles.levelInfo}>4-5 words, 5 letters</Text>
              </View>
              <View style={styles.levelRow}>
                <Text style={styles.levelRange}>Levels 31-50</Text>
                <Text style={styles.levelInfo}>5-7 words, 6-7 letters</Text>
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.sectionIcon}>🏆</Text>
              <Text style={styles.cardTitle}>Tips for Success</Text>
            </View>
            <View style={styles.tipsList}>
              <Text style={styles.tipItem}>• Start with shorter words if you're stuck</Text>
              <Text style={styles.tipItem}>• Look for common letter patterns</Text>
              <Text style={styles.tipItem}>• Complete levels fast for bonus coins</Text>
              <Text style={styles.tipItem}>• Save hints for the hardest levels</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.startButton} onPress={() => navigation.navigate('Home')}>
            <Text style={styles.startButtonText}>Start Playing</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 16,
    paddingBottom: 32,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionIcon: {
    fontSize: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
  },
  stepsList: {
    gap: 12,
  },
  step: {
    flexDirection: 'row',
    gap: 12,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#eef2ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#6366f1',
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
  },
  rewardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  rewardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rewardAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#22c55e',
  },
  costAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ef4444',
  },
  bonusIcon: {
    fontSize: 14,
  },
  bonusAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f59e0b',
  },
  rewardUnit: {
    fontSize: 14,
    color: '#64748b',
  },
  rewardDesc: {
    fontSize: 14,
    color: '#64748b',
  },
  hintNote: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 8,
    lineHeight: 20,
  },
  levelsList: {
    gap: 8,
  },
  levelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  levelRange: {
    fontSize: 14,
    color: '#64748b',
  },
  levelInfo: {
    fontSize: 14,
    color: '#1e293b',
    fontWeight: '500',
  },
  tipsList: {
    gap: 8,
  },
  tipItem: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  startButton: {
    backgroundColor: '#6366f1',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
