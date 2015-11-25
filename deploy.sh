#!/bin/bash
OP_USER=dev
if [ -z "$OP_USER" ]; then
  echo "Need to set \$OP_USER"   
  exit 1
fi

docker-compose -p $OP_USER --x-networking build
docker tag "${OP_USER}_app" "tutum.co/opynios/app:${OP_USER}"
docker tag "${OP_USER}_db" "tutum.co/opynios/db:${OP_USER}"
docker push "tutum.co/opynios/db:${OP_USER}"
docker push "tutum.co/opynios/app:${OP_USER}"
tutum stack create -f tutum.yml -n "staging_${OP_USER}"
tutum stack start "staging_${OP_USER}"



