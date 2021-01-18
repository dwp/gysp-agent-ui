const fs = require('fs');
const i18n = require('i18next');

function countryValue({ code, name }) {
  return `${code}:${name}`;
}

module.exports = {
  getCountryList(selectedCountry = null, defaultOptionText = 'app:autocomplete.default') {
    const countries = JSON.parse(fs.readFileSync('resource/country-list.json', 'utf8'));

    const countiresList = countries.map((country) => {
      const countryObject = {
        value: countryValue(country),
        text: country.name,
      };
      if (selectedCountry !== null && countryValue(country) === selectedCountry) {
        countryObject.selected = true;
      }
      return countryObject;
    }).sort((a, b) => a.text.localeCompare(b.text));

    countiresList.unshift({
      value: '',
      text: i18n.t(defaultOptionText),
    });

    return countiresList;
  },
};
