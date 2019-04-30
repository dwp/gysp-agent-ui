const i18n = require('i18next');

i18n.init({ sendMissingTo: 'fallback' });

module.exports = {
  formatter(currentAwardDetail, type) {
    const contactDetail = Object.assign({}, currentAwardDetail.contactDetail);

    contactDetail.nino = currentAwardDetail.nino;

    if (type === 'home' || type === 'work' || type === 'mobile') {
      contactDetail[`${type}TelephoneNumber`] = null;
    }

    if (type === 'email') {
      contactDetail.email = null;
    }

    return contactDetail;
  },
};
