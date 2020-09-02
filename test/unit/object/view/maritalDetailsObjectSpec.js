const { assert } = require('chai');

const i18next = require('i18next');
const i18nextFsBackend = require('i18next-fs-backend');

const i18nextConfig = require('../../../../config/i18next');

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
  partnerNino: 'AA123456A',
};

const nullPartnerDetails = {
  maritalStatus: 'Married',
  partnerDetail: {
    firstName: null,
    surname: null,
    allOtherNames: null,
    dob: null,
    partnerNino: null,
    marriageDate: '2000-04-19T17:26:35.089Z',
  },
};

const basePartnerDetailRows = [{
  key: { text: 'First name', classes: 'gysp-col-1' },
  value: { text: 'Joe' },
}, {
  key: { text: 'Last name', classes: 'gysp-col-1' },
  value: { text: 'Bloggs' },
}, {
  key: { text: 'Other names', classes: 'gysp-col-1' },
  value: { text: 'Middle' },
}, {
  key: { text: 'Date of birth', classes: 'gysp-col-1' },
  value: { text: '19 March 1953' },
  actions: {
    items: [{
      href: '/changes-and-enquiries/marital-details/date-of-birth',
      text: 'Change',
      visuallyHiddenText: 'date of birth',
      classes: 'govuk-link--no-visited-state',
    }],
  },
}, {
  key: { text: 'National Insurance number', classes: 'gysp-col-1' },
  value: { text: 'AA 12 34 56 A' },
  actions: {
    items: [{
      href: '/changes-and-enquiries/marital-details/nino',
      text: 'Change',
      visuallyHiddenText: 'national insurance number',
      classes: 'govuk-link--no-visited-state',
    }],
  },
}];

const blankPartnerDetailRows = [{
  key: { text: 'First name', classes: 'gysp-col-1' },
  value: { text: '' },
}, {
  key: { text: 'Last name', classes: 'gysp-col-1' },
  value: { text: '' },
}, {
  key: { text: 'Other names', classes: 'gysp-col-1' },
  value: { text: '' },
}, {
  key: { text: 'Date of birth', classes: 'gysp-col-1' },
  value: { text: '' },
  actions: {
    items: [{
      href: '/changes-and-enquiries/marital-details/date-of-birth',
      text: 'Add',
      visuallyHiddenText: 'date of birth',
      classes: 'govuk-link--no-visited-state',
    }],
  },
}, {
  key: { text: 'National Insurance number', classes: 'gysp-col-1' },
  value: { text: '' },
  actions: {
    items: [{
      href: '/changes-and-enquiries/marital-details/nino',
      text: 'Add',
      visuallyHiddenText: 'national insurance number',
      classes: 'govuk-link--no-visited-state',
    }],
  },
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
  before(async () => {
    await i18next
      .use(i18nextFsBackend)
      .init(i18nextConfig);
  });

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
        assert.equal(formatted.details.status, i18next.t(`marital-details:details.summary.values.status.${item.key}`));
        assert.equal(formatted.details.dateLabel, i18next.t(`marital-details:details.summary.keys.date.${item.key}`));
        assert.equal(formatted.details.date, '19 April 2000');
        assert.equal(formatted.partnerSummary.header, i18next.t(`marital-details:partner-details.header.${item.key}`));
        assert.deepEqual(formatted.partnerSummary.rows, basePartnerDetailRows);
      });
    });
  });
});
