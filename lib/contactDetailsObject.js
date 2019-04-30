const i18n = require('i18next');

i18n.init({ sendMissingTo: 'fallback' });

module.exports = {
  formatter(details, currentAwardDetail, type) {
    const contactDetail = Object.assign({}, currentAwardDetail.contactDetail);

    contactDetail.nino = currentAwardDetail.nino;

    if (details[`${type}PhoneNumber`]) {
      contactDetail[`${type}TelephoneNumber`] = details[`${type}PhoneNumber`];
    }

    if (details[type]) {
      contactDetail[type] = details[type].trim();
    }
    return contactDetail;
  },
};
