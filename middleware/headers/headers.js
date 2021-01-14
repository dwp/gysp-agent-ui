const helmet = require('helmet');
const compression = require('compression');
const noCache = require('nocache');

module.exports = (app) => {
  // Disable Etag for pages
  app.disable('etag');

  // Disable x-powered-by header
  app.disable('x-powered-by');

  // Use helmet to set XSS security headers, Content-Security-Policy, etc.
  app.use(helmet({
    referrerPolicy: false,
    frameguard: { action: 'deny' },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ['\'self\''],
        scriptSrc: ['\'self\'', '\'unsafe-inline\'', 'www.google-analytics.com'],
        imgSrc: ['\'self\'', 'www.google-analytics.com'],
        fontSrc: ['\'self\'', 'data: blob:'],
      },
      reportOnly: false,
    },
  }));

  // Compression
  app.use(compression());

  // Caching policy
  app.use(noCache());

  // Trust reverse proxy
  app.set('trust proxy', 1);
};
