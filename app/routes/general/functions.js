function landingPage(req, res) {
  res.render('pages/landing');
}

function accessibilityStatement(req, res) {
  res.render('pages/accessibility-statement');
}

module.exports.landingPage = landingPage;
module.exports.accessibilityStatement = accessibilityStatement;
