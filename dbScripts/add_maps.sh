#!/bin/sh

echo "mysql --host=localhost --user=root --password=$1 < create_db.sql;"
mysql --host=localhost --user=root --password=$1 < create_db.sql;

echo "7z e maps.sql.7z;"
7z e maps.sql.7z;

echo "mysql --host=localhost --user=root --password=$1 opinions < maps.sql;"
mysql --host=localhost --user=root --password=$1 opinions < maps.sql;
