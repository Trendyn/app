CREATE DATABASE IF NOT EXISTS opinions CHARACTER SET utf8;

GRANT ALL PRIVILEGES ON opinions.* TO 'oc'@'localhost' IDENTIFIED BY 'opinions';
GRANT ALL PRIVILEGES ON opinions.* TO 'oc'@'107.170.242.184' IDENTIFIED BY 'opinions';
GRANT ALL PRIVILEGES ON opinions.* TO 'oc'@'app' IDENTIFIED BY 'opinions';
GRANT ALL PRIVILEGES ON opinions.* TO 'oc'@'app.delhielection' IDENTIFIED BY 'opinions';

