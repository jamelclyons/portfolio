#!/bin/bash
set -e

cd /app

if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
else
  echo "Updating dependencies..."
  npm update -save

  npm run build
fi

npm run stage