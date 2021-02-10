const path = require('path');
const express = require('express');
const favicon = require('serve-favicon');
const moment = require('moment');

const mockDateRoutes = require('./app/routes/mock-date/routes.js');
const packageJson = require('./package.json');

// Middleware
const headersMiddleware = require('./middleware/headers');
const staticMiddleware = require('./middleware/static');
const nunjucksMiddleware = require('./middleware/nunjucks');
const sessionMiddleware = require('./middleware/session');
const i18nMiddleware = require('./middleware/i18n');
const pageMiddleware = require('./middleware/page');

const roles = require('./middleware/roleAuth');

// Config variables
const config = require('./config/application');
const i18nextConfig = require('./config/i18next');
const log = require('./config/logging')('agent-ui', config.application.logs);

const app = express();

// Serve default, implicit favicon
app.use(config.mountUrl, favicon('./public/images/favicon.ico'));

// Mount all the required middleware
staticMiddleware({
  app,
  npmGovukFrontend: path.join(__dirname, '/node_modules/govuk-frontend'),
  maxAge: config.application.assets,
  mountUrl: config.mountUrl,
});

headersMiddleware(app);

nunjucksMiddleware(app, [
  'app/views',
  'node_modules/govuk-frontend/',
  'node_modules/@ministryofjustice/frontend/',
]);

sessionMiddleware(app, log, config.application);

pageMiddleware(app);

const i18next = i18nMiddleware(app, i18nextConfig, log);

app.use((req, res, next) => {
  // Send assetPath to all views
  res.locals.assetPath = '/assets';
  // Defaults
  res.locals.globalHeaderText = 'Agent UI';
  res.locals.homepageUrl = '/';
  res.locals.skipLinkMessage = 'Skip to main content';
  res.locals.serviceName = i18next.t('app:service_name');
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
  if (!req.url.includes('changes-and-enquiries') && !req.url.includes('find-someone/search-result') && !req.url.includes('tasks')) {
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

// Actuator end points before middleware to bypass kong auth
app.use(`${config.mountUrl}actuator`, require('./app/routes/actuator/routes'));

app.use((req, res, next) => {
  if (config.application.urls.agentGateway === '' || config.application.urls.agentGateway === undefined) {
    return next(new Error('No backend URL supplied'));
  }
  if (!req.session) {
    return next(new Error('Redis is down'));
  }
  return next();
});

// Mock date
if (config.env !== 'production' && config.env !== 'staging') {
  app.use((req, res, next) => {
    if (req.session.mockDateEnabled) {
      res.locals.currentDateTime = moment().format('DD/MM/YYYY HH:mm:ss');
    }
    next();
  });
  app.use(`${config.mountUrl}mock-date`, mockDateRoutes);
}

// Middleware
app.use(require('./middleware/landing')());
app.use(require('./middleware/processClaim')(log));
app.use(require('./middleware/reviewAward')(log));
app.use(require('./middleware/changesEnquiries')(log));
app.use(require('./middleware/tasks')(log));
app.use(require('./middleware/kongAuth'));

// Route information
app.use(config.mountUrl, require('./app/routes/general/routes.js'));
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
