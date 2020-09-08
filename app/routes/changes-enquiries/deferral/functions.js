const i18n = require('i18next');
const request = require('request-promise');

const dataStore = require('../../../../lib/dataStore');
const dateHelper = require('../../../../lib/dateHelper');
const deferralObject = require('../../../../lib/objects/deferralObject');
const errorHelper = require('../../../../lib/helpers/errorHelper');
const redirectHelper = require('../../../../lib/helpers/redirectHelper');
const requestHelper = require('../../../../lib/requestHelper');
const validator = require('../../../../lib/validation/deferralValidation');

const root = '/changes-and-enquiries/personal';

const dateRequestReceivedUrl = `${root}/deferral/date-request-received`;
const defaultDateUrl = `${root}/deferral/default-date`;
const stopStatePensionUrl = `${root}/stop-state-pension`;

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
    res.redirect(`${root}/deferral/default-date`);
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
      dataStore.save(req, 'from-date', statePensionDate, 'deferral');
      res.redirect(`${root}/deferral/confirm`);
    } else {
      res.redirect(`${root}/deferral/from-date`);
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

function getConfirm(req, res) {
  res.render('pages/changes-enquiries/deferral/confirm', {
    backLink: defaultDateUrl,
    button: `${root}/deferral/update`,
  });
}

async function getUpdate(req, res) {
  const { nino } = dataStore.get(req, 'awardDetails');
  const fromDate = dataStore.get(req, 'from-date', 'deferral');
  const deferralDetails = deferralObject.formatter(nino, fromDate);
  const recordDeferralApiUri = 'api/award/record-deferral';
  const putCall = requestHelper.generatePutCall(res.locals.agentGateway + recordDeferralApiUri, deferralDetails, 'award', req.user);
  try {
    await request(putCall);
    req.flash('success', i18n.t('deferral-update:messages.success'));
    const sessionKeys = ['stop-state-pension', 'deferral'];
    redirectHelper.redirectAndClearSessionKey(req, res, sessionKeys, root);
  } catch (err) {
    errorHelper.flashErrorAndRedirect(req, res, err, 'award', `${root}/deferral/update`);
  }
}

module.exports.getDateRequestReceived = getDateRequestReceived;
module.exports.postDateRequestReceived = postDateRequestReceived;
module.exports.getDefaultDate = getDefaultDate;
module.exports.postDefaultDate = postDefaultDate;
module.exports.getConfirm = getConfirm;
module.exports.getUpdate = getUpdate;
