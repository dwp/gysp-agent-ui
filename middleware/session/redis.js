const redis = require('redis');
const connectRedis = require('connect-redis');

function redisConfigIngest(config) {
  const redisHostUrl = new URL(`dummy://${config.hosts}`);
  const redisClientConfig = { host: redisHostUrl.hostname, port: redisHostUrl.port };
  if (redisHostUrl.username) {
    redisClientConfig.password = redisHostUrl.username;
  }
  if (config.prefix) {
    redisClientConfig.prefix = config.prefix;
  }
  return redisClientConfig;
}

function redisCreateClient(config) {
  const client = redis.createClient(redisConfigIngest(config));
  client.unref();
  return client;
}

module.exports = (session, config) => {
  const redisClient = redisCreateClient(config);
  const RedisStore = connectRedis(session);
  return new RedisStore({ client: redisClient });
};
