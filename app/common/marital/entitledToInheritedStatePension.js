const dataStore = require('../../../lib/dataStore');
const maritalValidation = require('../../../lib/validation/maritalValidation');
const requestFilterHelper = require('../../../lib/helpers/requestFilterHelper');

function getEntitledToInheritedStatePension(req, res, data) {
  const {
    template, backHref, details, errors,
  } = data;
  const sessionDetails = dataStore.get(req, 'entitled-to-inherited-state-pension', 'marital');
  const formDetails = sessionDetails || details;
  res.render('common/marital/entitled-to-inherited-state-pension', {
    template,
    backHref,
    formUrl: req.fullUrl,
    errors,
    details: formDetails,
  });
}

function postEntitledToInheritedStatePension(req, res, data) {
  const {
    template, backHref, nextRouteYes, nextRouteNo,
  } = data;
  const details = req.body;
  const errors = maritalValidation.entitledToInheritedStatePensionValidator(details);
  if (Object.keys(errors).length === 0) {
    const filteredRequest = requestFilterHelper.requestFilter(requestFilterHelper.maritalEntitledToInheritedStatePension(), details);
    dataStore.checkSessionAndSave(req, 'marital', 'entitled-to-inherited-state-pension', filteredRequest);
    if (filteredRequest.entitledInheritableStatePension === 'yes') {
      res.redirect(nextRouteYes);
    } else {
      res.redirect(nextRouteNo);
    }
  } else {
    getEntitledToInheritedStatePension(req, res, {
      template,
      backHref,
      details,
      errors,
    });
  }
}

module.exports = {
  getEntitledToInheritedStatePension,
  postEntitledToInheritedStatePension,
};
