const httpStatus = require('http-status-codes');
const request = require('request-promise');

const requestHelper = require('../../../../lib/requestHelper');
const keyDetailsHelper = require('../../../../lib/keyDetailsHelper');
const formValidator = require('../../../../lib/formValidator');
const enterAmountsDetailsObject = require('../../../../lib/objects/enterAmountsDetailsObject');
const dataStore = require('../../../../lib/dataStore');

function getEnterAmounts(req, res) {
  req.session.processClaim.claimDetail.dateOfBirth = req.session.processClaim.claimDetail.dob;
  const keyDetails = keyDetailsHelper.formatter(req.session.processClaim.claimDetail);
  const details = dataStore.get(req, 'enteramounts');
  res.render('pages/process-claim/enter-amounts/index', { keyDetails, details });
}

function postEnterAmounts(req, res) {
  const keyDetails = keyDetailsHelper.formatter(req.session.processClaim.claimDetail);
  const details = req.body;
  const errors = formValidator.validateSuffixAndAmounts(details);
  if (Object.keys(errors).length === 0) {
    dataStore.save(req, 'enteramounts', details);
    const detailsObject = enterAmountsDetailsObject.formatter(details, req.session.processClaim.claimDetail.inviteKey);
    if (req.body && req.session.processClaim.claimDetail.inviteKey) {
      const putUpdatePaymentDetails = requestHelper.generatePutCall(
        `${res.locals.agentGateway}api/award/updatepaymentdetails/`,
        detailsObject,
        'award',
      );
      request(putUpdatePaymentDetails)
        .then(() => res.redirect('/process-claim/payment'))
        .catch((err) => {
          const traceID = requestHelper.getTraceID(err);
          if (err.statusCode === httpStatus.NOT_FOUND) {
            requestHelper.loggingHelper(err, 'Award not found', traceID, res.locals.logger);
            res.render('pages/error', { status: '- Award not found.' });
          } else if (err.statusCode === httpStatus.BAD_REQUEST) {
            requestHelper.loggingHelper(err, 'Bad request or validation errors in the request', res.locals.logger);
            res.render('pages/error', { status: '- Bad request or validation errors in the request.' });
          }
        });
    } else {
      res.status(httpStatus.INTERNAL_SERVER_ERROR);
      res.render('pages/error', { status: '- Error while processing the request.' });
    }
  } else {
    res.render('pages/process-claim/enter-amounts/index', { keyDetails, details, errors });
  }
}

module.exports.getEnterAmounts = getEnterAmounts;
module.exports.postEnterAmounts = postEnterAmounts;
