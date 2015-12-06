#!/bin/bash
docker-compose -p $OP_USER build
docker tag "${OP_USER//-}_app" "tutum.co/opynios/app:${OP_USER}"
docker tag "${OP_USER//-}_db" "tutum.co/opynios/db:${OP_USER}"
docker push "tutum.co/opynios/db:${OP_USER}"
docker push "tutum.co/opynios/app:${OP_USER}"
./replacevars.sh tutum-staging.yml OP_USER=${OP_USER}
tutum stack create -f tutum-staging.yml -n "staging-${OP_USER}"
tutum stack start "staging-${OP_USER}"



