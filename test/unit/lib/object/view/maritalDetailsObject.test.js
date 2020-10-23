const { assert } = require('chai');

const i18next = require('i18next');
const i18nextFsBackend = require('i18next-fs-backend');

const i18nextConfig = require('../../../../../config/i18next');

const maritalDetailsObject = require('../../../../../lib/objects/view/maritalDetailsObject');

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

const basePartnerDetail = {
  firstName: 'Joe',
  surname: 'Bloggs',
  allOtherNames: 'Middle',
  dob: '19 March 1953',
  dobVerified: false,
  partnerNino: 'AA 12 34 56 A',
};

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

    validObjectsArray.forEach((item) => {
      it(`should return object when partner details are present with a status of ${item.object.maritalStatus}`, () => {
        const formatted = maritalDetailsObject.formatter(item.object);
        assert.isObject(formatted);
        assert.equal(formatted.details.status, i18next.t(`marital-details:details.summary.values.status.${item.key}`));
        assert.equal(formatted.details.dateLabel, i18next.t(`marital-details:details.summary.keys.date.${item.key}`));
        assert.equal(formatted.details.date, '19 April 2000');
        assert.equal(formatted.status, item.key);
        assert.deepEqual(formatted.partnerDetail, basePartnerDetail);
      });
    });
  });
});
