#!/bin/bash

# Set Java 17
export JAVA_HOME=$(/usr/libexec/java_home -v 17)

# Setup ADB reverse
adb reverse tcp:8081 tcp:8081

echo "Building and running app (Metro will start automatically)..."
# Run with no-packager flag, then start packager separately
ulimit -n 65536 && npx react-native bundle --platform android --dev true --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res && \
npx react-native run-android

