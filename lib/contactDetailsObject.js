module.exports = {
  timeline(details, type) {
    const telephone = new RegExp('^(?:home|mobile|work)$');
    const email = new RegExp('^(?:email)$');

    const json = { eventCategory: 'CONTACT' };

    if (telephone.test(type)) {
      if (details[`${type}TelephoneNumber`] === null) {
        return Object.assign(json, {
          eventType: 'ADD',
          eventName: `contact-details:timeline.${type}_phone_number.added`,
        });
      }
      return Object.assign(json, {
        eventType: 'CHANGE',
        eventName: `contact-details:timeline.${type}_phone_number.changed`,
      });
    }
    if (email.test(type)) {
      if (details[type] === null) {
        return Object.assign(json, {
          eventType: 'ADD',
          eventName: 'contact-details:timeline.email.added',
        });
      }
      return Object.assign(json, {
        eventType: 'CHANGE',
        eventName: 'contact-details:timeline.email.changed',
      });
    }
    return {};
  },
  formatter(details, currentAwardDetail, type) {
    let contactDetail = Object.assign({}, currentAwardDetail.contactDetail);

    contactDetail.nino = currentAwardDetail.nino;

    contactDetail = Object.assign(contactDetail, this.timeline(contactDetail, type));

    if (details[`${type}PhoneNumber`]) {
      contactDetail[`${type}TelephoneNumber`] = details[`${type}PhoneNumber`];
    }

    if (details[type]) {
      contactDetail[type] = details[type].trim();
    }

    return contactDetail;
  },
};
