#!/bin/bash
ssh -i ~/.ssh/tutum  root@$HOST "eval \$(ssh-agent -s) && ssh-add ~/.ssh/github && mkdir -p ${OP_USER} && cd ${OP_USER} && rm -rf app && git clone $1 && cd app/ && ./deploy.sh"


