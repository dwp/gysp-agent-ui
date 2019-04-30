const request = require('request-promise');
const moment = require('moment');

const formValidator = require('../../../lib/formValidator');
const requestHelper = require('../../../lib/requestHelper');
const titleHelper = require('../../../lib/titleHelper');
const customerObject = require('../../../lib/customerObject');
const keyObject = require('../../../lib/keyObject');

const duplicateNinoStatus = 409;
const statusCodeErrorWrap = 200;
const connectionRefused = 'RequestError';

function makeDateReadable(date) {
  return moment(date).format('D MMMM YYYY');
}

function toUpperCase(value) {
  return value.toUpperCase();
}

function formatTitleOptions(titles, details) {
  const titleList = titles.map(title => ({
    value: title,
    text: title,
    selected: !!(details !== undefined && title === details.title),
  }));

  // Add option at start
  titleList.unshift({
    text: 'Please select',
  });

  return titleList;
}

function customerAdd(req, res, titleList) {
  const titles = formatTitleOptions(titleList);
  const details = {};
  details.address = 'UK';

  res.render('pages/customer/add', { titles, details });
}

/* istanbul ignore next */
function customerAddGetCache(req, res) {
  titleHelper.getTitleList((err, titleRequest) => {
    if (err) {
      const traceID = requestHelper.getTraceID(err);
      requestHelper.loggingHelper(err, '/api/customer/titles', traceID, res.locals.logger);
      res.status(statusCodeErrorWrap);
      res.render('pages/error', { status: ' - Cannot get titles' });
    } else {
      customerAdd(req, res, titleRequest);
    }
  });
}

function customerPostErrorHandler(error, req, res, titleList) {
  const titles = formatTitleOptions(titleList, req.body);
  const traceID = requestHelper.getTraceID(error);
  requestHelper.loggingHelper(error, '/api/customer', traceID, res.locals.logger);
  if (error.name === connectionRefused) {
    res.render('pages/customer/add', { titles, details: req.body, globalError: 'Error - connection refused.' });
  } else if (error.statusCode === duplicateNinoStatus) {
    res.render('pages/customer/add', { titles, details: req.body, globalError: 'Error - duplicate National Insurance number found.' });
  } else {
    res.render('pages/customer/add', { titles, details: req.body, globalError: 'Error - could not save data.' });
  }
}

/* istanbul ignore next */
function customerAddPost(req, res, title) {
  req.body.nino = toUpperCase(req.body.nino);
  const errors = formValidator.customerDetails(req.body, title);
  const titles = formatTitleOptions(title, req.body);
  if (Object.keys(errors).length === 0) {
    const keyDetails = keyObject.formatter(req.body, req.user);
    const postKeyDataCall = requestHelper.generatePostCall(`${res.locals.agentGateway}api/key`, keyDetails);
    request(postKeyDataCall)
      .then((key) => {
        req.body.inviteKey = key.inviteKey;
        const customerDetails = customerObject.formatter(req.body, req.user);
        const postCustomerDataCall = requestHelper.generatePostCall(`${res.locals.agentGateway}api/customer`, customerDetails);
        return request(postCustomerDataCall);
      }).then((customer) => {
        req.body.statePensionDate = makeDateReadable(customer.statePensionDate);
        res.render('pages/customer/add', {
          titles, details: req.body, disabled: true, globalSuccess: 'Success - Customer has been added.',
        });
      }).catch((err) => {
        if (req.body.inviteKey) {
          delete req.body.inviteKey;
        }
        customerPostErrorHandler(err, req, res, title);
      });
  } else {
    res.render('pages/customer/add', {
      titles, details: req.body, errors, globalError: 'Error - Please correct the issues below.',
    });
  }
}

/* istanbul ignore next */
function customerAddPostCache(req, res) {
  titleHelper.getTitleList((err, titleRequest) => {
    if (err) {
      const traceID = requestHelper.getTraceID(err);
      requestHelper.loggingHelper(err, '/api/customer/titles', traceID, res.locals.logger);
      res.status(statusCodeErrorWrap);
      res.render('pages/error', { status: ' - Cannot get titles' });
    } else {
      customerAddPost(req, res, titleRequest);
    }
  });
}

module.exports.customerAddGetCache = customerAddGetCache;
module.exports.customerAddPostCache = customerAddPostCache;

module.exports.customerAdd = customerAdd;
module.exports.customerAddPost = customerAddPost;
module.exports.customerPostErrorHandler = customerPostErrorHandler;
