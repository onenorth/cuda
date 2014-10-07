#!/bin/bash

APP_ENV="production"

echo "Stopping Cuda"
forever stop current/bundle/main.js

echo "Loading Cuda Environment"
source config/"$APP_ENV"/env.sh

echo "Starting Cuda Server in $APP_ENV"
forever -l forever.log -o log/out.log -e log/err.log --append -m 5 -minUptime 1000 --spinSleepTime 1000 start current/bundle/main.js