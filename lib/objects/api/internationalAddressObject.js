module.exports = {
  formatter(nino, form) {
    const country = form.country.split(':');

    return {
      nino,
      eventCategory: 'CONTACT',
      eventType: 'CHANGE',
      eventName: 'address:timeline.address.changed',
      line1: form['address-line-1'],
      line2: form['address-line-2'],
      line3: form['address-line-3'] || null,
      line4: form['address-line-4'] || null,
      line5: form['address-line-5'] || null,
      countryCode: country[0],
      country: country[1],
    };
  },
};
