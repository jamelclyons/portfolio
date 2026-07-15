#!/bin/bash
set -e

cd /app

if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
else
  echo "Dependencies already installed..."

  npm update -save
fi

npm run dev