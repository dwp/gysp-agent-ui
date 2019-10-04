const request = require('request-promise');
const httpStatus = require('http-status-codes');
const requestHelper = require('../../../../lib/requestHelper');
const keyDetailsHelper = require('../../../../lib/keyDetailsHelper');
const secondaryNavigationHelper = require('../../../../lib/helpers/secondaryNavigationHelper');
const dataStore = require('../../../../lib/dataStore');
const paymentHistoryDetailViewObject = require('../../../../lib/objects/paymentHistoryDetailViewObject');
const paymentStatusUpdate = require('../../../../lib/objects/paymentStatusUpdate');
const paymentUpdateStatusObject = require('../../../../lib/objects/paymentUpdateStatusObject');
const formValidator = require('../../../../lib/formValidator');
const deleteSession = require('../../../../lib/deleteSession');
const dateHelper = require('../../../../lib/dateHelper');

const activeSecondaryNavigationSection = 'payment';
const secondaryNavigationList = secondaryNavigationHelper.navigationItems(activeSecondaryNavigationSection);

const updateStatusApi = 'api/payment/update-status';
const maxDaysAllowedToChangePaidStaus = 14;

async function paymentDetail(req, res, id) {
  const detail = await dataStore.cacheRetriveAndStore(req, 'payment-history', id, () => {
    const reviewAwardCall = requestHelper.generateGetCall(`${res.locals.agentGateway}api/payment/${id}`, {}, 'payment');
    return request(reviewAwardCall);
  });
  return detail;
}

function isAllowedToUpdate(status, creditDate) {
  if (status === 'PAID' && dateHelper.daysBetweenNowDate(creditDate) <= maxDaysAllowedToChangePaidStaus) {
    return true;
  }
  return false;
}

async function getPaymentHistoryDetail(req, res) {
  try {
    const awardDetails = dataStore.get(req, 'awardDetails');
    const keyDetails = keyDetailsHelper.formatter(awardDetails);
    const { id } = req.params;
    const detail = await paymentDetail(req, res, id);
    const paymentHistoryDetail = paymentHistoryDetailViewObject.formatter(detail, id);
    res.render('pages/changes-enquiries/payment-history/detail', {
      keyDetails,
      secondaryNavigationList,
      paymentHistoryDetail,
    });
  } catch (err) {
    const traceID = requestHelper.getTraceID(err);
    const getPath = requestHelper.getPath(err);
    requestHelper.loggingHelper(err, getPath, traceID, res.locals.logger);
    res.render('pages/error', { status: '- There are no payment details.' });
  }
}

async function getStatusUpdate(req, res) {
  try {
    const awardDetails = dataStore.get(req, 'awardDetails');
    const keyDetails = keyDetailsHelper.formatter(awardDetails);
    const { id } = req.params;
    const detail = await paymentDetail(req, res, id);
    if (!isAllowedToUpdate(detail.status, detail.creditDate)) {
      req.flash('error', 'Error - this payment cannot update payment status.');
      res.redirect(`/changes-and-enquiries/payment-history/${id}`);
    } else {
      const statusDetail = paymentStatusUpdate.formatter(detail, id);
      res.render('pages/changes-enquiries/payment-history/change-status', {
        keyDetails,
        statusDetail,
      });
    }
  } catch (err) {
    const traceID = requestHelper.getTraceID(err);
    const getPath = requestHelper.getPath(err);
    requestHelper.loggingHelper(err, getPath, traceID, res.locals.logger);
    res.render('pages/error', { status: '- There are no payment details.' });
  }
}

function postStatusUpdateErrorHandler(error, req, res) {
  const traceID = requestHelper.getTraceID(error);
  requestHelper.loggingHelper(error, updateStatusApi, traceID, res.locals.logger);
  if (error.statusCode === httpStatus.BAD_REQUEST) {
    req.flash('error', 'Error - connection refused.');
  } else if (error.statusCode === httpStatus.NOT_FOUND) {
    req.flash('error', 'Error - payment schedule not found.');
  } else {
    req.flash('error', 'Error - could not save data.');
  }
}

async function postStatusUpdate(req, res) {
  const { id } = req.params;
  const input = req.body;
  const detail = await paymentDetail(req, res, id);
  const statusDetail = paymentStatusUpdate.formatter(detail, id);
  const errors = formValidator.updatePaymentStatus(input, statusDetail);
  if (Object.keys(errors).length === 0) {
    if (input.statusUpdate === 'yes') {
      const statusUpdateObject = paymentUpdateStatusObject.formatter(detail, id);
      const putStatusCall = requestHelper.generatePutCall(res.locals.agentGateway + updateStatusApi, statusUpdateObject, 'payment', req.user);
      try {
        await request(putStatusCall);
        deleteSession.deletePaymentDetail(req, id);
        res.redirect('/changes-and-enquiries/payment');
      } catch (err) {
        postStatusUpdateErrorHandler(err, req, res);
        res.redirect(`/changes-and-enquiries/payment-history/${id}/status-update`);
      }
    } else {
      res.redirect(`/changes-and-enquiries/payment-history/${id}`);
    }
  } else {
    const awardDetails = dataStore.get(req, 'awardDetails');
    const keyDetails = keyDetailsHelper.formatter(awardDetails);
    res.render('pages/changes-enquiries/payment-history/change-status', {
      keyDetails,
      statusDetail,
      errors,
    });
  }
}

module.exports.getPaymentHistoryDetail = getPaymentHistoryDetail;
module.exports.getStatusUpdate = getStatusUpdate;
module.exports.postStatusUpdate = postStatusUpdate;
