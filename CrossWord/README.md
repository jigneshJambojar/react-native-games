# Word Search Ultimate - React Native

A smooth and extensible word search puzzle game converted from HTML5 to React Native. Features multiple categories, difficulty levels, and time-based scoring.

## 🎮 Features

- **10 Categories**: Painters, Bible, Internet, Card Games, Countries of Asia, Artists, Composers, European Capitals, Occupations, and Whales
- **3 Difficulty Levels**: Easy (10x10), Medium (12x12), Hard (15x15)
- **8-Directional Word Placement**: Horizontal, vertical, diagonal, and backwards
- **Smooth Touch Controls**: Drag to select words with visual feedback
- **Progress Tracking**: Timer, progress bar, and best time records
- **Persistent Storage**: Best times saved locally using AsyncStorage
- **Responsive Design**: Adapts to different screen sizes
- **Clean Architecture**: Modular code structure for easy enhancement

## 📁 Project Structure

```
WordSearchGame/
├── App.js                          # Main app entry point with navigation
├── package.json                    # Dependencies and scripts
├── app.json                        # Expo configuration
├── assets/                         # Images and sounds
│   └── sounds/                     # Sound effects (optional)
├── src/
│   ├── components/
│   │   ├── WordGrid.js            # Interactive letter grid with gestures
│   │   ├── WordList.js            # Display of words to find
│   │   └── GameHeader.js          # Timer, progress, and controls
│   ├── screens/
│   │   ├── CategoryScreen.js      # Category and difficulty selection
│   │   └── GameScreen.js          # Main game screen
│   ├── utils/
│   │   └── wordGenerator.js       # Grid generation and validation logic
│   ├── context/
│   │   └── GameContext.js         # Global state management
│   └── constants/
│       └── categoryData.js        # Word lists and categories
```

## 🚀 Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI (will be installed automatically)
- iOS Simulator (Mac only) or Android Emulator

### Installation

1. **Navigate to the project directory:**
   ```bash
   cd WordSearchGame
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

4. **Run on your device:**
   - **iOS Simulator**: Press `i` in the terminal
   - **Android Emulator**: Press `a` in the terminal
   - **Physical Device**: Scan the QR code with Expo Go app

## 🎯 How to Play

1. **Select a Category**: Choose from 10 different word categories
2. **Choose Difficulty**: Pick Easy, Medium, or Hard
3. **Find Words**: Drag your finger across letters to select words
4. **Complete Puzzle**: Find all words as quickly as possible
5. **Beat Your Best Time**: Try to improve your record!

### Game Controls

- **Drag**: Select letters to form words
- **Pause**: Tap the pause button in the header
- **Back**: Return to category selection (confirms exit)

## 🛠️ Easy Customization

### Adding New Categories

Edit `src/constants/categoryData.js`:

```javascript
export const CATEGORIES = {
  YourCategory: {
    name: 'YourCategory',
    displayName: 'Your Category Name',
    difficulties: {
      easy: ['word1', 'word2', 'word3', ...],
      medium: ['longer1', 'longer2', ...],
      hard: ['evenmore1', 'evenmore2', ...]
    }
  }
};
```

### Adjusting Grid Sizes

Modify grid sizes in `src/constants/categoryData.js`:

```javascript
export const GRID_SIZES = {
  easy: 10,    // Change to your preferred size
  medium: 12,
  hard: 15
};
```

### Customizing Colors

Edit colors in component StyleSheet sections:
- Primary color: `#007bff`
- Success color: `#4caf50`
- Warning color: `#ffc107`
- Background: `#f8f9fa`

### Adding Sound Effects

1. Place sound files in `assets/sounds/`
2. Use `expo-av` for audio playback:
   ```bash
   npm install expo-av
   ```
3. Add sound hooks in `GameContext.js` or components

## 📱 Building for Production

### iOS

```bash
expo build:ios
```

### Android

```bash
expo build:android
```

### Using EAS Build (Recommended)

```bash
npm install -g eas-cli
eas build --platform android
eas build --platform ios
```

## 🎨 Performance Optimizations

The app includes several optimizations:

- **Memoized Components**: GridCell uses React.memo
- **Efficient Re-renders**: State updates are batched
- **Optimized Gestures**: PanResponder with minimal calculations
- **FlatList**: Efficient word list rendering
- **AsyncStorage**: Non-blocking persistent storage

## 🔧 Troubleshooting

### Issue: Metro bundler fails to start
```bash
npx react-native start --reset-cache
```

### Issue: Dependencies not installing
```bash
rm -rf node_modules
npm install
```

### Issue: Expo Go app not connecting
- Ensure both devices are on the same network
- Check firewall settings
- Try tunnel mode: `expo start --tunnel`

## 📝 Future Enhancement Ideas

- **Hints System**: Highlight first letter of remaining words
- **Multiplayer Mode**: Race against friends
- **Custom Puzzles**: Let users create their own word lists
- **Themes**: Dark mode and custom color schemes
- **Achievements**: Unlock badges for milestones
- **Statistics**: Track total games played, average time, etc.
- **Social Sharing**: Share scores on social media
- **Power-ups**: Time freeze, word reveal, etc.

## 🤝 Contributing

To enhance this game:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🙏 Acknowledgments

- Original HTML5 game concept from thefashedpotato.com
- React Native and Expo teams for excellent documentation
- Word lists curated from various public domain sources

## 📧 Support

For questions or issues, please open an issue on the repository.

---

**Enjoy playing Word Search Ultimate!** 🎉
