#!/bin/bash
OP_USER=dev
if [ -z "$OP_USER" ]; then
  echo "Need to set \$OP_USER"   
  exit 1
fi

if which docker-compose > /dev/null; then
else
  curl -L https://github.com/docker/compose/releases/download/1.5.1/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose
  chmod +x /usr/local/bin/docker-compose
fi

docker-compose -p $OP_USER build
docker tag "${OP_USER}_app" "tutum.co/opynios/app:${OP_USER}"
docker tag "${OP_USER}_db" "tutum.co/opynios/db:${OP_USER}"
docker push "tutum.co/opynios/db:${OP_USER}"
docker push "tutum.co/opynios/app:${OP_USER}"
./replacevars.sh tutum-staging.yml OP_USER=${OP_USER}
tutum stack create -f tutum-staging.yml -n "staging-${OP_USER}"
tutum stack start "staging-${OP_USER}"



