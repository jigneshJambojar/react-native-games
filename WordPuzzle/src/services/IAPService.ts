/**
 * In-App Purchase Service
 * 
 * NOTE: expo-in-app-purchases requires a DEVELOPMENT BUILD (not Expo Go).
 * You must use EAS Build or build locally.
 * 
 * INTEGRATION STEPS:
 * 1. Install: npx expo install expo-in-app-purchases
 * 
 * 2. Create a development build:
 *    eas build --profile development --platform android
 *    eas build --profile development --platform ios
 * 
 * 3. Configure products in App Store Connect (iOS) and Google Play Console (Android)
 * 
 * 4. Replace mock methods below with actual IAP calls
 * 
 * PRODUCT IDS (configure these in your app stores):
 * - coins500 - 500 coins ($0.99)
 * - coins1000 - 1000 coins ($1.99)
 * - coins2500 - 2500 coins ($3.99)
 * - coins5000 - 5000 coins ($6.99)
 */

export interface CoinPackage {
  id: string;
  coins: number;
  price: string;
  bonus?: string;
  productId: string;
}

export const COIN_PACKAGES: CoinPackage[] = [
  { id: '1', coins: 500, price: '$0.99', productId: 'coins500' },
  { id: '2', coins: 1000, price: '$1.99', bonus: '+10%', productId: 'coins1000' },
  { id: '3', coins: 2500, price: '$3.99', bonus: '+25%', productId: 'coins2500' },
  { id: '4', coins: 5000, price: '$6.99', bonus: '+50%', productId: 'coins5000' },
];

class IAPService {
  private initialized = false;

  /**
   * Initialize the IAP service
   * 
   * TODO: Replace with actual implementation:
   * ```
   * import * as InAppPurchases from 'expo-in-app-purchases';
   * 
   * await InAppPurchases.connectAsync();
   * 
   * InAppPurchases.setPurchaseListener(({ responseCode, results }) => {
   *   if (responseCode === InAppPurchases.IAPResponseCode.OK) {
   *     results?.forEach(purchase => {
   *       // Grant coins to user
   *       // Call InAppPurchases.finishTransactionAsync(purchase, true);
   *     });
   *   }
   * });
   * 
   * const { results } = await InAppPurchases.getProductsAsync(
   *   COIN_PACKAGES.map(p => p.productId)
   * );
   * ```
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;
    
    console.log('[IAPService] Initializing In-App Purchases...');
    
    this.initialized = true;
    console.log('[IAPService] Initialized (mock mode)');
  }

  /**
   * Purchase a coin package
   * 
   * TODO: Replace with actual implementation:
   * ```
   * import * as InAppPurchases from 'expo-in-app-purchases';
   * 
   * await InAppPurchases.purchaseItemAsync(productId);
   * // Results handled by setPurchaseListener
   * ```
   */
  async purchaseCoins(packageId: string): Promise<{ success: boolean; coins: number; error?: string }> {
    const coinPackage = COIN_PACKAGES.find(p => p.id === packageId);
    
    if (!coinPackage) {
      return { success: false, coins: 0, error: 'Package not found' };
    }

    console.log(`[IAPService] Purchasing package: ${coinPackage.productId}`);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const bonusMultiplier = coinPackage.bonus 
      ? 1 + parseInt(coinPackage.bonus.replace(/[^0-9]/g, '')) / 100 
      : 1;
    const totalCoins = Math.floor(coinPackage.coins * bonusMultiplier);
    
    console.log(`[IAPService] Purchase successful: ${totalCoins} coins`);
    
    return { success: true, coins: totalCoins };
  }

  /**
   * Restore previous purchases
   * 
   * TODO: Replace with actual implementation:
   * ```
   * import * as InAppPurchases from 'expo-in-app-purchases';
   * 
   * const { results } = await InAppPurchases.getPurchaseHistoryAsync();
   * ```
   */
  async restorePurchases(): Promise<{ success: boolean; restoredCoins: number }> {
    console.log('[IAPService] Restoring purchases...');
    return { success: true, restoredCoins: 0 };
  }

  async disconnect(): Promise<void> {
    if (!this.initialized) return;
    console.log('[IAPService] Disconnecting...');
    this.initialized = false;
  }
}

export const iapService = new IAPService();
export default iapService;
