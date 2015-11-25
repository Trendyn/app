#!/bin/bash
ssh -i ~/.ssh/tutum  root@$HOST "eval \$(ssh-agent -s) && ssh-add ~/.ssh/github && export OP_USER=${OP_USER} &&  mkdir -p ${OP_USER} && cd ${OP_USER} && rm -rf app && git clone $1 && cd app/ && ./deploy.sh"


