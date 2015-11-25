#Set base image to Ubuntu
FROM tutum.co/opynios/app:0.1

#File Author / Maintainer
MAINTAINER opynios

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





