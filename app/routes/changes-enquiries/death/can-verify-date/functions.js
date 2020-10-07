const routes = require('../../../../../config/constants').routes.changesAndEnquires;
const dateHelper = require('../../../../../lib/dateHelper');
const dataStore = require('../../../../../lib/dataStore');
const canVerifyDateValidation = require('../../../../../lib/validation/death/canVerifyDateValidation');

function getCanVerifyDateOfDeath(req, res) {
  const details = dataStore.get(req, 'can-verify-date-of-death', 'death');
  res.render('pages/changes-enquiries/death/can-verify-date', {
    backLink: routes.PERSONAL,
    formAction: req.fullUrl,
    details,
  });
}

function postCanVerifyDateOfDeath(req, res) {
  const details = req.body;
  const errors = canVerifyDateValidation(details);
  if (Object.keys(errors).length === 0) {
    dataStore.save(req, 'can-verify-date-of-death', details, 'death');
    dataStore.save(req, 'origin', 'canVerifyDateOfDeath', 'death');
    let redirectUrl = routes.death.VERIFY_DATE;
    if (details.canVerify === 'no') {
      redirectUrl = routes.death.DAP_NAME;
      const awardDetails = dataStore.get(req, 'awardDetails');
      dataStore.save(req, 'date-of-death', {
        ...dateHelper.dateComponents(awardDetails.deathDetail.dateOfDeath, 'x'),
        verification: 'NV',
      }, 'death');
    }
    res.redirect(redirectUrl);
  } else {
    res.render('pages/changes-enquiries/death/can-verify-date', {
      backLink: routes.PERSONAL,
      formAction: req.fullUrl,
      details,
      errors,
    });
  }
}

module.exports.getCanVerifyDateOfDeath = getCanVerifyDateOfDeath;
module.exports.postCanVerifyDateOfDeath = postCanVerifyDateOfDeath;
