const i18n = require('i18next');
const deleteSession = require('../../lib/deleteSession');

const nextPageUrl = {
  'dap-name': '/changes-and-enquiries/personal/death/phone-number',
  'dap-phone-number': '/changes-and-enquiries/personal/death/address',
  'dap-postcode': '/changes-and-enquiries/personal/death/address-select',
  'dap-address': '/changes-and-enquiries/personal/death/payment',
};
const checkDetailsUrl = '/changes-and-enquiries/personal/death/check-details';

module.exports = {
  redirectBasedOnPageAndEditMode(page, editMode) {
    if (page === 'dap-postcode') {
      return nextPageUrl[page];
    }
    if (editMode) {
      return checkDetailsUrl;
    }
    return nextPageUrl[page];
  },
  redirectAndClearSessionKey(req, res, key, redirectUrl) {
    deleteSession.deleteSessionBySection(req, key);
    res.redirect(redirectUrl);
  },
  successAlertAndRedirect(req, res, localesKey, redirectUrl) {
    req.flash('success', i18n.t(localesKey));
    res.redirect(redirectUrl);
  },
};
