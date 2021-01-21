module.exports = {
  formatter(nino, originalFirstName, originalLastName, form) {
    return {
      nino,
      eventCategory: 'PERSONAL',
      eventName: 'name-change:timeline.name.changed',
      eventType: 'CHANGE',
      firstName: form.firstName || originalFirstName,
      surname: form.lastName || originalLastName,
    };
  },
};
