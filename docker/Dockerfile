FROM node:12.20.1-alpine3.11@sha256:12048cdfd75d944df35f3144132d9bdeee78015fbd6df765edad1be46599b110

LABEL application="gysp/agent-ui"
LABEL maintainer="Get your State Pension Team"
LABEL version="[ci]"
LABEL build_src="[ci]"

ARG APP_FOLDER=/home/node/agent-ui/
ARG STUNNEL_FOLDER=/opt/stunnel/
ARG HARDEN_FOLDER=/opt/harden/

# Need to use internal package repository for apks
RUN sed -i "s|http://dl-cdn.alpinelinux.org|https://nexus.nonprod.dwpcloud.uk/repository|" /etc/apk/repositories

RUN apk add --no-cache tzdata=2021a-r0 curl=7.67.0-r3

# Default ENV
ENV TZ=Europe/London
ENV PORT=3002
ENV CONTEXT_PATH=/

# Set up stunnel for use with Redis
RUN apk add --update --no-cache stunnel=5.56-r1 && mv "$(command -v stunnel)" /usr/local/bin/

WORKDIR ${STUNNEL_FOLDER}
COPY --chown=node:node docker/stunnel.conf ${STUNNEL_FOLDER}stunnel.conf

HEALTHCHECK --interval=30s --timeout=2s --start-period=30s  \
  CMD curl -fk $(if [ "$USE_TLS" = "true" ]; then echo "https"; else echo "http"; fi)://localhost:${PORT}${CONTEXT_PATH}actuator/health || exit 1

RUN mkdir -p ${APP_FOLDER}

# remove root user privilidge
RUN chown -R node:node ${APP_FOLDER}
RUN chown -R node:node ${STUNNEL_FOLDER}

USER node

WORKDIR ${APP_FOLDER}
COPY --chown=node:node package*.json ./
COPY --chown=node:node . .

RUN npm ci
RUN npm run build
RUN npm prune --production

USER root

WORKDIR ${HARDEN_FOLDER}

# Download and verify hardening script
ADD https://raw.githubusercontent.com/dwp/packer-infrastructure/master/docker-builder/scripts/base/harden.sh harden.sh
COPY docker/harden.sh.md5 .
RUN md5sum -c harden.sh.md5

RUN chmod +x ${HARDEN_FOLDER}harden.sh && sh ${HARDEN_FOLDER}harden.sh && rm ${HARDEN_FOLDER}harden.sh

USER node

WORKDIR ${APP_FOLDER}

ENTRYPOINT ["/bin/sh", "./docker/init.sh"]

CMD [ "node", "server.js" ]