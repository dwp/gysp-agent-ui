const { assert } = require('chai');
const maritalDetailsObject = require('../../../../lib/objects/view/maritalDetailsObject');

const validSingleObject = {
  maritalStatus: 'Single',
  partnerDetail: null,
};

const basePartnerObject = {
  firstName: 'Joe',
  surname: 'Bloggs',
  allOtherNames: 'Middle',
  dob: '1953-03-19T17:26:35.089Z',
};

const nullPartnerDetails = {
  maritalStatus: 'Married',
  partnerDetail: {
    firstName: null,
    surname: null,
    allOtherNames: null,
    dob: null,
    marriageDate: '2000-04-19T17:26:35.089Z',
  },
};

const basePartnerDetailRows = [{
  key: { text: 'marital-details:partner-details.summary-keys.first-name', classes: 'govuk-!-width-one-half' },
  value: { text: 'Joe' },
}, {
  key: { text: 'marital-details:partner-details.summary-keys.surname', classes: 'govuk-!-width-one-half' },
  value: { text: 'Bloggs' },
}, {
  key: { text: 'marital-details:partner-details.summary-keys.other-names', classes: 'govuk-!-width-one-half' },
  value: { text: 'Middle' },
}, {
  key: { text: 'marital-details:partner-details.summary-keys.dob', classes: 'govuk-!-width-one-half' },
  value: { text: '19 March 1953' },
}];

const blankPartnerDetailRows = [{
  key: { text: 'marital-details:partner-details.summary-keys.first-name', classes: 'govuk-!-width-one-half' },
  value: { text: '' },
}, {
  key: { text: 'marital-details:partner-details.summary-keys.surname', classes: 'govuk-!-width-one-half' },
  value: { text: '' },
}, {
  key: { text: 'marital-details:partner-details.summary-keys.other-names', classes: 'govuk-!-width-one-half' },
  value: { text: '' },
}, {
  key: { text: 'marital-details:partner-details.summary-keys.dob', classes: 'govuk-!-width-one-half' },
  value: { text: '' },
}];

const validObjects = {
  married: {
    maritalStatus: 'Married', partnerDetail: { ...basePartnerObject, marriageDate: '2000-04-19T17:26:35.089Z' },
  },
  civil: {
    maritalStatus: 'Civil Partnership', partnerDetail: { ...basePartnerObject, civilPartnershipDate: '2000-04-19T17:26:35.089Z' },
  },
  divorced: {
    maritalStatus: 'Divorced', partnerDetail: { ...basePartnerObject, divorcedDate: '2000-04-19T17:26:35.089Z' },
  },
  dissolved: {
    maritalStatus: 'Dissolved', partnerDetail: { ...basePartnerObject, dissolvedDate: '2000-04-19T17:26:35.089Z' },
  },
  widowed: {
    maritalStatus: 'Widowed', partnerDetail: { ...basePartnerObject, widowedDate: '2000-04-19T17:26:35.089Z' },
  },
};
const validObjectsArray = Object.entries(validObjects).map(([key, object]) => ({ key, object }));

describe('maritalDetailsObject ', () => {
  describe('formatter', () => {
    it('should return null when partner details are null', () => {
      const formatted = maritalDetailsObject.formatter(validSingleObject);
      assert.isNull(formatted);
    });
    it('should return blank partner details when values are null', () => {
      const formatted = maritalDetailsObject.formatter(nullPartnerDetails);
      assert.deepEqual(formatted.partnerSummary.rows, blankPartnerDetailRows);
    });
    validObjectsArray.forEach((item) => {
      it(`should return object when partner details are present with a status of ${item.object.maritalStatus}`, () => {
        const formatted = maritalDetailsObject.formatter(item.object);
        assert.isObject(formatted);
        assert.equal(formatted.details.status, `marital-details:details.summary.values.status.${item.key}`);
        assert.equal(formatted.details.dateLabel, `marital-details:details.summary.keys.date.${item.key}`);
        assert.equal(formatted.details.date, '19 April 2000');
        assert.equal(formatted.partnerSummary.header, `marital-details:partner-details.header.${item.key}`);
        assert.deepEqual(formatted.partnerSummary.rows, basePartnerDetailRows);
      });
    });
  });
});
