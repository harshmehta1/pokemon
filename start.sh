#!/bin/bash

export PORT=5200

cd ~/www/pokemon
./bin/pokemon stop || true
./bin/pokemon start
