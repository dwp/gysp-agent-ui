#!/usr/bin/env sh

# Start stunnel
# Redis connections from this docker container must proxy through stunnel in
# order to connect with AWS Elasticache.
# To use this stunnel, set `REDIS_HOSTS` to `<password>@localhost:6379`.
# You will also need to disable cluster mode (i.e. `REDIS_CLUSTER_MODE=false`)
# `REDIS_HOSTS` is the target Redis `<host>:<port>`
STUNNEL_CONF_FILE=/opt/stunnel/stunnel.conf
sed -i "s/\\\${STUNNEL_REDIS_CONNECT}/${STUNNEL_REDIS_CONNECT:-unknownhost}/g" "$STUNNEL_CONF_FILE"
cat $STUNNEL_CONF_FILE
stunnel "$STUNNEL_CONF_FILE"

exec "$@"
