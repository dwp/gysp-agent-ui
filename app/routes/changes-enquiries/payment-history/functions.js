const request = require('request-promise');
const requestHelper = require('../../../../lib/requestHelper');
const keyDetailsHelper = require('../../../../lib/keyDetailsHelper');
const secondaryNavigationHelper = require('../../../../lib/helpers/secondaryNavigationHelper');
const dataStore = require('../../../../lib/dataStore');
const paymentHistoryDetailViewObject = require('../../../../lib/objects/paymentHistoryDetailViewObject');

const activeSecondaryNavigationSection = 'payment';
const secondaryNavigationList = secondaryNavigationHelper.navigationItems(activeSecondaryNavigationSection);

async function getPaymentHistoryDetail(req, res) {
  try {
    const awardDetails = dataStore.get(req, 'awardDetails');
    const keyDetails = keyDetailsHelper.formatter(awardDetails);
    const { id } = req.params;
    const detail = await dataStore.cacheRetriveAndStore(req, 'payment-history', id, () => {
      const reviewAwardCall = requestHelper.generateGetCall(`${res.locals.agentGateway}api/payment/${id}`, {}, 'payment');
      return request(reviewAwardCall);
    });

    const paymentDetail = paymentHistoryDetailViewObject.formatter(detail);

    res.render('pages/changes-enquiries/payment-history/detail', {
      keyDetails,
      secondaryNavigationList,
      paymentDetail,
    });
  } catch (err) {
    const traceID = requestHelper.getTraceID(err);
    const getPath = requestHelper.getPath(err);
    requestHelper.loggingHelper(err, getPath, traceID, res.locals.logger);
    res.render('pages/error', { status: '- There are no payment details.' });
  }
}

module.exports.getPaymentHistoryDetail = getPaymentHistoryDetail;
