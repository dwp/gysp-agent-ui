const { assert } = require('chai');
const taskDetailObject = require('../../../../lib/objects/view/taskDetailObject');

const claimData = require('../../../lib/claimData');

const optionalNullPartnerDetails = {
  ...claimData.validClaim(),
  maritalStatus: 'Married',
  partnerDetail: {
    firstName: 'Joe',
    surname: 'Bloggs',
    allOtherNames: null,
    dob: null,
    marriageDate: '2000-04-19T17:26:35.089Z',
  },
};

const optionalMissingPartnerDetails = {
  ...claimData.validClaim(),
  maritalStatus: 'Married',
  partnerDetail: {
    firstName: 'Joe',
    surname: 'Bloggs',
    marriageDate: '2000-04-19T17:26:35.089Z',
  },
};

const basePartnerDetailRows = [{
  key: { text: 'task-detail:partner-details.summary-keys.first-name', classes: 'govuk-!-width-two-thirds' },
  value: { text: 'Jane' },
}, {
  key: { text: 'task-detail:partner-details.summary-keys.surname', classes: 'govuk-!-width-two-thirds' },
  value: { text: 'Bloogs' },
}, {
  key: { text: 'task-detail:partner-details.summary-keys.other-names', classes: 'govuk-!-width-two-thirds' },
  value: { text: 'Middle' },
}, {
  key: { text: 'task-detail:partner-details.summary-keys.dob', classes: 'govuk-!-width-two-thirds' },
  value: { text: '19 March 1952' },
}];

const baseClaimantDetailRows = [{
  key: { text: 'task-detail:claimant-details.summary-keys.nino', classes: 'govuk-!-width-two-thirds' },
  value: { text: 'AA 37 07 73 A' },
}, {
  key: { text: 'task-detail:claimant-details.summary-keys.full-name', classes: 'govuk-!-width-two-thirds' },
  value: { text: 'Joe Bloggs' },
}, {
  key: { text: 'task-detail:claimant-details.summary-keys.address', classes: 'govuk-!-width-two-thirds' },
  value: { html: 'Sub Building Name, Building Name<br />Building Number Dependent Thoroughfare Name<br />Thoroughfare Name<br />Dependent Locality<br />Post Town<br />Post Code' },
}];

const blankPartnerDetailRows = [{
  key: { text: 'task-detail:partner-details.summary-keys.first-name', classes: 'govuk-!-width-two-thirds' },
  value: { text: 'Joe' },
}, {
  key: { text: 'task-detail:partner-details.summary-keys.surname', classes: 'govuk-!-width-two-thirds' },
  value: { text: 'Bloggs' },
}, {
  key: { text: 'task-detail:partner-details.summary-keys.other-names', classes: 'govuk-!-width-two-thirds' },
  value: { text: '' },
}, {
  key: { text: 'task-detail:partner-details.summary-keys.dob', classes: 'govuk-!-width-two-thirds' },
  value: { text: '' },
}];

const validObjects = {
  married: claimData.validClaimMarried(),
  civil: claimData.validClaimCivilPartner(),
};
const validObjectsArray = Object.entries(validObjects).map(([key, object]) => ({ key, object }));

describe('taskDetailsObject', () => {
  describe('formatter', () => {
    it('should return blank optional rows when values are null', () => {
      const formatted = taskDetailObject.formatter(optionalNullPartnerDetails);
      assert.deepEqual(formatted.partnerSummary.rows, blankPartnerDetailRows);
    });
    it('should return blank optional rows when values are not present', () => {
      const formatted = taskDetailObject.formatter(optionalMissingPartnerDetails);
      assert.deepEqual(formatted.partnerSummary.rows, blankPartnerDetailRows);
    });
    validObjectsArray.forEach((item) => {
      it(`should return object when partner details are present with a status of ${item.object.maritalStatus}`, () => {
        const formatted = taskDetailObject.formatter(item.object);
        assert.isObject(formatted);
        assert.equal(formatted.header, `task-detail:header.${item.key}`);
        assert.equal(formatted.partnerSummary.header, `task-detail:partner-details.header.${item.key}`);
        assert.deepEqual(formatted.partnerSummary.rows, basePartnerDetailRows);
        assert.equal(formatted.claimantSummary.header, 'task-detail:claimant-details.header');
        assert.deepEqual(formatted.claimantSummary.rows, baseClaimantDetailRows);
      });
    });
  });
});
