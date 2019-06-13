const request = require('request-promise');
const httpStatus = require('http-status-codes');
const requestHelper = require('../../../../lib/requestHelper');
const keyDetailsHelper = require('../../../../lib/keyDetailsHelper');
const secondaryNavigationHelper = require('../../../../lib/helpers/secondaryNavigationHelper');

const changeCircumstancesPaymentObject = require('../../../../lib/objects/changeCircumstancesPaymentObject');
const changeCircumstancesPaymentSummaryObject = require('../../../../lib/objects/changeCircumstancesPaymentSummaryObject');
const recentPaymentsTableObject = require('../../../../lib/objects/recentPaymentsTableObject');

const activeSecondaryNavigationSection = 'payment';
const secondaryNavigationList = secondaryNavigationHelper.navigationItems(activeSecondaryNavigationSection);

function requestAwardService(res, req) {
  return new Promise((resolve, reject) => {
    const awardServiceCall = requestHelper.generateGetCall(
      `${res.locals.agentGateway}api/award/${req.session.searchedNino}`,
      {},
      'award',
    );
    request(awardServiceCall).then((response) => {
      resolve(response);
    }).catch((err) => {
      reject(err);
    });
  });
}

function requestPaymentSummary(res, req) {
  return new Promise((resolve, reject) => {
    const paymentServiceCall = requestHelper.generateGetCall(
      `${res.locals.agentGateway}api/payment/paymentsummary/${req.session.searchedNino}`,
      {},
      'payment',
    );
    request(paymentServiceCall).then((response) => {
      resolve(response);
    }).catch((err) => {
      reject(err);
    });
  });
}

function requestRecentPayments(res, req) {
  return new Promise((resolve, reject) => {
    const paymentServiceCall = requestHelper.generateGetCallWithFullResponse(
      `${res.locals.agentGateway}api/payment/recentpayments/${req.session.searchedNino}`,
      {},
      'payment',
    );
    request(paymentServiceCall).then((response) => {
      if (response.statusCode === httpStatus.NOT_FOUND) {
        resolve(null);
      } else {
        resolve(response.body);
      }
    }).catch((err) => {
      reject(err);
    });
  });
}

async function getPaymentOverview(req, res) {
  if (req.session.searchedNino) {
    if (req.session['payment-frequency']) {
      delete req.session['payment-frequency'];
    }

    try {
      const [awardDetails, paymentDetails, recentPayments] = await Promise.all([
        requestAwardService(res, req),
        requestPaymentSummary(res, req),
        requestRecentPayments(res, req),
      ]);

      req.session.awardDetails = awardDetails;
      awardDetails.status = 'RECEIVING STATE PENSION';
      const keyDetails = keyDetailsHelper.formatter(awardDetails);
      const details = changeCircumstancesPaymentObject.formatter(awardDetails);
      const paymentSummary = changeCircumstancesPaymentSummaryObject.formatter(paymentDetails);
      const recentPaymentsTable = recentPaymentsTableObject.formatter(recentPayments);
      res.render('pages/changes-enquiries/payment/index', {
        details,
        paymentSummary,
        keyDetails,
        recentPaymentsTable,
        secondaryNavigationList,
      });
    } catch (err) {
      const traceID = requestHelper.getTraceID(err);
      requestHelper.loggingHelper(err, 'cannot get payment overview', traceID, res.locals.logger);
      res.render('pages/error', { status: '- Cannot get payment overview.' });
    }
  } else {
    res.render('pages/error', { status: '- NiNo does not exist in session' });
  }
}

module.exports.getPaymentOverview = getPaymentOverview;
