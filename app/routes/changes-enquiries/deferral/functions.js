const i18n = require('i18next');
const request = require('request-promise');

const dataStore = require('../../../../lib/dataStore');
const dateHelper = require('../../../../lib/dateHelper');
const deferralObject = require('../../../../lib/objects/api/deferralObject');
const deleteSession = require('../../../../lib/deleteSession');
const errorHelper = require('../../../../lib/helpers/errorHelper');
const redirectHelper = require('../../../../lib/helpers/redirectHelper');
const requestHelper = require('../../../../lib/requestHelper');
const validator = require('../../../../lib/validation/deferralValidation');

const root = '/changes-and-enquiries/personal';

const confirmUrl = `${root}/deferral/confirm`;
const dateRequestReceivedUrl = `${root}/deferral/date-request-received`;
const defaultDateUrl = `${root}/deferral/deferral-date`;
const fromDateUrl = `${root}/deferral/from-date`;
const stopStatePensionUrl = `${root}/stop-state-pension`;
const updateUrl = `${root}/deferral/update`;

function getDateRequestReceived(req, res) {
  const details = dataStore.get(req, 'date-request-received', 'deferral');
  res.render('pages/changes-enquiries/deferral/date-request-received', {
    backLink: stopStatePensionUrl,
    details,
    formAction: dateRequestReceivedUrl,
  });
}

function postDateRequestReceived(req, res) {
  const details = req.body;
  const errors = validator.dateRequestReceived(details);
  if (Object.keys(errors).length === 0) {
    dataStore.save(req, 'date-request-received', details, 'deferral');
    res.redirect(defaultDateUrl);
  } else {
    res.render('pages/changes-enquiries/deferral/date-request-received', {
      backLink: stopStatePensionUrl,
      details,
      errors,
      formAction: dateRequestReceivedUrl,
    });
  }
}

function getDefaultDate(req, res) {
  const defaultDate = dataStore.get(req, 'default-date', 'deferral');
  const { statePensionDate } = dataStore.get(req, 'awardDetails');
  res.render('pages/changes-enquiries/deferral/default-date', {
    backLink: dateRequestReceivedUrl,
    defaultDate,
    formAction: defaultDateUrl,
    statePensionDate: dateHelper.longDate(statePensionDate),
  });
}

function postDefaultDate(req, res) {
  const details = req.body;
  const errors = validator.defaultDate(details);
  const { statePensionDate } = dataStore.get(req, 'awardDetails');
  if (Object.keys(errors).length === 0) {
    dataStore.save(req, 'default-date', details['default-date'], 'deferral');
    if (details['default-date'] === 'yes') {
      dataStore.save(req, 'back-href', '/personal/deferral/deferral-date', 'deferral');
      deleteSession.deleteSessionBySectionKey(req, 'deferral', 'from-date');
      res.redirect(confirmUrl);
    } else {
      res.redirect(fromDateUrl);
    }
  } else {
    res.render('pages/changes-enquiries/deferral/default-date', {
      backLink: dateRequestReceivedUrl,
      errors,
      formAction: defaultDateUrl,
      statePensionDate: dateHelper.longDate(statePensionDate),
    });
  }
}

function getFromDate(req, res) {
  const details = dataStore.get(req, 'from-date', 'deferral');
  res.render('pages/changes-enquiries/deferral/from-date', {
    backHref: '/personal/deferral/deferral-date',
    details,
    formAction: fromDateUrl,
  });
}

function postFromDate(req, res) {
  const details = req.body;
  const errors = validator.fromDate(details);
  if (Object.keys(errors).length === 0) {
    dataStore.save(req, 'back-href', '/personal/deferral/from-date', 'deferral');
    dataStore.save(req, 'from-date', details, 'deferral');
    res.redirect(confirmUrl);
  } else {
    res.render('pages/changes-enquiries/deferral/from-date', {
      backHref: '/deferral/deferral-date',
      details,
      errors,
      formAction: fromDateUrl,
    });
  }
}

function getConfirm(req, res) {
  const backHref = dataStore.get(req, 'back-href', 'deferral');
  const date = dataStore.get(req, 'from-date', 'deferral');
  const formatted = date && dateHelper.longDate({ year: date.year, month: date.month - 1, day: date.day });
  res.render('pages/changes-enquiries/deferral/confirm', {
    backHref,
    button: updateUrl,
    fromDate: formatted,
  });
}

async function getUpdate(req, res) {
  const { nino, statePensionDate } = dataStore.get(req, 'awardDetails');
  const {
    'from-date': date,
    'date-request-received': dateRequestReceived,
  } = dataStore.get(req, 'deferral');
  const formatted = date && { year: date.year, month: date.month - 1, day: date.day };
  const deferralDetails = deferralObject.formatter(nino, formatted || statePensionDate, dateRequestReceived);
  const recordDeferralApiUri = 'api/award/record-deferral';
  const putCall = requestHelper.generatePutCall(res.locals.agentGateway + recordDeferralApiUri, deferralDetails, 'award', req.user);
  try {
    await request(putCall);
    req.flash('success', i18n.t('deferral-update:messages.success'));
    const sessionKeys = ['stop-state-pension', 'deferral'];
    redirectHelper.redirectAndClearSessionKey(req, res, sessionKeys, root);
  } catch (err) {
    errorHelper.flashErrorAndRedirect(req, res, err, 'award', confirmUrl);
  }
}

module.exports.getDateRequestReceived = getDateRequestReceived;
module.exports.postDateRequestReceived = postDateRequestReceived;
module.exports.getDefaultDate = getDefaultDate;
module.exports.postDefaultDate = postDefaultDate;
module.exports.getFromDate = getFromDate;
module.exports.postFromDate = postFromDate;
module.exports.getConfirm = getConfirm;
module.exports.getUpdate = getUpdate;
