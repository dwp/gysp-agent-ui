const config = require('../config/application');
const dataStore = require('./dataStore');

const KONG_ENABLED = config.application.kong.enabled;

const requiredProperties = [
  'username',
  'aud',
  'cis',
];

function getAuthError(message) {
  return Object.assign(new Error(`[authHeaderCheck] ${message}`), { status: 401 });
}

function authKong(req, res, next) {
  const cookies = req.headers.cookie;

  if (cookies === undefined) {
    return next(getAuthError('Cookie not found in headers'));
  }

  const payloadStart = cookies.indexOf('tokenPayload');

  if (payloadStart === -1) {
    return next(getAuthError('Payload not found in cookie'));
  }

  const endOfToken = cookies.indexOf(';', payloadStart);
  const actualEndOfToken = (endOfToken === -1) ? cookies.length : endOfToken;
  const fullJwtEncoded = cookies.substring(payloadStart + 13, actualEndOfToken);
  const jwtString = Buffer.from(fullJwtEncoded, 'base64').toString('binary');
  const jwtObject = JSON.parse(jwtString);

  const now = new Date();

  if (typeof jwtObject.exp !== 'number' || jwtObject.exp * 1000 < now.getTime()) {
    return next(getAuthError('JWT expired'));
  }

  const missingProperties = requiredProperties.filter((path) => {
    const props = path.split('.');
    const missing = props.filter((prop) => typeof jwtObject[prop] === 'undefined');

    if (missing.length > 0) {
      return true;
    }
    return false;
  });

  if (missingProperties.length > 0) {
    return next(getAuthError(`${missingProperties.join(', ')} missing from payload`));
  }

  req.user = jwtObject;

  return next();
}

/* eslint-disable camelcase */
function fakeKong(req, res, next) {
  req.user = {
    sid: 'cb9c1a5b-6910-fb2f-957a-9c72a392d90d',
    iat: 1498060266,
    cis: {
      givenname: 'Kong',
      surname: 'Disabled',
      SLOC: '104815',
      dwp_staffid: '12345678',
    },
    sub: 'KONG_DISABLED',
    iss: 'KONG_DISABLED',
    aud: 'KONG_DISABLED',
    username: 'Kong Disabled',
    exp: new Date().getTime() + 86400000,
  };

  next();
}

module.exports = (req, res, next) => {
  const kongEnabled = KONG_ENABLED === true && dataStore.get(req, 'mockDateEnabled') !== true;
  return kongEnabled === true ? authKong(req, res, next) : fakeKong(req, res, next);
};
