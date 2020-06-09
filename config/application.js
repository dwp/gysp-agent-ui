require('dotenv').config();

module.exports = {
  env: process.env.NODE_ENV || 'production',
  secret: process.env.AGENT_FRONTEND_SECRET || 'thisIsASecret',
  mountUrl: process.env.CONTEXT_PATH || '/',
  application: {
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : null,
    tls: {
      enabled: process.env.USE_TLS === 'true',
      key: process.env.TLS_KEY || null,
      cert: process.env.TLS_CERT || null,
    },
    assets: {
      cacheLength: process.env.ASSET_CACHE_LENGTH ? parseInt(process.env.ASSET_CACHE_LENGTH, 10) : 86400000,
    },
    noTemplateCache: (process.env.NO_TEMPLATE_CACHE === 'true') || false,
    session: {
      store: process.env.SESSION_STORE || 'redis',
      name: process.env.SESSION_NAME || 'name',
      secret: process.env.AGENT_FRONTEND_SESSION_SECRET || 'secret',
      timeout: process.env.SESSION_TIMEOUT ? parseInt(process.env.SESSION_TIMEOUT, 10) : 10,
      securecookies: process.env.SESSION_SECURE_COOKIES === 'true',
    },
    urls: {
      apiHost: 'gysp-dev-agent-proxy',
      agentGateway: process.env.AGENT_GATEAWAY,
      apiKey: process.env['AGENT-KONG-KEY-CONSUMER'] || 'thisIsAnApiKey',
      awardApiKey: process.env['AGENT-KONG-KEY-AWARDSERVICE'] || 'thisIsAnApiKey',
      addressLookupApiKey: process.env['AGENT-KONG-KEY-ADDRESSLOOKUPSERVICE'] || 'thisIsAnApiKey',
      paymentApiKey: process.env['AGENT-KONG-KEY-PAYMENTSERVICE'] || 'thisIsAnApiKey',
      hmrcCalculationApiKey: process.env['AGENT-KONG-KEY-HMRCCALCULATION'] || 'thisIsAnApiKey',
      auditApiKey: process.env['AGENT-KONG-KEY-AUDIT'] || 'thisIsAnApiKey',
      eventApiKey: process.env['AGENT-KONG-KEY-EVENTSERVICE'] || 'thisIsAnApiKey',
      workItemsApiKey: process.env['AGENT-KONG-KEY-WORKITEMS'] || 'thisIsAnApiKey',
    },
    robot: {
      key: process.env.ROBOT_KEY || 'thisIsAKeyForARobot',
    },
    logs: {
      level: process.env.LOG_LEVEL || 'info',
    },
    redis: {
      hosts: process.env.REDIS_HOSTS || null,
      prefix: process.env.REDIS_PREFIX || null,
    },
    kong: {
      enabled: (process.env.KONG_ENABLED === 'true') || false,
    },
  },
};
