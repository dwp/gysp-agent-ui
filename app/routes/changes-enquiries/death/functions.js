const request = require('request-promise');

const formValidator = require('../../../../lib/formValidator');
const requestHelper = require('../../../../lib/requestHelper');
const keyDetailsHelper = require('../../../../lib/keyDetailsHelper');
const secondaryNavigationHelper = require('../../../../lib/helpers/secondaryNavigationHelper');
const deathObject = require('../../../../lib/objects/deathObject');
const deathVerifyObject = require('../../../../lib/objects/deathVerifyObject');
const deathVerifiedObject = require('../../../../lib/objects/deathVerifiedObject');
const deathPaymentObject = require('../../../../lib/objects/view/deathPaymentObject');
const dateHelper = require('../../../../lib/dateHelper');
const generalHelper = require('../../../../lib/helpers/general');
const dataStore = require('../../../../lib/dataStore');
const deleteSession = require('../../../../lib/deleteSession');

const activeSecondaryNavigationSection = 'personal';
const secondaryNavigationList = secondaryNavigationHelper.navigationItems(activeSecondaryNavigationSection);

const deathDetailsUpdateApiUri = 'api/award/record-death';
const deathArrearsApiUri = 'api/payment/death-arrears';

function getAddDateDeath(req, res) {
  const keyDetails = keyDetailsHelper.formatter(req.session.awardDetails);
  const { awardDetails } = req.session;
  const details = dataStore.get(req, 'date-of-death', 'death');
  res.render('pages/changes-enquiries/death/enter-date', {
    keyDetails,
    awardDetails,
    secondaryNavigationList,
    details,
  });
}

function postAddDateDeath(req, res) {
  const details = req.body;
  const errors = formValidator.dateOfDeathValidation(details);
  if (Object.keys(errors).length === 0) {
    dataStore.save(req, 'date-of-death', details, 'death');
    res.redirect('/changes-and-enquiries/personal/death/payment');
  } else {
    const awardDetails = dataStore.get(req, 'awardDetails');
    const keyDetails = keyDetailsHelper.formatter(awardDetails);
    res.render('pages/changes-enquiries/death/enter-date', {
      keyDetails,
      secondaryNavigationList,
      details,
      errors,
    });
  }
}

function deathPaymentView(details) {
  let viewPath = 'pages/changes-enquiries/death/payment';
  if (generalHelper.isNotUndefinedEmptyOrNull(details.amount)) {
    if (Math.sign(details.amount) < 0) {
      viewPath += '/overpayment';
    } else if (Math.sign(details.amount) > 0) {
      viewPath += '/arrears';
    } else {
      viewPath += '/nothing-owed';
    }
  } else {
    viewPath += '/cannot-calculate';
  }
  return viewPath;
}

function getDeathPaymentErrorHandler(error, req, res, keyDetails) {
  const traceID = requestHelper.getTraceID(error);
  requestHelper.loggingHelper(error, deathArrearsApiUri, traceID, res.locals.logger);
  res.render('pages/changes-enquiries/death/payment/index', {
    keyDetails,
    globalError: generalHelper.globalErrorMessage(error),
  });
}

function getDeathPayment(req, res) {
  const awardDetails = dataStore.get(req, 'awardDetails');
  const { dateYear, dateMonth, dateDay } = dataStore.get(req, 'date-of-death', 'death');
  const keyDetails = keyDetailsHelper.formatter(awardDetails);
  const dateOfDeath = dateHelper.dateDash(`${dateYear}-${dateMonth}-${dateDay}`);
  const getDeathArrearsCall = requestHelper.generateGetCall(`${res.locals.agentGateway}${deathArrearsApiUri}?nino=${awardDetails.nino}&dateOfDeath=${dateOfDeath}`, {}, 'payment');
  request(getDeathArrearsCall).then((details) => {
    dataStore.save(req, 'death-payment', details, 'death');
    const formattedDetails = deathPaymentObject.formatter(details);
    res.render(deathPaymentView(details), {
      keyDetails,
      secondaryNavigationList,
      details: formattedDetails,
    });
  }).catch((err) => {
    getDeathPaymentErrorHandler(err, req, res, keyDetails);
  });
}

function getRecordDeathErrorHandler(error, req, res) {
  const traceID = requestHelper.getTraceID(error);
  requestHelper.loggingHelper(error, deathDetailsUpdateApiUri, traceID, res.locals.logger);
  req.flash('error', generalHelper.globalErrorMessage(error, 'award'));
  res.redirect('/changes-and-enquiries/personal/death/payment');
}

function getRecordDeath(req, res) {
  const awardDetails = dataStore.get(req, 'awardDetails');
  const death = dataStore.get(req, 'death');
  const deathDetails = deathObject.formatter(death, awardDetails);
  const putDeathDetailsCall = requestHelper.generatePutCall(res.locals.agentGateway + deathDetailsUpdateApiUri, deathDetails, 'award', req.user);
  request(putDeathDetailsCall).then(() => {
    res.redirect('/changes-and-enquiries/payment');
  }).catch((err) => {
    getRecordDeathErrorHandler(err, req, res);
  });
}

function postVerifyDeathErrorHandler(error, req, res, keyDetails) {
  const traceID = requestHelper.getTraceID(error);
  requestHelper.loggingHelper(error, deathDetailsUpdateApiUri, traceID, res.locals.logger);
  res.render('pages/changes-enquiries/death/verify-date', {
    keyDetails,
    secondaryNavigationList,
    dateOfDeath: dateHelper.longDate(req.session.awardDetails.dateOfDeath),
    details: req.body,
    globalError: generalHelper.globalErrorMessage(error, 'award'),
  });
}

function getVerifyDeath(req, res) {
  const keyDetails = keyDetailsHelper.formatter(req.session.awardDetails);
  const { awardDetails } = req.session;
  res.render('pages/changes-enquiries/death/verify-date', {
    keyDetails,
    awardDetails,
    secondaryNavigationList,
    dateOfDeath: dateHelper.longDate(awardDetails.dateOfDeath),
  });
}

function postVerifyDeath(req, res) {
  const details = req.body;
  const { awardDetails } = req.session;
  const errors = formValidator.dateOfDeathVerify(details);
  const keyDetails = keyDetailsHelper.formatter(awardDetails);
  if (Object.keys(errors).length === 0) {
    if (details.verify === 'yes') {
      const deathDetails = deathVerifyObject.formatter(awardDetails);
      const putDeathDetailsCall = requestHelper.generatePutCall(res.locals.agentGateway + deathDetailsUpdateApiUri, deathDetails, 'award', req.user);
      request(putDeathDetailsCall).then(() => {
        res.redirect('/changes-and-enquiries/personal');
      }).catch((err) => {
        postVerifyDeathErrorHandler(err, req, res, keyDetails);
      });
    } else {
      res.redirect('/changes-and-enquiries/personal/death/verified-date');
    }
  } else {
    res.render('pages/changes-enquiries/death/verify-date', {
      keyDetails,
      secondaryNavigationList,
      dateOfDeath: dateHelper.longDate(awardDetails.dateOfDeath),
      details,
      errors,
    });
  }
}

function getAddVerifedDeath(req, res) {
  const keyDetails = keyDetailsHelper.formatter(req.session.awardDetails);
  const { awardDetails } = req.session;

  res.render('pages/changes-enquiries/death/enter-date-verified', {
    keyDetails,
    awardDetails,
    secondaryNavigationList,
    longDate: dateHelper.longDate,
  });
}

function postAddVerifedDeathErrorHandler(error, req, res, keyDetails) {
  const traceID = requestHelper.getTraceID(error);
  requestHelper.loggingHelper(error, deathDetailsUpdateApiUri, traceID, res.locals.logger);
  res.render('pages/changes-enquiries/death/enter-date-verified', {
    keyDetails,
    secondaryNavigationList,
    details: req.body,
    globalError: generalHelper.globalErrorMessage(error, 'award'),
  });
}

function postAddVerifedDeath(req, res) {
  const details = req.body;
  const { awardDetails } = req.session;
  const errors = formValidator.dateOfDeathVerifedValidation(details);
  const keyDetails = keyDetailsHelper.formatter(awardDetails);
  if (Object.keys(errors).length === 0) {
    const deathDetails = deathVerifiedObject.formatter(details, awardDetails);
    const putDeathDetailsCall = requestHelper.generatePutCall(res.locals.agentGateway + deathDetailsUpdateApiUri, deathDetails, 'award', req.user);
    request(putDeathDetailsCall).then(() => {
      deleteSession.deleteDeathDetail(req);
      res.redirect('/changes-and-enquiries/personal');
    }).catch((err) => {
      postAddVerifedDeathErrorHandler(err, req, res, keyDetails);
    });
  } else {
    res.render('pages/changes-enquiries/death/enter-date-verified', {
      keyDetails,
      secondaryNavigationList,
      details,
      errors,
    });
  }
}

module.exports.getAddDateDeath = getAddDateDeath;
module.exports.postAddDateDeath = postAddDateDeath;
module.exports.getRecordDeath = getRecordDeath;
module.exports.getDeathPayment = getDeathPayment;

module.exports.getVerifyDeath = getVerifyDeath;
module.exports.postVerifyDeath = postVerifyDeath;
module.exports.getAddVerifedDeath = getAddVerifedDeath;
module.exports.postAddVerifedDeath = postAddVerifedDeath;
