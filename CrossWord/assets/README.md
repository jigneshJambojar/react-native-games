# Assets Directory

This directory contains app icons, splash screens, and other media assets.

## Required Assets

To run the app, you'll need to add the following image files:

### App Icons
- `icon.png` - 1024x1024px app icon
- `adaptive-icon.png` - 1024x1024px adaptive icon for Android
- `favicon.png` - 48x48px favicon for web

### Splash Screen
- `splash.png` - 2048x2732px splash screen image

## Quick Setup

### Option 1: Generate with Expo
```bash
npx expo-icon-generator
```

### Option 2: Use Placeholder
Create simple colored squares:
- Use any image editor to create 1024x1024 blue (#007bff) square
- Save as `icon.png` and `adaptive-icon.png`
- Create 2048x2732 blue square for `splash.png`
- Create 48x48 blue square for `favicon.png`

### Option 3: Download Free Icons
- Visit https://www.flaticon.com or https://icons8.com
- Search for "word search" or "puzzle"
- Download and resize to required dimensions

## Sound Effects (Optional)

Place audio files in `sounds/` subdirectory:
- `word-found.mp3` - Played when word is found
- `game-complete.mp3` - Played when puzzle is solved
- `click.mp3` - Button click sound

To add sounds:
1. Install expo-av: `npm install expo-av`
2. Import in components: `import { Audio } from 'expo-av';`
3. Load and play sounds as needed

## Notes

- The app will run without custom assets (Expo provides defaults)
- For production builds, high-quality assets are recommended
- Ensure proper licensing for any downloaded assets
