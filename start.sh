#!/bin/bash

export PORT=5101

cd ~/www/pokemon
./bin/pokemon stop || true
./bin/pokemon start
