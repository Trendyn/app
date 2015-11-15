#/bin/sh

service mysql start

./add_maps.sh opinions

./run_db_create.sh opinions


