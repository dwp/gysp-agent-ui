const request = require('request-promise');
const requestHelper = require('../../../../lib/requestHelper');
const keyDetailsHelper = require('../../../../lib/keyDetailsHelper');

const changeCircumstancesPaymentObject = require('../../../../lib/objects/changeCircumstancesPaymentObject');
const changeCircumstancesPaymentSummaryObject = require('../../../../lib/objects/changeCircumstancesPaymentSummaryObject');

const activeGlobalNavigationSection = 'payment';

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

function requestPaymentService(res, req) {
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

async function getPaymentOverview(req, res) {
  if (req.session.searchedNino) {
    if (req.session['payment-frequency']) {
      delete req.session['payment-frequency'];
    }

    try {
      const response = await Promise.all([
        requestAwardService(res, req),
        requestPaymentService(res, req),
      ]);

      const awardDetails = response[0];
      req.session.awardDetails = awardDetails;
      awardDetails.status = 'RECEIVING STATE PENSION';
      const details = changeCircumstancesPaymentObject.formatter(response[0]);
      const paymentSummary = changeCircumstancesPaymentSummaryObject.formatter(response[1]);
      const keyDetails = keyDetailsHelper.formatter(awardDetails);
      res.render('pages/changes-enquiries/payment/index', {
        details, paymentSummary, keyDetails, activeGlobalNavigationSection,
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
