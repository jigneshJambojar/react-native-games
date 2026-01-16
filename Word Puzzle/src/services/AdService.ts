/**
 * AdMob Ads Service (Google AdMob)
 * 
 * ADMOB APP ID: ca-app-pub-9084396328078500~6234998527
 * 
 * PRODUCTION AD UNIT IDS (Android):
 * - Banner: ca-app-pub-9084396328078500/2366043889
 * - Interstitial: ca-app-pub-9084396328078500/7652021976
 * - Rewarded: ca-app-pub-9084396328078500/4688954898
 * 
 * NOTE: iOS uses test IDs. Update with real iOS IDs when ready.
 * 
 * ⚠️ IMPORTANT: New ad units may take up to 24 hours to serve ads.
 * During this time, you may see "No fill" errors - this is normal.
 */

import { Platform } from 'react-native';
import mobileAds from 'react-native-google-mobile-ads';
import { RewardedAd, RewardedAdEventType, InterstitialAd, AdEventType } from 'react-native-google-mobile-ads';
import NetInfo from '@react-native-community/netinfo';

const AD_UNIT_IDS = {
  banner: Platform.select({
    ios: 'ca-app-pub-3940256099942544/6300978111', // Test ID for iOS
    android: 'ca-app-pub-9084396328078500/2366043889', // Production ID for Android
    default: 'ca-app-pub-9084396328078500/2366043889',
  }) as string,
  interstitial: Platform.select({
    ios: 'ca-app-pub-3940256099942544/4411468910', // Test ID for iOS
    android: 'ca-app-pub-9084396328078500/7652021976', // Production ID for Android
    default: 'ca-app-pub-9084396328078500/7652021976',
  }) as string,
  rewarded: Platform.select({
    ios: 'ca-app-pub-3940256099942544/1712485313', // Test ID for iOS
    android: 'ca-app-pub-9084396328078500/4688954898', // Production ID for Android
    default: 'ca-app-pub-9084396328078500/4688954898',
  }) as string,
};

const REWARD_AMOUNT = 50;

class AdService {
  private initialized = false;
  private rewardedAdLoaded = false;
  private interstitialAdLoaded = false;
  private rewardedAd: RewardedAd | null = null;
  private interstitialAd: InterstitialAd | null = null;

  /**
   * Initialize the AdMob SDK
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    console.log('[AdService] Initializing Google AdMob SDK...');
    
    try {
      await mobileAds().initialize();
      this.initialized = true;
      console.log('[AdService] AdMob SDK initialized successfully');
      
      // Pre-load ads
      this.loadRewardedAd();
      this.loadInterstitialAd();
    } catch (error) {
      console.error('[AdService] Failed to initialize AdMob:', error);
      throw error;
    }
  }

  /**
   * Load a rewarded ad
   */
  async loadRewardedAd(): Promise<boolean> {
    if (!this.initialized) {
      await this.initialize();
    }

    console.log('[AdService] Loading rewarded ad with ID:', AD_UNIT_IDS.rewarded);
    
    try {
      // Reset state
      this.rewardedAdLoaded = false;
      
      // Create a new rewarded ad instance
      this.rewardedAd = RewardedAd.createForAdRequest(AD_UNIT_IDS.rewarded, {
        requestNonPersonalizedAdsOnly: false,
      });

      // Set up event listeners
      this.rewardedAd.addAdEventListener(RewardedAdEventType.LOADED, () => {
        this.rewardedAdLoaded = true;
        console.log('[AdService] ✅ Rewarded ad loaded successfully');
      });

      this.rewardedAd.addAdEventListener(RewardedAdEventType.EARNED_REWARD, (reward) => {
        console.log('[AdService] 🎁 User earned reward:', reward);
      });

      // Better error handling
      this.rewardedAd.addAdEventListener(AdEventType.ERROR, (error) => {
        console.error('[AdService] ❌ Rewarded ad error:', error);
        this.rewardedAdLoaded = false;
      });

      this.rewardedAd.addAdEventListener(AdEventType.OPENED, () => {
        console.log('[AdService] 📺 Rewarded ad opened');
      });

      this.rewardedAd.addAdEventListener(AdEventType.CLOSED, () => {
        console.log('[AdService] ⏹️  Rewarded ad closed');
      });

      // Load the ad
      this.rewardedAd.load();
      console.log('[AdService] Rewarded ad load() called');
      
      return true;
    } catch (error) {
      console.error('[AdService] ❌ Failed to load rewarded ad:', error);
      this.rewardedAdLoaded = false;
      return false;
    }
  }

  /**
   * Load an interstitial ad
   */
  async loadInterstitialAd(): Promise<boolean> {
    if (!this.initialized) {
      await this.initialize();
    }

    console.log('[AdService] Loading interstitial ad...');
    
    try {
      // Create a new interstitial ad instance
      this.interstitialAd = InterstitialAd.createForAdRequest(AD_UNIT_IDS.interstitial, {
        requestNonPersonalizedAdsOnly: false,
      });

      // Set up event listeners
      this.interstitialAd.addAdEventListener(AdEventType.LOADED, () => {
        this.interstitialAdLoaded = true;
        console.log('[AdService] Interstitial ad loaded successfully');
      });

      const unsubscribeError = this.interstitialAd.addAdEventsListener((event) => {
        if (event.type === 'error') {
          console.error('[AdService] Interstitial ad error:', event.error);
          this.interstitialAdLoaded = false;
        }
      });

      // Load the ad
      this.interstitialAd.load();
      
      return true;
    } catch (error) {
      console.error('[AdService] Failed to load interstitial ad:', error);
      this.interstitialAdLoaded = false;
      return false;
    }
  }

  /**
   * Check if device is connected to the internet
   */
  async isConnected(): Promise<boolean> {
    try {
      const netInfoState = await NetInfo.fetch();
      return netInfoState.isConnected ?? false;
    } catch (error) {
      console.error('[AdService] Error checking network connectivity:', error);
      return false;
    }
  }

  /**
   * Show an interstitial ad
   */
  async showInterstitialAd(): Promise<{ success: boolean; offline?: boolean }> {
    // Check network connectivity first
    const connected = await this.isConnected();
    if (!connected) {
      console.log('[AdService] Device is offline, cannot show ad');
      return { success: false, offline: true };
    }

    if (!this.interstitialAdLoaded || !this.interstitialAd) {
      console.log('[AdService] No interstitial ad loaded, loading now...');
      await this.loadInterstitialAd();
      
      // Wait for ad to load (with timeout)
      const timeout = 10000; // 10 seconds
      const startTime = Date.now();
      while (!this.interstitialAdLoaded && Date.now() - startTime < timeout) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      if (!this.interstitialAdLoaded) {
        console.error('[AdService] Failed to load interstitial ad in time');
        return { success: false, offline: false };
      }
    }

    console.log('[AdService] Showing interstitial ad...');
    
    return new Promise((resolve) => {
      if (!this.interstitialAd) {
        resolve({ success: false, offline: false });
        return;
      }

      // Listen for ad closed event
      const unsubscribeClosed = this.interstitialAd.addAdEventListener(
        AdEventType.CLOSED,
        () => {
          console.log('[AdService] Interstitial ad closed');
          unsubscribeClosed();
          this.interstitialAdLoaded = false;
          // Pre-load next ad
          this.loadInterstitialAd();
          resolve({ success: true, offline: false });
        }
      );

      // Show the ad
      try {
        this.interstitialAd.show();
      } catch (error) {
        console.error('[AdService] Failed to show interstitial ad:', error);
        unsubscribeClosed();
        resolve({ success: false, offline: false });
      }
    });
  }

  /**
   * Show a rewarded ad and return the reward
   */
  async showRewardedAd(): Promise<{ success: boolean; coins: number; offline?: boolean }> {
    // Check network connectivity first
    const connected = await this.isConnected();
    if (!connected) {
      console.log('[AdService] Device is offline, cannot show ad');
      return { success: false, coins: 0, offline: true };
    }

    if (!this.rewardedAdLoaded || !this.rewardedAd) {
      console.log('[AdService] No rewarded ad loaded, loading now...');
      await this.loadRewardedAd();
      
      // Wait for ad to load (with timeout)
      const timeout = 10000; // 10 seconds
      const startTime = Date.now();
      while (!this.rewardedAdLoaded && Date.now() - startTime < timeout) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      if (!this.rewardedAdLoaded) {
        console.error('[AdService] Failed to load rewarded ad in time');
        return { success: false, coins: 0, offline: false };
      }
    }

    console.log('[AdService] Showing rewarded ad...');
    
    return new Promise((resolve) => {
      if (!this.rewardedAd) {
        resolve({ success: false, coins: 0, offline: false });
        return;
      }

      let rewardEarned = false;

      // Listen for reward earned event
      const unsubscribeEarned = this.rewardedAd.addAdEventListener(
        RewardedAdEventType.EARNED_REWARD,
        (reward) => {
          console.log(`[AdService] User earned reward:`, reward);
          console.log(`[AdService] Rewarding ${REWARD_AMOUNT} coins`);
          rewardEarned = true;
        }
      );

      // Listen for ad closed event
      const unsubscribeClosed = this.rewardedAd.addAdEventListener(
        AdEventType.CLOSED,
        () => {
          console.log('[AdService] Rewarded ad closed');
          unsubscribeEarned();
          unsubscribeClosed();
          this.rewardedAdLoaded = false;
          
          // Pre-load next ad
          this.loadRewardedAd();
          
          // Resolve with reward status
          if (rewardEarned) {
            console.log('[AdService] Resolving with reward');
            resolve({ success: true, coins: REWARD_AMOUNT, offline: false });
          } else {
            console.log('[AdService] Ad closed without earning reward');
            resolve({ success: false, coins: 0, offline: false });
          }
        }
      );

      // Show the ad
      try {
        this.rewardedAd.show();
      } catch (error) {
        console.error('[AdService] Failed to show rewarded ad:', error);
        unsubscribeEarned();
        unsubscribeClosed();
        resolve({ success: false, coins: 0, offline: false });
      }
    });
  }

  isRewardedAdReady(): boolean {
    return this.rewardedAdLoaded;
  }

  isInterstitialAdReady(): boolean {
    return this.interstitialAdLoaded;
  }

  getBannerAdUnitId(): string {
    return AD_UNIT_IDS.banner;
  }

  getRewardAmount(): number {
    return REWARD_AMOUNT;
  }
}

export const adService = new AdService();
export default adService;
