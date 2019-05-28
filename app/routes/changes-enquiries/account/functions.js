const request = require('request-promise');
const httpStatus = require('http-status-codes');

const formValidator = require('../../../../lib/formValidator');
const requestHelper = require('../../../../lib/requestHelper');
const keyDetailsHelper = require('../../../../lib/keyDetailsHelper');
const secondaryNavigationHelper = require('../../../../lib/helpers/secondaryNavigationHelper');
const accountDetailsObject = require('../../../../lib/objects/accountDetailsObject');

const activeSecondaryNavigationSection = 'payment';
const secondaryNavigationList = secondaryNavigationHelper.navigationItems(activeSecondaryNavigationSection);

const paymentDetailsUpdateApiUri = 'api/award/payee';

function getChangeBankBuildingAccountDetails(req, res) {
  const keyDetails = keyDetailsHelper.formatter(req.session.awardDetails);
  res.render('pages/changes-enquiries/account/index', {
    keyDetails,
    secondaryNavigationList,
  });
}

function globalErrorMessage(error) {
  if (error.statusCode === httpStatus.BAD_REQUEST) {
    return 'Error - connection refused.';
  }
  if (error.statusCode === httpStatus.NOT_FOUND) {
    return 'Error - payment schedule not found.';
  }
  return 'Error - could not save data.';
}

function postChangeBankBuildingAccountDetailsErrorHandler(error, req, res, keyDetails) {
  const traceID = requestHelper.getTraceID(error);
  requestHelper.loggingHelper(error, paymentDetailsUpdateApiUri, traceID, res.locals.logger);
  res.render('pages/changes-enquiries/account/index', {
    keyDetails,
    secondaryNavigationList,
    details: req.body,
    globalError: globalErrorMessage(error),
  });
}

function postChangeBankBuildingAccountDetails(req, res) {
  const errors = formValidator.bankBuildingAccountDetails(req.body);
  const keyDetails = keyDetailsHelper.formatter(req.session.awardDetails);
  if (Object.keys(errors).length === 0) {
    const accountDetails = accountDetailsObject.formatter(req.body, req.session.awardDetails);
    const putaccountDetailCall = requestHelper.generatePutCall(
      res.locals.agentGateway + paymentDetailsUpdateApiUri,
      accountDetails,
      'award',
      req.user,
    );
    request(putaccountDetailCall).then(() => {
      res.redirect('/changes-and-enquiries/payment');
    }).catch((err) => {
      postChangeBankBuildingAccountDetailsErrorHandler(err, req, res, keyDetails);
    });
  } else {
    res.render('pages/changes-enquiries/account/index', {
      keyDetails,
      secondaryNavigationList,
      details: req.body,
      errors,
    });
  }
}

module.exports.getChangeBankBuildingAccountDetails = getChangeBankBuildingAccountDetails;
module.exports.postChangeBankBuildingAccountDetails = postChangeBankBuildingAccountDetails;
