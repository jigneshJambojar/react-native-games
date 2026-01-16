# Quick Start - React Native Version

## ⚡ Get Running in 5 Minutes!

### Step 1: Install Node.js (if needed)
```bash
# Check if installed
node --version

# If not installed, download from: https://nodejs.org/
```

### Step 2: Navigate to Project
```bash
cd /Users/bhavinpatolia/Documents/AIproject/ai-games/omg-word-pop-react-native
```

### Step 3: Install Dependencies
```bash
npm install
```

### Step 4: Run on Android

**Option A: With Android Device Connected**
```bash
# Enable USB Debugging on your Android phone
# Connect phone via USB
npm run android
```

**Option B: With Android Emulator**
```bash
# Open Android Studio
# Start an emulator (AVD Manager)
npm run android
```

### Step 5: Play!

The app will install and launch automatically!

---

## 🎮 What You Get

✅ **Complete working game** with all 50 levels  
✅ **Touch controls** for word selection  
✅ **Progress saving** across sessions  
✅ **Star ratings** for each level  
✅ **Level unlocking** system  

---

## 📱 Building APK for Testing

```bash
cd android
./gradlew assembleRelease
```

APK will be at: `android/app/build/outputs/apk/release/app-release.apk`

Transfer to your phone and install!

---

## 🐛 If Something Goes Wrong

### Metro Bundler Won't Start
```bash
npm start --reset-cache
```

### Build Fails
```bash
cd android
./gradlew clean
cd ..
npm run android
```

### Can't Find Device
```bash
adb devices
# Make sure your device appears
```

---

## ✅ System Requirements

- **Node.js** 18+
- **Android Studio** (for Android SDK)
- **Java JDK** 11+
- **Android device** with USB debugging OR emulator

---

## 🎯 That's It!

The game is **100% complete**. No configuration needed!

Just run `npm install` and `npm run android` 🚀
