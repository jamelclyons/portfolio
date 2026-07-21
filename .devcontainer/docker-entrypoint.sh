#!/bin/bash
# docker_entrypoint.sh

set -e

cd /app

if [ -f .env ]; then
  set -a
  . ./.env
  set +a
fi

npm install

exec npm run dev