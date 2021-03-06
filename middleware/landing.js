const dataStore = require('../lib/dataStore');

module.exports = () => (req, res, next) => {
  if (req.fullUrl === '/') {
    dataStore.save(req, 'origin', 'full-service');
  }
  next();
};
