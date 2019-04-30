const app = require('./app.js');

const port = process.env.PORT ? process.env.PORT : 3002;
// Start the app
app.listen(port);
console.log(''); // eslint-disable-line no-console
console.log(`Listening on port ${port}`); // eslint-disable-line no-console
console.log(''); // eslint-disable-line no-console
