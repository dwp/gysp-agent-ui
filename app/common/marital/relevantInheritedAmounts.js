const dataStore = require('../../../lib/dataStore');
const maritalValidation = require('../../../lib/validation/maritalValidation');
const requestFilterHelper = require('../../../lib/helpers/requestFilterHelper');

function getRelevantInheritedAmounts(req, res, data) {
  const {
    template, backHref, details, errors,
  } = data;
  const sessionDetails = dataStore.get(req, 'relevant-inherited-amounts', 'marital');
  const formDetails = sessionDetails || details;
  res.render('common/marital/relevant-inherited-amounts', {
    template,
    formUrl: req.fullUrl,
    backHref,
    details: formDetails,
    errors,
  });
}

function postRelevantInheritedAmounts(req, res, data) {
  const { template, backHref, nextRoute } = data;
  const details = req.body;
  const errors = maritalValidation.relevantInheritedAmountsValidator(details);
  if (Object.keys(errors).length === 0) {
    const filteredRequest = requestFilterHelper.requestFilter(requestFilterHelper.maritalRelevantInheritedAmounts(), details);
    dataStore.save(req, 'relevant-inherited-amounts', filteredRequest, 'marital');
    res.redirect(nextRoute);
  } else {
    getRelevantInheritedAmounts(req, res, {
      template,
      backHref,
      details,
      errors,
    });
  }
}

module.exports = {
  getRelevantInheritedAmounts,
  postRelevantInheritedAmounts,
};
