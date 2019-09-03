const i18n = require('i18next');

i18n.init({ sendMissingTo: 'fallback' });

module.exports = {
  timeline(type) {
    const json = { eventCategory: 'CONTACT' };

    if (type === 'home' || type === 'work' || type === 'mobile') {
      return Object.assign(json, {
        eventType: 'DELETE',
        eventName: `contact-details:timeline.${type}_phone_number.removed`,
      });
    }

    if (type === 'email') {
      return Object.assign(json, {
        eventType: 'DELETE',
        eventName: 'contact-details:timeline.email.removed',
      });
    }

    return {};
  },
  formatter(currentAwardDetail, type) {
    let contactDetail = { ...currentAwardDetail.contactDetail };

    contactDetail.nino = currentAwardDetail.nino;

    contactDetail = Object.assign(contactDetail, this.timeline(type));

    if (type === 'home' || type === 'work' || type === 'mobile') {
      contactDetail[`${type}TelephoneNumber`] = null;
    }

    if (type === 'email') {
      contactDetail.email = null;
    }

    return contactDetail;
  },
};
