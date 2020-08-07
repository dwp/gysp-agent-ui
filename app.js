const path = require('path');
const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
const session = require('express-session');
const nunjucks = require('nunjucks');
const i18n = require('i18next');
const compression = require('compression');
const flash = require('express-flash');
const roles = require('./lib/middleware/roleAuth.js');
const mockDateRoutes = require('./app/routes/mock-date/routes.js');
const packageJson = require('./package.json');

const redisClient = require('./bootstrap/redisClient');

const app = express();

// Config variables
const config = require('./config/application');
const i18nConfig = require('./config/i18n');
const log = require('./config/logging')('agent-ui', config.application.logs);

const { cacheLength } = config.application.assets;

// Template setup for nunjucks
nunjucks.configure([
  'app/views',
  'node_modules/govuk-frontend/',
  'node_modules/@ministryofjustice/frontend/',
], {
  autoescape: true,
  express: app,
  noCache: config.application.noTemplateCache,
});

// Compression of assets
app.use(compression());

// Disable x-powered-by header
app.disable('x-powered-by');

// Middleware to serve static assets
app.set('view engine', 'html');
app.use(`${config.mountUrl}assets`, express.static('./public', { maxage: cacheLength }));
app.use(`${config.mountUrl}assets`, express.static(path.join(__dirname, '/node_modules/govuk-frontend/govuk')));
app.use(`${config.mountUrl}assets`, express.static(path.join(__dirname, '/node_modules/govuk-frontend/govuk/assets'), { maxage: cacheLength }));
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

app.set('trust proxy', 1);

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
if (config.application.session.securecookies === true) {
  sessionConfig.cookie.secure = true;
}
if (config.application.session.store === 'redis') {
  sessionConfig.store = redisClient(session);
  sessionConfig.store.client.on('error', (err) => {
    log.error(`Redis error: ${err}`);
  });
}
app.use(session(sessionConfig));

// Flash session middleware used for alerts
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
  res.locals.agentGateway = config.application.urls.agentGateway;
  res.locals.robotKey = config.application.robot.key;
  res.locals.robotSecret = config.secret;
  res.locals.version = packageJson.version;
  res.locals.paperClaimFeature = config.application.feature.paperClaimFeature;
  res.locals.widowInheritanceFeature = config.application.feature.widowInheritanceFeature;

  // Set a global fullUrl excluding mountUrl to overcome WAF proxy issues
  req.fullUrl = req.originalUrl.replace(new RegExp(config.mountUrl), '/');
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
  if (!req.url.includes('changes-and-enquiries') && !req.url.includes('find-someone/search-result')) {
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

// Heath end point before middleware to bypass kong auth
app.use(config.mountUrl, require('./app/routes/health/routes.js'));

// Middelware
app.use(require('./lib/middleware/landing')());
app.use(require('./lib/middleware/processClaim')(log));
app.use(require('./lib/middleware/reviewAward')(log));
app.use(require('./lib/middleware/changesEnquiries')(log));
app.use(require('./lib/middleware/tasks')(log));
app.use(require('./lib/kongAuth'));

// Route information
app.use(config.mountUrl, require('./app/routes/general.js'));

app.use((req, res, next) => {
  if (config.application.urls.agentGateway === '' || config.application.urls.agentGateway === undefined) {
    return next(new Error('No backend URL supplied'));
  }
  if (!req.session) {
    return next(new Error('Redis is down'));
  }
  return next();
});

if (config.env !== 'production') {
  app.use(`${config.mountUrl}mock-date`, mockDateRoutes);
}

app.use(`${config.mountUrl}customer`, roles.permit('GYSP-TEST-SUPPORT-TEAM'), require('./app/routes/customer/routes.js'));
app.use(`${config.mountUrl}claims`, roles.permit('GYSP-TEST-OPS-PROCESSOR'), require('./app/routes/next-claim/routes.js'));
app.use(`${config.mountUrl}claims`, roles.permit('GYSP-TEST-OPS-PROCESSOR'), require('./app/routes/drop-out-claim/routes.js'));
app.use(`${config.mountUrl}claims`, roles.permit('GYSP-TEST-OPS-PROCESSOR'), require('./app/routes/overseas-completed-claim/routes.js'));
app.use(`${config.mountUrl}robot`, roles.permit('GYSP-TEST-OPS-PROCESSOR'), require('./app/routes/robot/routes.js'));
app.use(`${config.mountUrl}claim-information`, roles.permit('GYSP-TEST-OPS-PROCESSOR'), require('./app/routes/claim-information/routes.js'));
app.use(`${config.mountUrl}find-claim`, roles.permit('GYSP-TEST-OPS-PROCESSOR'), require('./app/routes/find-claim/routes.js'));
app.use(`${config.mountUrl}find-someone`, roles.permit('GYSP-TEST-OPS-PROCESSOR'), require('./app/routes/find-someone/routes.js'));
app.use(`${config.mountUrl}changes-and-enquiries`, roles.permit('GYSP-TEST-OPS-PROCESSOR'), require('./app/routes/changes-enquiries/routes.js'));
app.use(`${config.mountUrl}process-claim`, roles.permit('GYSP-TEST-OPS-PROCESSOR'), require('./app/routes/process-claim/routes'));
app.use(`${config.mountUrl}process-claim`, roles.permit('GYSP-TEST-OPS-PROCESSOR'), require('./app/routes/process-claim-detail/routes'));
app.use(`${config.mountUrl}process-claim`, roles.permit('GYSP-TEST-OPS-PROCESSOR'), require('./app/routes/process-claim-to-bau/routes'));
app.use(`${config.mountUrl}process-claim`, roles.permit('GYSP-TEST-OPS-PROCESSOR'), require('./app/routes/process-claim-payment/routes'));
app.use(`${config.mountUrl}process-claim`, roles.permit('GYSP-TEST-OPS-PROCESSOR'), require('./app/routes/process-claim-complete/routes'));
app.use(`${config.mountUrl}tasks`, roles.permit('GYSP-TEST-OPS-PROCESSOR'), require('./app/routes/tasks/routes'));
app.use(`${config.mountUrl}review-award`, roles.permit('GYSP-TEST-OPS-PROCESSOR'), require('./app/routes/review-award/routes'));

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
  if (config.env !== 'production') {
    process.stdout.write(`\n${err.status}: ${err.message}\n\n`);
    process.stdout.write(`${err.stack}\n\n`);
  }
  log.error(`${status} - ${err.message} - Requested on ${req.method} ${req.fullUrl}`);

  res.render('pages/error', {
    status,
  });
  next();
});

module.exports = app;
