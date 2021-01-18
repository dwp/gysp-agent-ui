module.exports = {
  formatter(nino, form) {
    return {
      nino,
      eventCategory: 'PERSONAL',
      eventName: 'name-change:timeline.name.changed',
      eventType: 'CHANGE',
      firstName: form.firstName,
      surname: form.lastName,
    };
  },
};
