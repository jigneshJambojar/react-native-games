# Word Puzzle - React Native / Expo App

A mobile-friendly word puzzle game built with React Native and Expo.

## Getting Started

### Prerequisites
- Node.js 18 or higher
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app on your mobile device (for basic testing)

### Installation

```bash
cd expo-app
npm install
```

### Running the App

```bash
# Start Expo development server
npx expo start

# Or with specific platform
npx expo start --ios
npx expo start --android
```

Scan the QR code with Expo Go app (Android) or Camera app (iOS) to run on your device.

**Note:** For IAP and AdMob features, you need a Development Build (see below).

## Project Structure

```
expo-app/
├── App.tsx                 # Main app with navigation
├── app.json                # Expo configuration
├── package.json            # Dependencies
├── src/
│   ├── context/
│   │   └── GameContext.tsx # Game state management
│   ├── screens/
│   │   ├── HomeScreen.tsx  # Level selection
│   │   ├── GameScreen.tsx  # Main gameplay
│   │   ├── GuideScreen.tsx # How to play
│   │   └── ShopScreen.tsx  # Coin shop
│   └── services/
│       ├── IAPService.ts   # In-app purchases (placeholder)
│       └── AdService.ts    # Rewarded ads (placeholder)
└── assets/                 # App icons and splash screens
```

## In-App Purchases Integration

The `IAPService.ts` file provides a placeholder for in-app purchases using `expo-in-app-purchases`.

**Important:** IAP requires a Development Build - it won't work in Expo Go.

### Setup Steps

1. Install the package:
   ```bash
   npx expo install expo-in-app-purchases
   ```

2. Create a development build:
   ```bash
   eas build --profile development --platform android
   eas build --profile development --platform ios
   ```

3. Configure products in App Store Connect (iOS) and Google Play Console (Android):
   - `coins500` - 500 coins ($0.99)
   - `coins1000` - 1000 coins ($1.99)
   - `coins2500` - 2500 coins ($3.99)
   - `coins5000` - 5000 coins ($6.99)

4. Replace the mock implementation in `IAPService.ts` with actual calls:
   ```typescript
   import * as InAppPurchases from 'expo-in-app-purchases';
   
   // Initialize
   await InAppPurchases.connectAsync();
   
   // Purchase
   await InAppPurchases.purchaseItemAsync(productId);
   ```

## Rewarded Ads (Google AdMob) Integration

The `AdService.ts` file provides a placeholder for rewarded video ads.

**Important:** `expo-ads-admob` is DEPRECATED. Use `react-native-google-mobile-ads` instead.
This requires a Development Build - it won't work in Expo Go.

### Setup Steps

1. Install the package:
   ```bash
   npx expo install react-native-google-mobile-ads
   ```

2. Create an AdMob account at https://admob.google.com

3. Add your app (iOS and Android) and create rewarded ad units

4. Update `app.json` with the plugin:
   ```json
   {
     "expo": {
       "plugins": [
         [
           "react-native-google-mobile-ads",
           {
             "androidAppId": "ca-app-pub-XXXXXXXX~YYYYYYYY",
             "iosAppId": "ca-app-pub-XXXXXXXX~YYYYYYYY"
           }
         ]
       ]
     }
   }
   ```

5. Create a development build:
   ```bash
   eas build --profile development --platform android
   eas build --profile development --platform ios
   ```

6. Replace mock implementation with actual AdMob calls:
   ```typescript
   import mobileAds, { RewardedAd, RewardedAdEventType, TestIds } from 'react-native-google-mobile-ads';
   
   // Initialize (call once at app startup)
   await mobileAds().initialize();
   
   // Create rewarded ad
   const rewarded = RewardedAd.createForAdRequest(TestIds.REWARDED, {
     requestNonPersonalizedAdsOnly: true,
   });
   
   // Listen for events
   rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
     console.log('Ad loaded');
   });
   
   rewarded.addAdEventListener(RewardedAdEventType.EARNED_REWARD, (reward) => {
     console.log('User earned reward:', reward);
   });
   
   // Load and show
   rewarded.load();
   rewarded.show();
   ```

### Test Ad Unit IDs (for development)

- iOS Rewarded: `ca-app-pub-3940256099942544/1712485313`
- Android Rewarded: `ca-app-pub-3940256099942544/5224354917`

Or use the built-in `TestIds.REWARDED` constant from the package.

## Building for Production

### Using EAS Build (Recommended)

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure build
eas build:configure

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```

### App Store / Play Store Submission

1. Update `app.json` with your app details
2. Replace placeholder icons in `assets/`
3. Configure IAP products in respective stores
4. Set up AdMob with production ad unit IDs
5. Remove test ad unit IDs before submission

## Features

- 50 levels with progressive difficulty
- Coin reward system (+10 coins per word, +10% speed bonus)
- Hint system (-100 coins to reveal a word)
- In-app purchases for coins (placeholder)
- Rewarded ads for free coins (placeholder)
- Dark/light mode support (via system settings)

## Notes

- The game logic runs entirely on-device (no backend required)
- Progress is stored in React state (add AsyncStorage for persistence)
- IAP and ads are simulated in development mode
- Native features (IAP, AdMob) require Development Builds, not Expo Go
