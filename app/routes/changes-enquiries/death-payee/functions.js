const request = require('request-promise');
const i18n = require('i18next');

i18n.init({ sendMissingTo: 'fallback' });

const dataStore = require('../../../../lib/dataStore');
const requestHelper = require('../../../../lib/requestHelper');
const keyDetailsHelper = require('../../../../lib/keyDetailsHelper');
const errorHelper = require('../../../../lib/helpers/errorHelper');
const formValidator = require('../../../../lib/formValidator');
const deleteSession = require('../../../../lib/deleteSession');
const deathCheckPayeeDetailsObject = require('../../../../lib/objects/view/deathCheckPayeeDetailsObject');
const deathPayeeAccountDetailsObject = require('../../../../lib/objects/view/deathPayeeAccountDetailsObject');
const deathPayeeDetailsObject = require('../../../../lib/objects/api/deathPayeeDetailsObject');
const deathPayeeArrearsObject = require('../../../../lib/objects/view/deathPayeeArrearsObject');

const deathPayeeDetailsUpdateApiUri = 'api/award/death-payee-account-details';

async function payeeDetail(req, res, inviteKey) {
  const detail = await dataStore.cacheRetriveAndStore(req, 'death-payee-details', inviteKey, () => {
    const requestCall = requestHelper.generateGetCall(`${res.locals.agentGateway}api/award/death-payee-details/${inviteKey}`, {}, 'award');
    return request(requestCall);
  });
  return detail;
}

async function getCheckPayeeDetails(req, res) {
  try {
    const awardDetails = dataStore.get(req, 'awardDetails');
    const keyDetails = keyDetailsHelper.formatter(awardDetails);
    const detail = await payeeDetail(req, res, awardDetails.inviteKey);
    const pageData = deathCheckPayeeDetailsObject.pageData(detail);
    res.render('pages/changes-enquiries/death-payee/check-details', {
      keyDetails,
      pageData,
    });
  } catch (err) {
    const traceID = requestHelper.getTraceID(err);
    const getPath = requestHelper.getPath(err);
    requestHelper.loggingHelper(err, getPath, traceID, res.locals.logger);
    res.render('pages/error', { status: '- There are no payee details.' });
  }
}

function getAccountDetails(req, res) {
  const awardDetails = dataStore.get(req, 'awardDetails');
  const keyDetails = keyDetailsHelper.formatter(awardDetails);
  const pageData = deathPayeeAccountDetailsObject.pageData();
  const details = dataStore.get(req, 'death-payee-account', 'death');
  res.render('pages/changes-enquiries/death-payee/account-details', {
    keyDetails,
    pageData,
    details,
  });
}

function postAccountDetails(req, res) {
  const details = req.body;
  const errors = formValidator.payeeAccountDetails(details);
  const awardDetails = dataStore.get(req, 'awardDetails');
  const keyDetails = keyDetailsHelper.formatter(awardDetails);
  if (Object.keys(errors).length === 0) {
    dataStore.save(req, 'death-payee-account', details, 'death');
    res.redirect('/changes-and-enquiries/personal/death/payee-arrears');
  } else {
    const pageData = deathPayeeAccountDetailsObject.pageData();
    res.render('pages/changes-enquiries/death-payee/account-details', {
      keyDetails,
      pageData,
      details,
      errors,
    });
  }
}

function getPayArrears(req, res) {
  const awardDetails = dataStore.get(req, 'awardDetails');
  const keyDetails = keyDetailsHelper.formatter(awardDetails);
  const paymentDetails = dataStore.get(req, awardDetails.inviteKey, 'death-payee-details');
  const payeeAccountDetails = dataStore.get(req, 'death-payee-account', 'death');
  const pageData = deathPayeeArrearsObject.pageData(paymentDetails, payeeAccountDetails);
  res.render('pages/changes-enquiries/death-payee/pay-arrears', {
    keyDetails,
    pageData,
  });
}

function getProcessArrearsErrorHandler(error, req, res) {
  const traceID = requestHelper.getTraceID(error);
  requestHelper.loggingHelper(error, deathPayeeDetailsUpdateApiUri, traceID, res.locals.logger);
  req.flash('error', errorHelper.globalErrorMessage(error, 'death payee details'));
  res.redirect('/changes-and-enquiries/personal/death/payee-arrears');
}

async function getProcessArrears(req, res) {
  const awardDetails = dataStore.get(req, 'awardDetails');
  const payeeAccountDetails = dataStore.get(req, 'death-payee-account', 'death');
  const deathPayeeDetails = deathPayeeDetailsObject.formatter(payeeAccountDetails, awardDetails);
  const putaccountDetailCall = requestHelper.generatePutCall(
    res.locals.agentGateway + deathPayeeDetailsUpdateApiUri,
    deathPayeeDetails,
    'award',
    req.user,
  );
  try {
    await request(putaccountDetailCall);
    req.flash('success', i18n.t('death-process-arrears:messages.success'));
    deleteSession.deleteDeathPayeeArrears(req);
    deleteSession.deleteChangesEnquiries(req);
    res.redirect('/changes-and-enquiries/personal');
  } catch (err) {
    getProcessArrearsErrorHandler(err, req, res);
  }
}

module.exports.getCheckPayeeDetails = getCheckPayeeDetails;
module.exports.getAccountDetails = getAccountDetails;
module.exports.postAccountDetails = postAccountDetails;
module.exports.getPayArrears = getPayArrears;
module.exports.getProcessArrears = getProcessArrears;
