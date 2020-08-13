const { assert } = require('chai');
const taskDetailObject = require('../../../../lib/objects/view/taskDetailObject');

const claimData = require('../../../lib/claimData');

const optionalNullPartnerDetails = {
  ...claimData.validClaim(),
  maritalStatus: 'Married',
  maritalStatusVerified: true,
  partnerDetail: {
    firstName: 'Joe',
    surname: 'Bloggs',
    marriageDate: 946684800000,
    allOtherNames: null,
    dob: null,
    partnerNino: null,
  },
};
const optionalNullPartnerDetailsCivil = {
  ...claimData.validClaim(),
  maritalStatus: 'Civil Partnership',
  maritalStatusVerified: true,
  partnerDetail: {
    firstName: 'Joe',
    surname: 'Bloggs',
    civilPartnershipDate: 946684800000,
    allOtherNames: null,
    dob: null,
    partnerNino: null,
  },
};

const optionalMissingPartnerDetails = {
  ...claimData.validClaim(),
  maritalStatus: 'Married',
  maritalStatusVerified: true,
  partnerDetail: {
    firstName: 'Joe',
    surname: 'Bloggs',
    marriageDate: 946684800000,
  },
};

const optionalMissingPartnerDetailsCivil = {
  ...claimData.validClaim(),
  maritalStatus: 'Civil Partnership',
  maritalStatusVerified: true,
  partnerDetail: {
    firstName: 'Joe',
    surname: 'Bloggs',
    civilPartnershipDate: 946684800000,
  },
};

const partnerAllElementsVerified = {
  ...claimData.validClaim(),
  maritalStatus: 'Married',
  maritalStatusVerified: true,
  partnerDetail: {
    firstName: 'Joe',
    surname: 'Bloggs',
    dob: '1952-03-19T00:00:00.000Z',
    dobVerified: true,
    marriageDate: 946684800000,
    partnerNino: 'AA123456C',
  },
};

const basePartnerDetailRows = (status) => [{
  key: { text: 'task-detail:partner-details.summary-keys.nino' },
  value: { text: 'AA123456C' },
  actions: {
    items: [{
      classes: 'govuk-link--no-visited-state',
      href: '/tasks/task/consider-entitlement/partner-nino',
      text: 'app:link.change',
      visuallyHiddenText: 'task-detail:partner-details.summary-keys.nino',
    }],
  },
}, {
  key: { text: 'task-detail:partner-details.summary-keys.first-name' },
  value: { text: 'Jane' },
}, {
  key: { text: 'task-detail:partner-details.summary-keys.last-name' },
  value: { text: 'Bloogs' },
}, {
  key: { text: 'task-detail:partner-details.summary-keys.other-names' },
  value: { text: 'Middle' },
}, {
  key: { text: 'task-detail:partner-details.summary-keys.dob' },
  value: { html: '19 March 1952 <span class="govuk-!-font-weight-bold govuk-!-padding-left-5 govuk-!-padding-right-2 gysp-secondary-text-colour gysp-status gysp-status--inactive">\n    app:verification-status.not-verified\n  </span>' },
  actions: {
    items: [{
      classes: 'govuk-link--no-visited-state',
      href: '/tasks/task/consider-entitlement/date-of-birth',
      text: 'app:link.change',
      visuallyHiddenText: 'task-detail:partner-details.summary-keys.dob',
    }],
  },
}, {
  key: { text: `task-detail:partner-details.summary-keys.marital-date.${status}` },
  value: { html: '19 March 2000 <span class="govuk-!-font-weight-bold govuk-!-padding-left-5 govuk-!-padding-right-2 gysp-secondary-text-colour gysp-status gysp-status--inactive">\n    app:verification-status.not-verified\n  </span>' },
  actions: {
    items: [{
      classes: 'govuk-link--no-visited-state',
      href: '/tasks/task/consider-entitlement/marital-date',
      text: 'app:link.change',
      visuallyHiddenText: `task-detail:partner-details.summary-keys.marital-date.${status}`,
    }],
  },
}];

const updatedPartnerDetailRows = (status) => [{
  key: { text: 'task-detail:partner-details.summary-keys.nino' },
  value: { text: 'AA654321C' },
  actions: {
    items: [{
      classes: 'govuk-link--no-visited-state',
      href: '/tasks/task/consider-entitlement/partner-nino',
      text: 'app:link.change',
      visuallyHiddenText: 'task-detail:partner-details.summary-keys.nino',
    }],
  },
}, {
  key: { text: 'task-detail:partner-details.summary-keys.first-name' },
  value: { text: 'Jane' },
}, {
  key: { text: 'task-detail:partner-details.summary-keys.last-name' },
  value: { text: 'Bloogs' },
}, {
  key: { text: 'task-detail:partner-details.summary-keys.other-names' },
  value: { text: 'Middle' },
}, {
  key: { text: 'task-detail:partner-details.summary-keys.dob' },
  value: { html: '6 July 1952 <span class="govuk-!-font-weight-bold govuk-!-padding-left-5 govuk-!-padding-right-2 gysp-secondary-text-colour gysp-status gysp-status--active">\n    app:verification-status.verified\n  </span>' },
}, {
  key: { text: `task-detail:partner-details.summary-keys.marital-date.${status}` },
  value: { html: '19 May 2000 <span class="govuk-!-font-weight-bold govuk-!-padding-left-5 govuk-!-padding-right-2 gysp-secondary-text-colour gysp-status gysp-status--active">\n    app:verification-status.verified\n  </span>' },
}];

const verifiedPartnerDetailRows = (status) => [{
  key: { text: 'task-detail:partner-details.summary-keys.nino' },
  value: { text: 'AA123456C' },
  actions: {
    items: [{
      classes: 'govuk-link--no-visited-state',
      href: '/tasks/task/consider-entitlement/partner-nino',
      text: 'app:link.change',
      visuallyHiddenText: 'task-detail:partner-details.summary-keys.nino',
    }],
  },
}, {
  key: { text: 'task-detail:partner-details.summary-keys.first-name' },
  value: { text: 'Joe' },
}, {
  key: { text: 'task-detail:partner-details.summary-keys.last-name' },
  value: { text: 'Bloggs' },
}, {
  key: { text: 'task-detail:partner-details.summary-keys.other-names' },
  value: { text: '' },
}, {
  key: { text: 'task-detail:partner-details.summary-keys.dob' },
  value: { html: '19 March 1952 <span class="govuk-!-font-weight-bold govuk-!-padding-left-5 govuk-!-padding-right-2 gysp-secondary-text-colour gysp-status gysp-status--active">\n    app:verification-status.verified\n  </span>' },
}, {
  key: { text: `task-detail:partner-details.summary-keys.marital-date.${status}` },
  value: { html: '1 January 2000 <span class="govuk-!-font-weight-bold govuk-!-padding-left-5 govuk-!-padding-right-2 gysp-secondary-text-colour gysp-status gysp-status--active">\n    app:verification-status.verified\n  </span>' },
}];

const baseClaimantDetailRows = [{
  key: { text: 'task-detail:claimant-details.summary-keys.nino' },
  value: { text: 'AA370773A' },
}, {
  key: { text: 'task-detail:claimant-details.summary-keys.full-name' },
  value: { text: 'Joe Bloggs' },
}, {
  key: { text: 'task-detail:claimant-details.summary-keys.address' },
  value: { html: 'Sub Building Name, Building Name<br />Building Number Dependent Thoroughfare Name<br />Thoroughfare Name<br />Dependent Locality<br />Post Town<br />Post Code' },
}];

const blankPartnerDetailRows = (status) => [{
  key: { text: 'task-detail:partner-details.summary-keys.nino' },
  value: { text: '' },
  actions: {
    items: [{
      classes: 'govuk-link--no-visited-state',
      href: '/tasks/task/consider-entitlement/partner-nino',
      text: 'app:link.add',
      visuallyHiddenText: 'task-detail:partner-details.summary-keys.nino',
    }],
  },
}, {
  key: { text: 'task-detail:partner-details.summary-keys.first-name' },
  value: { text: 'Joe' },
}, {
  key: { text: 'task-detail:partner-details.summary-keys.last-name' },
  value: { text: 'Bloggs' },
}, {
  key: { text: 'task-detail:partner-details.summary-keys.other-names' },
  value: { text: '' },
}, {
  key: { text: 'task-detail:partner-details.summary-keys.dob' },
  value: { html: '' },
}, {
  key: { text: `task-detail:partner-details.summary-keys.marital-date.${status}` },
  value: { html: '1 January 2000 <span class="govuk-!-font-weight-bold govuk-!-padding-left-5 govuk-!-padding-right-2 gysp-secondary-text-colour gysp-status gysp-status--active">\n    app:verification-status.verified\n  </span>' },
}];

const validObjects = {
  married: claimData.validClaimMarried(),
  civil: claimData.validClaimCivilPartner(),
};
const validObjectsArray = Object.entries(validObjects).map(([key, object]) => ({ key, object }));

const allItemsUpdated = {
  'partner-nino': { partnerNino: 'AA654321C' },
  'date-of-birth': {
    dateYear: '1952', dateMonth: '7', dateDay: '6', verification: 'V',
  },
  'marital-date': {
    dateYear: '2000', dateMonth: '5', dateDay: '19', verification: 'V',
  },
};

describe('taskDetailsObject', () => {
  describe('formatter', () => {
    it('should return blank optional rows when values are null - married', () => {
      const formatted = taskDetailObject.formatter(optionalNullPartnerDetails);
      assert.deepEqual(formatted.partnerSummary.rows, blankPartnerDetailRows('married'));
    });
    it('should return blank optional rows when values are not present - married', () => {
      const formatted = taskDetailObject.formatter(optionalMissingPartnerDetails);
      assert.deepEqual(formatted.partnerSummary.rows, blankPartnerDetailRows('married'));
    });
    it('should return blank optional rows when values are null - civil', () => {
      const formatted = taskDetailObject.formatter(optionalNullPartnerDetailsCivil);
      assert.deepEqual(formatted.partnerSummary.rows, blankPartnerDetailRows('civil'));
    });
    it('should return blank optional rows when values are not present - civil', () => {
      const formatted = taskDetailObject.formatter(optionalMissingPartnerDetailsCivil);
      assert.deepEqual(formatted.partnerSummary.rows, blankPartnerDetailRows('civil'));
    });
    it('should return all rows verified when verified fields are true', () => {
      const formatted = taskDetailObject.formatter(partnerAllElementsVerified);
      assert.deepEqual(formatted.partnerSummary.rows, verifiedPartnerDetailRows('married'));
    });
    validObjectsArray.forEach((item) => {
      it(`should return object when partner details are present with a status of ${item.object.maritalStatus}`, () => {
        const formatted = taskDetailObject.formatter(item.object);
        assert.isObject(formatted);
        assert.equal(formatted.header, `task-detail:header.${item.key}`);
        assert.equal(formatted.partnerSummary.header, `task-detail:partner-details.header.${item.key}`);
        assert.deepEqual(formatted.partnerSummary.rows, basePartnerDetailRows(item.key));
        assert.equal(formatted.claimantSummary.header, 'task-detail:claimant-details.header');
        assert.deepEqual(formatted.claimantSummary.rows, baseClaimantDetailRows);
      });

      it(`should return object with updated partner details are present with a status of ${item.object.maritalStatus}`, () => {
        const formatted = taskDetailObject.formatter(item.object, allItemsUpdated);
        assert.isObject(formatted);
        assert.equal(formatted.header, `task-detail:header.${item.key}`);
        assert.equal(formatted.partnerSummary.header, `task-detail:partner-details.header.${item.key}`);
        assert.deepEqual(formatted.partnerSummary.rows, updatedPartnerDetailRows(item.key));
        assert.equal(formatted.claimantSummary.header, 'task-detail:claimant-details.header');
        assert.deepEqual(formatted.claimantSummary.rows, baseClaimantDetailRows);
      });
    });
  });
});
