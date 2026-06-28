#!/bin/bash

# Get current date and time
current_date=$(date +"%Y-%m-%d")
current_time=$(date +"%H:%M:%S")

# Git add all files
git add .

# Commit with a message
git commit -m "Refactoring ${current_date} @ ${current_time}"