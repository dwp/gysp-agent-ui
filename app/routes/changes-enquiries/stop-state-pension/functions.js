const dataStore = require('../../../../lib/dataStore');
const validator = require('../../../../lib/validation/stopStatePension');

const root = '/changes-and-enquiries/personal';

const postStopStatePensionUrl = `${root}/stop-state-pension`;

function getStopStatePension(req, res) {
  const reason = dataStore.get(req, 'reason', 'stop-state-pension');
  res.render('pages/changes-enquiries/stop-state-pension/index', {
    backLink: root,
    formAction: postStopStatePensionUrl,
    reason,
  });
}

function postStopStatePension(req, res) {
  const details = req.body;
  const errors = validator.stopStatePension(details);
  if (Object.keys(errors).length === 0) {
    const { reason } = details;
    const route = reason === 'death' ? `${root}/death` : `${root}/deferral/date-request-received`;
    dataStore.save(req, 'reason', reason, 'stop-state-pension');
    res.redirect(route);
  } else {
    res.render('pages/changes-enquiries/stop-state-pension/index', {
      backLink: root,
      formAction: postStopStatePensionUrl,
      errors,
    });
  }
}

module.exports.getStopStatePension = getStopStatePension;
module.exports.postStopStatePension = postStopStatePension;
