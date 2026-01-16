# Word Puzzle - React Native Mobile Game

A fun and engaging word puzzle game built with React Native and Expo. Find words from scrambled letters across 50 progressively challenging levels.

## Features

### Game Features
- 🎮 **50 Challenging Levels** - Progressive difficulty from 3 to 7 letter words
- ⏱️ **Timed Gameplay** - Race against the clock to complete each level
- 💰 **Coin System** - Earn coins by completing levels and speed bonuses
- 💡 **Hint System** - Use coins to reveal words when stuck
- 📊 **Progress Tracking** - Your progress is automatically saved
- 🎯 **Level Selection** - Choose from unlocked levels

### Monetization Features
- 📱 **Banner Ads** - 300x250 medium rectangle ads on game screen
- 🎬 **Interstitial Ads** - Full-screen ads after every 2 completed games
- 🎁 **Rewarded Ads** - Watch ads to earn coins
- 🛒 **In-App Purchases** - Buy coin packages (simulated for demo)

### Technical Features
- 💾 **Persistent Storage** - Game progress saved using AsyncStorage
- 📱 **AdMob Integration** - Google Mobile Ads SDK v14.3.1
- 🎨 **Modern UI** - Clean, responsive design with smooth animations
- 📈 **Progress Dashboard** - Track completed levels and coins

## Tech Stack

- **Framework:** React Native 0.76.9
- **Development:** Expo SDK ~52.0.0
- **Language:** TypeScript
- **State Management:** React Context API
- **Navigation:** React Navigation
- **Ads:** react-native-google-mobile-ads 14.3.1
- **Storage:** @react-native-async-storage/async-storage
- **Data Fetching:** TanStack React Query

## Installation

```bash
# Install dependencies
npm install

# Start development server
npm start
```

## Building for Production

### Android APK

```bash
# Generate native Android project
npx expo prebuild --platform android

# Build release APK
cd android
JAVA_HOME=$(/usr/libexec/java_home -v 17) ./gradlew assembleRelease

# APK Location: android/app/build/outputs/apk/release/app-release.apk
```

## AdMob Configuration

Currently using test ad units. For production:
1. Create AdMob account at https://admob.google.com
2. Update app IDs in `app.json`
3. Update ad unit IDs in `src/services/AdService.ts`

## Project Structure

```
src/
├── context/GameContext.tsx    # Game state with persistence
├── screens/                   # App screens
├── services/                  # AdMob & IAP services
└── ...
```

## License

Educational/demonstration purposes.
