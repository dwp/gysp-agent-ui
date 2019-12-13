const path = require('path');
const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
const redis = require('redis');
const session = require('express-session');
const nunjucks = require('nunjucks');
const i18n = require('i18next');
const compression = require('compression');
const flash = require('express-flash');
const connectRedis = require('connect-redis');
const encyption = require('./lib/encryption');
const roles = require('./lib/middleware/roleAuth.js');
const mockDateRoutes = require('./app/routes/mock-date/routes.js');

const app = express();

// Config variables
const config = require('./config/yaml');
const i18nConfig = require('./config/i18n');
const log = require('./config/logging')('agent-ui', config.application.logs);

const templateCache = true;

// Template setup for nunjucks
nunjucks.configure([
  'app/views',
  'node_modules/govuk-frontend/',
  'node_modules/@ministryofjustice/frontend/',
], { autoescape: true, express: app, noCache: templateCache });

// Compression of assets
app.use(compression());

// Disable x-powered-by header
app.disable('x-powered-by');

// Middleware to serve static assets
app.set('view engine', 'html');
app.use('/assets', express.static('./public'));
app.use('/assets', express.static(path.join(__dirname, '/node_modules/govuk-frontend/govuk')));
app.use('/assets', express.static(path.join(__dirname, '/node_modules/govuk-frontend/govuk/assets'), { maxage: 86400000 }));
app.use(favicon('./node_modules/govuk-frontend/govuk/assets/images/favicon.ico'));

// Disable Etag for pages
app.disable('etag');

// Use helmet to set XSS security headers, Content-Security-Policy, etc.
app.use(helmet());
app.use(helmet.frameguard({ action: 'deny' }));
app.use(helmet.noCache());
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ['\'self\''],
    scriptSrc: ['\'self\'', '\'unsafe-inline\'', 'www.google-analytics.com'],
    imgSrc: ['\'self\'', 'www.google-analytics.com'],
    fontSrc: ['\'self\'', 'data: blob:'],
  },
  reportOnly: false,
  setAllHeaders: true,
  disableAndroid: false,
}));

// Session settings
const sessionConfig = {
  secret: config.application.session.secret,
  name: config.application.session.name,
  cookie: {
    maxAge: config.application.session.timeout,
  },
  resave: true,
  rolling: true,
  saveUninitialized: true,
};

app.set('trust proxy', 1);

if (config.application.session.securecookies === true) {
  sessionConfig.cookie.secure = true;
}

if (config.application.session.store === 'redis') {
  const RedisStore = connectRedis(session);
  const redisConfig = config.application.redis;
  redisConfig.host = process.env.REDIS_HOST || '127.0.0.1';
  redisConfig.password = encyption.decrypt(redisConfig.password, config.secret);
  const client = redis.createClient(redisConfig);
  client.unref();
  client.on('error', (err) => {
    log.error(`Redis error: ${err}`);
  });
  sessionConfig.store = new RedisStore({ client });
}

app.use(session(sessionConfig));

app.use(flash());

// Multilingual information
i18n.init(i18nConfig);
app.use(i18n.handle);
i18n.registerAppHelper(app);

// Add post middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false,
}));

function agentGateway(process, appConfig) {
  if (process.env.GATEWAY) {
    return process.env.GATEWAY;
  }
  return appConfig.application.urls.agentGateway;
}

app.use((req, res, next) => {
  // Send assetPath to all views
  res.locals.assetPath = '/assets';
  // Defaults
  res.locals.globalHeaderText = 'Agent UI';
  res.locals.homepageUrl = '/';
  res.locals.skipLinkMessage = 'Skip to main content';
  res.locals.serviceName = i18n.t('app:service_name');
  res.locals.logger = log;
  /* Urls */
  res.locals.agentGateway = agentGateway(process, config);
  res.locals.robotKey = config.application.robot.key;
  res.locals.robotSecret = config.secret;
  next();
});

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'must-revalidate, no-cache, no-store, private');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('X-UA-Compatible', 'ie=edge');
  res.setHeader('X-Forwarded-Proto', 'https');
  next();
});

// Clear session
app.use((req, res, next) => {
  if (!req.url.includes('changes-and-enquiries')) {
    if (req.session.awardDetails) {
      delete req.session.awardDetails;
    }
    if (req.session.searchedNino) {
      delete req.session.searchedNino;
    }
    if (req.session.frequencyChangeSchedule) {
      delete req.session.frequencyChangeSchedule;
    }
  }
  next();
});

app.use(require('./lib/middleware/processClaim')(log));
app.use(require('./lib/middleware/reviewAward')(log));
app.use(require('./lib/middleware/changesEnquiries')(log));
app.use(require('./lib/kongAuth'));

// Route information
app.use('/', require('./app/routes/general.js'));
app.use('/', require('./app/routes/health/routes.js'));

app.use((req, res, next) => {
  if (config.application.urls.agentGateway === '' || config.application.urls.agentGateway === undefined) {
    next(new Error('No backend URL supplied'));
  }
  next();
});

if (config.env !== 'prod') {
  app.use('/mock-date', mockDateRoutes);
}

app.use('/customer', roles.permit('GYSP-TEST-SUPPORT-TEAM'), require('./app/routes/customer/routes.js'));
app.use('/claims', roles.permit('GYSP-TEST-OPS-PROCESSOR'), require('./app/routes/next-claim/routes.js'));
app.use('/claims', roles.permit('GYSP-TEST-OPS-PROCESSOR'), require('./app/routes/drop-out-claim/routes.js'));
app.use('/claims', roles.permit('GYSP-TEST-OPS-PROCESSOR'), require('./app/routes/overseas-completed-claim/routes.js'));
app.use('/robot', roles.permit('GYSP-TEST-OPS-PROCESSOR'), require('./app/routes/robot/routes.js'));
app.use('/claim-information', roles.permit('GYSP-TEST-OPS-PROCESSOR'), require('./app/routes/claim-information/routes.js'));
app.use('/find-claim', roles.permit('GYSP-TEST-OPS-PROCESSOR'), require('./app/routes/find-claim/routes.js'));
app.use('/find-someone', roles.permit('GYSP-TEST-OPS-PROCESSOR'), require('./app/routes/find-someone/routes.js'));
app.use('/changes-and-enquiries', roles.permit('GYSP-TEST-OPS-PROCESSOR'), require('./app/routes/changes-enquiries/routes.js'));
app.use('/process-claim', roles.permit('GYSP-TEST-OPS-PROCESSOR'), require('./app/routes/process-claim/routes'));
app.use('/process-claim', roles.permit('GYSP-TEST-OPS-PROCESSOR'), require('./app/routes/process-claim-detail/routes'));
app.use('/process-claim', roles.permit('GYSP-TEST-OPS-PROCESSOR'), require('./app/routes/process-claim-to-bau/routes'));
app.use('/process-claim', roles.permit('GYSP-TEST-OPS-PROCESSOR'), require('./app/routes/process-claim-payment/routes'));
app.use('/process-claim', roles.permit('GYSP-TEST-OPS-PROCESSOR'), require('./app/routes/process-claim-complete/routes'));
app.use('/review-award', roles.permit('GYSP-TEST-OPS-PROCESSOR'), require('./app/routes/review-award/routes'));

// 404 catch
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error catch
app.use((err, req, res, next) => {
  const status = (err.status || 500);
  res.status(status);
  if (config.application.env !== 'production') {
    console.log(`${err.status}: ${err.message}`); // eslint-disable-line no-console
    console.log('\n\n'); // eslint-disable-line no-console
    console.log(err.stack); // eslint-disable-line no-console
  }

  log.error(`${status} - ${err.message} - Requested on ${req.method} ${req.path}`);

  res.render('pages/error', {
    status,
  });
  next();
});

module.exports = app;
