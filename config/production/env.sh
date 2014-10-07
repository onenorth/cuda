#!/bin/bash

export MONGO_URL="mongodb://127.0.0.1:27017/cuda"
export ROOT_URL="onikbox.cloudapp.net"
export NODE_ENV="production"
export PORT="3000"
export METEOR_SETTINGS="$(cat config/production/settings.json)"