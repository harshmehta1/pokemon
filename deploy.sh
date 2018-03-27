#!/bin/bash

export PORT=5200
export MIX_ENV=prod
export GIT_PATH=/home/pokemon/src/pokemon

PWD=`pwd`
if [ $PWD != $GIT_PATH ]; then
	echo "Error: Must check out git repo to $GIT_PATH"
	echo "  Current directory is $PWD"
	exit 1
fi

if [ $USER != "pokemon" ]; then
	echo "Error: must run as user 'pokemon'"
	echo "  Current user is $USER"
	exit 2
fi

mix deps.get
(cd assets && npm install)
(cd assets && ./node_modules/brunch/bin/brunch b -p)
mix phx.digest
mix release --env=prod

mkdir -p ~/www
mkdir -p ~/old

NOW=`date +%s`
if [ -d ~/www/pokemon ]; then
	echo mv ~/www/pokemon ~/old/$NOW
	mv ~/www/pokemon ~/old/$NOW
fi

mkdir -p ~/www/pokemon
REL_TAR=~/src/pokemon/_build/prod/rel/pokemon/releases/0.0.1/pokemon.tar.gz
(cd ~/www/pokemon && tar xzvf $REL_TAR)

crontab - <<CRONTAB
@reboot bash /home/pokemon/src/pokemon/start.sh
CRONTAB

#. start.sh
