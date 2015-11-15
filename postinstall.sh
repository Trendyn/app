#!/bin/bash
sass -v
if [ $? -eq 0 ];
  then echo "sass already installed"
  else sudo gem install sass
fi
sudo apt-get update
sudo apt-get -y install redis-server redis-tools
