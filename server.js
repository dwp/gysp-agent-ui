const https = require('https');
const config = require('./config/application');
const app = require('./app.js');

const { port, tls } = config.application;
let httpsServer;
if (tls.enabled) {
  httpsServer = https.createServer({
    key: config.application.tls.key,
    cert: config.application.tls.cert,
  }, app);
}

(tls.enabled ? httpsServer : app).listen(port);

process.stdout.write(`\nListening on port ${port}\n\n`);
