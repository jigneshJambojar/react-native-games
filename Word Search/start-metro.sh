#!/bin/bash

# Increase file descriptor limit for this session
ulimit -n 65536

# Start Metro bundler
npm start
