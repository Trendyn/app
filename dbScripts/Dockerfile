#Set base image to Ubuntu
FROM registry.opynios.com:5000/mysql:0.1

#File Author / Maintainer
MAINTAINER opynios

WORKDIR /db
ADD . /db

RUN service mysql start && ./add_maps.sh opinions
RUN service mysql start && ./run_db_create.sh opinions

CMD /usr/bin/mysqld_safe





