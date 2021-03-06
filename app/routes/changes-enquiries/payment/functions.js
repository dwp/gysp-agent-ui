const request = require('request-promise');
const httpStatus = require('http-status-codes');
const requestHelper = require('../../../../lib/requestHelper');
const secondaryNavigationHelper = require('../../../../lib/helpers/secondaryNavigationHelper');
const timelineHelper = require('../../../../lib/helpers/timelineHelper');
const keyDetailsHelper = require('../../../../lib/keyDetailsHelper');
const dataStore = require('../../../../lib/dataStore');

const changeCircumstancesPaymentObject = require('../../../../lib/objects/changeCircumstancesPaymentObject');
const changeCircumstancesPaymentSummaryObject = require('../../../../lib/objects/changeCircumstancesPaymentSummaryObject');
const recentPaymentsTableObject = require('../../../../lib/objects/recentPaymentsTableObject');

const activeSecondaryNavigationSection = 'payment';

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
    const paymentServiceCall = requestHelper.generateGetCallWithFullResponse(
      `${res.locals.agentGateway}api/payment/paymentsummary/${req.session.searchedNino}`,
      {},
      'payment',
    );
    request(paymentServiceCall).then((response) => {
      if (response.statusCode === httpStatus.NOT_FOUND) {
        resolve(null);
      } else if (response.statusCode === httpStatus.OK) {
        resolve(response.body);
      } else {
        throw response;
      }
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
      } else if (response.statusCode === httpStatus.OK) {
        resolve(response.body);
      } else {
        throw response;
      }
    }).catch((err) => {
      reject(err);
    });
  });
}

function countPaymentsByStatus(payments, status) {
  if (payments && payments.recentPayments) {
    const filtered = payments.recentPayments.filter((payment) => payment.status === status);
    if (filtered) {
      return filtered.length;
    }
    return 0;
  }
  return 0;
}

async function getPaymentOverview(req, res) {
  if (req.session.searchedNino) {
    if (req.session['payment-frequency']) {
      delete req.session['payment-frequency'];
    }

    try {
      const [awardDetails, paymentDetails, recentPaymentsDetails] = await Promise.all([
        requestAwardService(res, req),
        requestPaymentSummary(res, req),
        requestRecentPayments(res, req),
      ]);

      req.session.awardDetails = awardDetails;
      const timelineDetails = await timelineHelper.getTimeline(req, res, 'PAYMENT');
      const details = changeCircumstancesPaymentObject.formatter(awardDetails);
      const keyDetails = keyDetailsHelper.formatter(awardDetails);
      const paymentSummary = changeCircumstancesPaymentSummaryObject.formatter(paymentDetails);
      const recentPaymentsTable = recentPaymentsTableObject.formatter(recentPaymentsDetails);
      const secondaryNavigationList = secondaryNavigationHelper.navigationItems(activeSecondaryNavigationSection);
      const numberOfReturnedPayments = countPaymentsByStatus(recentPaymentsDetails, 'RETURNED');
      dataStore.save(req, 'number-returned-payments', numberOfReturnedPayments);
      res.render('pages/changes-enquiries/payment/index', {
        details,
        keyDetails,
        paymentSummary,
        recentPaymentsTable,
        secondaryNavigationList,
        timelineDetails,
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
