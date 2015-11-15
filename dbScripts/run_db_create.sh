#!/bin/sh

echo "mysql --host=localhost --user=root --password=$1 < create_db.sql;"
mysql --host=localhost --user=root --password=$1 < create_db.sql;

echo "mysql --host=localhost --user=oc --password=$1 opinions < create_tables.sql;"
mysql --host=localhost --user=oc --password=$1 opinions < create_tables.sql;

echo "mysql --host=localhost --user=oc --password=$1 opinions < create_stored_procedures.sql;"
mysql --host=localhost --user=oc --password=$1 opinions < create_stored_procedures.sql;
