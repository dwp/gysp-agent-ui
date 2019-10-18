const request = require('request-promise');
const httpStatus = require('http-status-codes');
const requestHelper = require('../../../../lib/requestHelper');
const keyDetailsHelper = require('../../../../lib/keyDetailsHelper');
const secondaryNavigationHelper = require('../../../../lib/helpers/secondaryNavigationHelper');
const dataStore = require('../../../../lib/dataStore');
const paymentHistoryDetailViewObject = require('../../../../lib/objects/paymentHistoryDetailViewObject');
const paymentStatusUpdate = require('../../../../lib/objects/paymentStatusUpdate');
const paymentReturnStatusObject = require('../../../../lib/objects/paymentReturnStatusObject');
const paymentUpdateStatusObject = require('../../../../lib/objects/paymentUpdateStatusObject');
const awardUpdateStatusObject = require('../../../../lib/objects/awardUpdateStatusObject');
const formValidator = require('../../../../lib/formValidator');
const deleteSession = require('../../../../lib/deleteSession');
const dateHelper = require('../../../../lib/dateHelper');
const timelineHelper = require('../../../../lib/helpers/timelineHelper');

const activeSecondaryNavigationSection = 'payment';
const secondaryNavigationList = secondaryNavigationHelper.navigationItems(activeSecondaryNavigationSection);

const returnPaymentApi = 'api/payment/return-payment';
const paymentUpdateStatusApi = 'api/payment/update-status';
const awardStatusUpdateApi = 'api/award/update-status';
const maxDaysAllowedToChangePaidStaus = 14;

// Payment and award statues
const [PAID, SENT, PAYMENTS_STOPPED, RECALLING] = ['PAID', 'SENT', 'PAYMENTSSTOPPED', 'RECALLING'];

async function paymentDetail(req, res, id) {
  const detail = await dataStore.cacheRetriveAndStore(req, 'payment-history', id, () => {
    const reviewAwardCall = requestHelper.generateGetCall(`${res.locals.agentGateway}api/payment/${id}`, {}, 'payment');
    return request(reviewAwardCall);
  });
  return detail;
}

function isAllowedToUpdate(status, creditDate) {
  if (status === PAID && dateHelper.daysBetweenNowDate(creditDate) <= maxDaysAllowedToChangePaidStaus) {
    return true;
  }
  if (status === SENT) {
    return true;
  }
  if (status === RECALLING) {
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
    const timelineDetails = await timelineHelper.getTimeline(req, res, 'PAYMENTDETAIL', id);
    res.render('pages/changes-enquiries/payment-history/detail', {
      keyDetails,
      secondaryNavigationList,
      paymentHistoryDetail,
      timelineDetails,
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
  const pathUri = requestHelper.getPath(error);
  requestHelper.loggingHelper(error, pathUri, traceID, res.locals.logger);
  if (error.statusCode === httpStatus.BAD_REQUEST) {
    req.flash('error', 'Error - connection refused.');
  } else if (error.statusCode === httpStatus.NOT_FOUND) {
    req.flash('error', 'Error - not found.');
  } else {
    req.flash('error', 'Error - could not save data.');
  }
}

function statusUpdateCalls(req, res, id, status) {
  const { inviteKey } = dataStore.get(req, 'awardDetails');
  const { statusUpdate } = req.body;
  let putPaymentStatusCall = null;
  let putAwardStatusCall = null;
  if (status === PAID) {
    const paymentUpdateStatusObjectFormatted = paymentReturnStatusObject.formatter(id, inviteKey);
    const awardUpdateStatusObjectFormatted = awardUpdateStatusObject.formatter(PAYMENTS_STOPPED, inviteKey);
    putPaymentStatusCall = requestHelper.generatePutCall(res.locals.agentGateway + returnPaymentApi, paymentUpdateStatusObjectFormatted, 'payment', req.user);
    putAwardStatusCall = requestHelper.generatePutCall(res.locals.agentGateway + awardStatusUpdateApi, awardUpdateStatusObjectFormatted, 'award', req.user);
  } else {
    const paymentUpdateStatusObjectFormatted = paymentUpdateStatusObject.formatter(id, status, statusUpdate);
    putPaymentStatusCall = requestHelper.generatePutCall(res.locals.agentGateway + paymentUpdateStatusApi, paymentUpdateStatusObjectFormatted, 'payment', req.user);
  }
  return {
    putPaymentStatusCall,
    putAwardStatusCall,
  };
}

async function postStatusUpdate(req, res) {
  const { id } = req.params;
  const input = req.body;
  const detail = await paymentDetail(req, res, id);
  const statusDetail = paymentStatusUpdate.formatter(detail, id);
  const errors = formValidator.updatePaymentStatus(input, statusDetail);
  if (Object.keys(errors).length === 0) {
    if (input.statusUpdate === 'yes' || detail.status === RECALLING) {
      const { putPaymentStatusCall, putAwardStatusCall } = statusUpdateCalls(req, res, id, detail.status);
      try {
        await request(putPaymentStatusCall);
        if (putAwardStatusCall) {
          await request(putAwardStatusCall);
        }
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
