const i18n = require('i18next');
const httpStatus = require('http-status-codes');
const request = require('request-promise');

const dataStore = require('../../../../lib/dataStore');
const errorHelper = require('../../../../lib/helpers/errorHelper');
const { formatDate: fd } = require('../../../../lib/helpers/general');
const manualPaymentObject = require('../../../../lib/objects/api/manualPaymentObject');
const manualPaymentTableObject = require('../../../../lib/objects/view/manualPaymentTableObject');
const redirectHelper = require('../../../../lib/helpers/redirectHelper');
const requestHelper = require('../../../../lib/requestHelper');
const validator = require('../../../../lib/validation/manualPaymentValidation');

const root = '/changes-and-enquiries/payment';

const confirmUrl = `${root}/manual-payment/confirm`;
const detailsUrl = `${root}/manual-payment/details`;
const updateUrl = `${root}/manual-payment/update`;

function getDetails(req, res) {
  const formData = dataStore.get(req, 'formData', 'manual-payment');
  res.render('pages/changes-enquiries/manual-payment/details', {
    backLink: root,
    formAction: detailsUrl,
    formData,
  });
}

async function postDetails(req, res) {
  const formData = req.body;
  const errors = validator.details(formData);
  if (Object.keys(errors).length === 0) {
    dataStore.save(req, 'formData', formData, 'manual-payment');

    const { inviteKey } = dataStore.get(req, 'awardDetails');

    const {
      fromDay, fromMonth, fromYear,
      toDay, toMonth, toYear,
      paymentDay, paymentMonth, paymentYear,
    } = formData;

    const api = 'api/payment/manual-payment-calculation';
    const gateway = res.locals.agentGateway;
    const queryString = `?inviteKey=${inviteKey}`
                      + `&startDate=${fromYear}-${fd(fromMonth)}-${fd(fromDay)}`
                      + `&endDate=${toYear}-${fd(toMonth)}-${fd(toDay)}`
                      + `&paymentDate=${paymentYear}-${fd(paymentMonth)}-${fd(paymentDay)}`;

    const getCall = requestHelper.generateGetCall(gateway + api + queryString, {}, 'payment');

    try {
      const apiResponse = await request(getCall);

      dataStore.save(req, 'apiResponse', apiResponse, 'manual-payment');

      res.redirect(confirmUrl);
    } catch (err) {
      const redirectUrl = detailsUrl;
      if (err.statusCode === httpStatus.INTERNAL_SERVER_ERROR) {
        errorHelper.logMessage(res, err);
        req.flash('error', i18n.t('manual-payment-details:errors.invalid'));
        res.redirect(redirectUrl);
      } else {
        errorHelper.flashErrorAndRedirect(req, res, err, 'payment', redirectUrl);
      }
    }
  } else {
    res.render('pages/changes-enquiries/manual-payment/details', {
      backLink: root,
      errors,
      formAction: detailsUrl,
      formData,
    });
  }
}

function getConfirm(req, res) {
  const { apiResponse } = dataStore.get(req, 'manual-payment');

  const tableData = manualPaymentTableObject.formatter(apiResponse);

  res.render('pages/changes-enquiries/manual-payment/confirm', {
    backLink: detailsUrl,
    button: updateUrl,
    tableData,
  });
}

async function getUpdate(req, res) {
  const { apiResponse } = dataStore.get(req, 'manual-payment');

  const api = 'api/payment/manual-payment';
  const gateway = res.locals.agentGateway;
  const manualPaymentDetails = manualPaymentObject.formatter(apiResponse);

  const postCall = requestHelper.generatePostCall(gateway + api, manualPaymentDetails, 'payment', req.user);

  try {
    await request(postCall);

    req.flash('success', i18n.t('manual-payment-update:messages.success'));

    redirectHelper.clearSessionKeyAndRedirect(req, res, ['manual-payment'], root);
  } catch (err) {
    errorHelper.flashErrorAndRedirect(req, res, err, 'payment', confirmUrl);
  }
}

module.exports = {
  getDetails,
  postDetails,
  getConfirm,
  getUpdate,
};
