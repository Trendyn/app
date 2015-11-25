#!/bin/bash
ssh -i ~/.ssh/tutum  root@$HOST "eval \$(ssh-agent -s) && ssh-add ~/.ssh/github &&  git clone $1 && cd app/ && ./deploy.sh"


