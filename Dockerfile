#Set base image to Ubuntu
FROM ubuntu:14.04 

#File Author / Maintainer
MAINTAINER opynios

RUN apt-get update && apt-get install python build-essential wget git -y 

ADD install_node.sh . 
RUN chmod a+x install_node.sh && sync && ./install_node.sh && sync && npm install -g bower gulp


# use changes to package.json to force Docker not to use the cache
# when we change our application's nodejs dependencies:
ADD package.json /tmp/package.json
ADD .bowerrc /tmp/.bowerc
ADD bower.json /tmp/bower.json
RUN cd /tmp && npm cache clean && npm install --loglevel warn --loglevel http && bower install --allow-root
RUN mkdir -p /app && mkdir -p /app/app/vendor && cp -a /tmp/node_modules /app/ && cp -a /tmp/bower_components/* /app/app/vendor/

# From here we load our application's code in, therefore the previous docker
# "layer" thats been cached will be used if possible
WORKDIR /app
ADD . /app

ENV NODE_ENV=production
RUN gulp build --production 

EXPOSE 80

CMD node recluster.js





