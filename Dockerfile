########################################################################################################################

FROM nodered/node-red

########################################################################################################################

LABEL maintainer="Jérôme ODIER <jerome.odier@lpsc.in2p3.fr>"

LABEL maintainer="Fabian LAMBERT <fabian.lambert@lpsc.in2p3.fr>"

LABEL description="AMI Pipeline"

########################################################################################################################

RUN npm install github:ami-team/node-red-contrib-ami

########################################################################################################################

COPY docker-entrypoint.sh /docker-entrypoint.sh

########################################################################################################################

EXPOSE 1880

########################################################################################################################

ENTRYPOINT ["/docker-entrypoint.sh"]

########################################################################################################################

