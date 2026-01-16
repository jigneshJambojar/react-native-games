import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Image, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { useGame } from '../context/GameContext';
import { iapService, COIN_PACKAGES } from '../services/IAPService';
import adService from '../services/AdService';
import { RootStackParamList } from '../../App';
import Coin from '../../assets/coin.png';
import Back from '../../assets/btn-left.png';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function ShopScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { progress, addCoins } = useGame();
  const [watchingAd, setWatchingAd] = useState(false);
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [purchasedCoins, setPurchasedCoins] = useState(0);

  const handleWatchAd = async () => {
    setWatchingAd(true);
    try {
      const result = await adService.showRewardedAd();
      if (result.success && result.coins > 0) {
        // Reward is given by the ad service
        addCoins(result.coins);
        Alert.alert('Reward Earned!', `You earned ${result.coins} coins!`);
      } else if (result.offline) {
        Alert.alert('Offline', 'Ads are not available offline. Please connect to the internet to earn coins.');
      } else {
        Alert.alert('Error', 'Failed to load ad. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load ad. Please try again.');
    } finally {
      setWatchingAd(false);
    }
  };

  const handlePurchase = async (packageId: string) => {
    setPurchasing(packageId);
    try {
      const result = await iapService.purchaseCoins(packageId);
      if (result.success) {
        addCoins(result.coins);
        setPurchasedCoins(result.coins);
        setShowPurchaseModal(true);
        // Alert.alert('Purchase Complete!', `You received ${result.coins} coins!`);
      } else if (result.error) {
        Alert.alert('Purchase Failed', result.error);
      }
    } catch (error) {
      Alert.alert('Error', 'Purchase failed. Please try again.');
    } finally {
      setPurchasing(null);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          {/* <Text style={styles.backIcon}>←</Text> */}
          <Image source={Back} style={{ width: 35, height: 35 }} />
        </TouchableOpacity>

        <Text style={styles.title}>Coin Shop</Text>

        <View style={styles.coinsDisplay}>
          {/* <Text style={styles.coinIcon}>🪙</Text> */}
          <Image source={Coin} style={{ width: 30, height: 30 }} />
          <Text style={styles.coinText}>{progress.coins}</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.adCard}>
            <View style={styles.adIconContainer}>
              <Text style={styles.adIcon}>🎬</Text>
            </View>
            <View style={styles.adInfo}>
              <View style={styles.adTitleRow}>
                {/* <Text style={styles.giftIcon}>🎁</Text> */}
                <Text style={styles.adTitle}>Watch Ad for Free Coins</Text>
              </View>
              <Text style={styles.adDescription}>
                Earn {adService.getRewardAmount()} coins by watching a short video
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.adButton, watchingAd && styles.buttonDisabled]}
              onPress={handleWatchAd}
              disabled={watchingAd}
            >
              {watchingAd ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.adButtonText}>+{adService.getRewardAmount()}</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.sectionHeader}>
            {/* <Text style={styles.packageIcon}>📦</Text> */}
            <Text style={styles.sectionTitle}>Coin Packages</Text>
          </View>

          <View style={styles.packagesGrid}>
            {COIN_PACKAGES.map((pkg) => (
              <TouchableOpacity
                key={pkg.id}
                style={[styles.packageCard, purchasing === pkg.id && styles.packagePurchasing]}
                onPress={() => handlePurchase(pkg.id)}
                disabled={purchasing !== null}
              >
                {pkg.bonus && (
                  <View style={styles.bonusBadge}>
                    <Text style={styles.bonusBadgeText}>{pkg.bonus}</Text>
                  </View>
                )}
                <Text style={styles.packageCoins}>{pkg.coins.toLocaleString()}</Text>
                <Text style={styles.packageLabel}>coins</Text>
                {purchasing === pkg.id ? (
                  <ActivityIndicator style={styles.packagePrice} color="#6366f1" />
                ) : (
                  <Text style={styles.packagePrice}>{pkg.price}</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.noteCard}>
            <Text style={styles.noteIcon}>ℹ️</Text>
            <Text style={styles.noteText}>
              This is a demo app. In-app purchases and rewarded ads are simulated.
              For production, integrate with real payment and ad providers.
            </Text>
          </View>

          <View style={styles.integrationGuide}>
            <Text style={styles.guideTitle}>Integration Notes</Text>
            <Text style={styles.guideText}>
              • In-App Purchases: See IAPService.ts for expo-in-app-purchases integration
            </Text>
            <Text style={styles.guideText}>
              • Rewarded Ads: See AdService.ts for expo-ads-admob integration
            </Text>
            <Text style={styles.guideText}>
              • Configure app.json with your AdMob App ID for production
            </Text>
          </View>
        </View>
      </ScrollView>

      <Modal visible={showPurchaseModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.purchaseModal}>
            <Image
              source={require('../../assets/coin.png')}
              style={styles.purchaseIcon}
            />

            <Text style={styles.purchaseTitle}>Purchase Complete!</Text>

            <Text style={styles.purchaseText}>
              You received <Text style={styles.purchaseCoins}>{purchasedCoins}</Text> coins
            </Text>

            <TouchableOpacity
              style={styles.purchaseButton}
              onPress={() => setShowPurchaseModal(false)}
            >
              <Text style={styles.purchaseButtonText}>Awesome!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
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
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: '#64748b',
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FF7A18',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  coinsDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    paddingHorizontal: 12,
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 16,
    paddingBottom: 32,
  },
  adCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#faf1ea',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e6a00e',
    gap: 12,
  },
  adIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#e6a00e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  adIcon: {
    fontSize: 32,
  },
  adInfo: {
    flex: 1,
  },
  adTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  giftIcon: {
    fontSize: 14,
  },
  adTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  adDescription: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 2,
  },
  adButton: {
    backgroundColor: '#e6a00e',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    minWidth: 60,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  adButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  packageIcon: {
    fontSize: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  packagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  packageCard: {
    width: '47%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  packagePurchasing: {
    opacity: 0.7,
  },
  bonusBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#f59e0b',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  bonusBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  packageCoins: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  packageLabel: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
  },
  packagePrice: {
    fontSize: 18,
    fontWeight: '600',
    color: '#f59e0b',
  },
  noteCard: {
    flexDirection: 'row',
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  noteIcon: {
    fontSize: 16,
  },
  noteText: {
    flex: 1,
    fontSize: 14,
    color: '#92400e',
    lineHeight: 20,
  },
  integrationGuide: {
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  guideTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  guideText: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  purchaseModal: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    width: 260,
    alignItems: 'center',
  },

  purchaseIcon: {
    width: 56,
    height: 56,
    marginBottom: 10,
  },

  purchaseTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#16a34a',
    marginBottom: 6,
  },

  purchaseText: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 16,
  },

  purchaseCoins: {
    fontWeight: 'bold',
    color: '#f59e0b',
  },

  purchaseButton: {
    backgroundColor: '#f59e0b',
    paddingVertical: 10,
    paddingHorizontal: 28,
    borderRadius: 14,
  },

  purchaseButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
});
