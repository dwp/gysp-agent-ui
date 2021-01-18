const i18n = require('i18next');
const deleteSession = require('../../lib/deleteSession');

const nextPageUrl = {
  'dap-name': '/changes-and-enquiries/personal/death/phone-number',
  'dap-phone-number': '/changes-and-enquiries/personal/death/address',
  'dap-postcode': '/changes-and-enquiries/personal/death/address-select',
  'dap-address': '/changes-and-enquiries/personal/death/payment',
};
const checkDetailsUrl = '/changes-and-enquiries/personal/death/check-details';


const clearSessionKey = (req, key) => {
  let keyArray = key;
  if (!Array.isArray(key)) {
    keyArray = [key];
  }
  keyArray.forEach((item) => {
    deleteSession.deleteSessionBySection(req, item);
  });
};

const successAlert = (req, localesKey) => {
  req.flash('success', i18n.t(localesKey));
};

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

  clearSessionKeyAndRedirect(req, res, key, redirectUrl) {
    clearSessionKey(req, key);
    res.redirect(redirectUrl);
  },

  successAlertAndRedirect(req, res, localesKey, redirectUrl) {
    successAlert(req, localesKey);
    res.redirect(redirectUrl);
  },

  clearSessionKeySuccessAlertAndRedirect(req, res, key, localesKey, redirectUrl) {
    clearSessionKey(req, key);
    successAlert(req, localesKey);
    res.redirect(redirectUrl);
  },
};
