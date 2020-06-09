const redis = require('redis');
const connectRedis = require('connect-redis');
const config = require('../config/application');

function redisCreateClient() {
  const redisConfig = config.application.redis;
  const redisHostUrl = new URL(`dummy://${redisConfig.hosts}`);
  const redisClientConfig = { host: redisHostUrl.hostname, port: redisHostUrl.port };
  if (redisHostUrl.username) {
    redisClientConfig.password = redisHostUrl.username;
  }
  if (redisConfig.prefix) {
    redisClientConfig.prefix = redis.prefix;
  }
  return redis.createClient(redisClientConfig);
}

module.exports = (session) => {
  const redisClient = redisCreateClient();
  redisClient.unref();
  const RedisStore = connectRedis(session);
  return new RedisStore({ client: redisClient });
};
