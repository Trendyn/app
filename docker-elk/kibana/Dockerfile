FROM registry.opynios.com:5000/kibana:0.1

Add ./config/kibana.yml /opt/kibana/config/kibana.yml 

COPY entrypoint.sh /tmp/entrypoint.sh
RUN chmod +x /tmp/entrypoint.sh

CMD ["/tmp/entrypoint.sh"]
