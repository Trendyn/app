#!/bin/sh
pid="$(pgrep -f recluster.js)"


if [ $pid!=0 ]
then
  kill -s 12 $pid
else
  cd ~/delhiopinions; node ./recluster.js;
fi
