#!/bin/bash
# docker_entrypoint.sh

set -e

cd /app

echo "Updating package.json to latest dependency versions..."
npx npm-check-updates -u

echo "Installing latest dependencies..."
npm install

exec npm run dev