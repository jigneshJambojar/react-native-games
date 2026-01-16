#!/bin/bash

# Set Java 17
export JAVA_HOME=$(/usr/libexec/java_home -v 17)

# Increase file descriptor limit
ulimit -n 65536

# Setup ADB reverse for emulator connection
adb reverse tcp:8081 tcp:8081

echo "Starting Metro bundler in background..."
# Start Metro with increased limits in background
npx react-native start --reset-cache > metro.log 2>&1 &
METRO_PID=$!

echo "Waiting for Metro to start (15 seconds)..."
sleep 15

# Check if Metro is still running
if ps -p $METRO_PID > /dev/null; then
   echo "Metro is running (PID: $METRO_PID)"
   echo "Building and installing app..."
   npx react-native run-android
else
   echo "Metro failed to start. Check metro.log for details."
   cat metro.log
   exit 1
fi
