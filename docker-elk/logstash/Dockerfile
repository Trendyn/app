FROM registry.opynios.com:5000/logstash:0.1

ADD ./config/logstash.conf /etc/logstash/config.d/logstash.conf

CMD logstash -f /etc/logstash/config.d/logstash.conf
