const { assert } = require('chai');

const i18next = require('i18next');
const i18nextFsBackend = require('i18next-fs-backend');

const i18nextConfig = require('../../../../../config/i18next');

const taskMaritalDetailObject = require('../../../../../lib/objects/view/taskMaritalDetailObject');

const claimData = require('../../../../lib/claimData');

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

const optionalMissingPartnerDetailsWidowedMarried = {
  ...claimData.validClaimWidowed(),
  maritalStatus: 'Widowed',
  maritalStatusVerified: true,
  partnerDetail: {
    firstName: 'Joe',
    surname: 'Bloggs',
    widowedDate: 1604918918000,
    marriageDate: 946684800000,
  },
};

const optionalMissingPartnerDetailsWidowedCivil = {
  ...claimData.validClaimWidowed(),
  maritalStatus: 'Widowed',
  maritalStatusVerified: true,
  partnerDetail: {
    firstName: 'Joe',
    surname: 'Bloggs',
    widowedDate: 1604918918000,
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
    allOtherNames: 'Bob',
    dob: '1952-03-19T00:00:00.000Z',
    dobVerified: true,
    marriageDate: 946684800000,
    partnerNino: 'AA123456C',
  },
};

const partnerAllElementsVerifiedWidowed = {
  ...claimData.validClaimWidowed(),
  maritalStatus: 'WIDOWED',
  maritalStatusVerified: true,
  partnerDetail: {
    firstName: 'Joe',
    surname: 'Bloggs',
    allOtherNames: 'Bob',
    dob: '1952-03-19T00:00:00.000Z',
    dobVerified: true,
    widowedDate: 1604918918000,
    marriageDate: 946684800000,
    partnerNino: 'AA123456C',
  },
};

const basePartnerDetailRows = (status) => [{
  key: { text: 'National Insurance number' },
  value: { text: 'AA123456C' },
  actions: {
    items: [{
      classes: 'govuk-link--no-visited-state',
      href: '/tasks/task/consider-entitlement/partner-nino',
      text: 'Change',
      visuallyHiddenText: 'national insurance number',
    }],
  },
}, {
  key: { text: 'First name' },
  value: { text: 'Jane' },
}, {
  key: { text: 'Last name' },
  value: { text: 'Bloggs' },
}, {
  key: { text: 'Other names' },
  value: { text: 'Middle' },
}, {
  key: { text: 'Date of birth' },
  value: { html: '19 March 1952 <span class="govuk-!-font-weight-bold govuk-!-padding-left-5 govuk-!-padding-right-2 gysp-secondary-text-colour gysp-status gysp-status--inactive">\n    Not verified\n  </span>' },
  actions: {
    items: [{
      classes: 'govuk-link--no-visited-state',
      href: '/tasks/task/consider-entitlement/date-of-birth',
      text: 'Change',
      visuallyHiddenText: 'date of birth',
    }],
  },
}, {
  key: { text: i18next.t(`task-detail:partner-details.summary-keys.marital-date.${status}`) },
  value: { html: '19 March 2000 <span class="govuk-!-font-weight-bold govuk-!-padding-left-5 govuk-!-padding-right-2 gysp-secondary-text-colour gysp-status gysp-status--inactive">\n    Not verified\n  </span>' },
  actions: {
    items: [{
      classes: 'govuk-link--no-visited-state',
      href: '/tasks/task/consider-entitlement/marital-date',
      text: 'Change',
      visuallyHiddenText: i18next.t(`task-detail:partner-details.summary-keys.marital-date.${status}`).toLowerCase(),
    }],
  },
}];

const updatedPartnerDetailRows = (status) => [{
  key: { text: 'National Insurance number' },
  value: { text: 'AA654321C' },
  actions: {
    items: [{
      classes: 'govuk-link--no-visited-state',
      href: '/tasks/task/consider-entitlement/partner-nino',
      text: 'Change',
      visuallyHiddenText: 'national insurance number',
    }],
  },
}, {
  key: { text: 'First name' },
  value: { text: 'Jane' },
}, {
  key: { text: 'Last name' },
  value: { text: 'Bloggs' },
}, {
  key: { text: 'Other names' },
  value: { text: 'Middle' },
}, {
  key: { text: 'Date of birth' },
  value: { html: '6 July 1952 <span class="govuk-!-font-weight-bold govuk-!-padding-left-5 govuk-!-padding-right-2 gysp-secondary-text-colour gysp-status gysp-status--active">\n    Verified\n  </span>' },
}, {
  key: { text: i18next.t(`task-detail:partner-details.summary-keys.marital-date.${status}`) },
  value: { html: '19 May 2000 <span class="govuk-!-font-weight-bold govuk-!-padding-left-5 govuk-!-padding-right-2 gysp-secondary-text-colour gysp-status gysp-status--active">\n    Verified\n  </span>' },
}];

const verifiedPartnerDetailRows = (status) => [{
  key: { text: 'National Insurance number' },
  value: { text: 'AA123456C' },
  actions: {
    items: [{
      classes: 'govuk-link--no-visited-state',
      href: '/tasks/task/consider-entitlement/partner-nino',
      text: 'Change',
      visuallyHiddenText: 'national insurance number',
    }],
  },
}, {
  key: { text: 'First name' },
  value: { text: 'Joe' },
}, {
  key: { text: 'Last name' },
  value: { text: 'Bloggs' },
}, {
  key: { text: 'Other names' },
  value: { text: 'Bob' },
}, {
  key: { text: 'Date of birth' },
  value: { html: '19 March 1952 <span class="govuk-!-font-weight-bold govuk-!-padding-left-5 govuk-!-padding-right-2 gysp-secondary-text-colour gysp-status gysp-status--active">\n    Verified\n  </span>' },
}, {
  key: { text: i18next.t(`task-detail:partner-details.summary-keys.marital-date.${status}`) },
  value: { html: '1 January 2000 <span class="govuk-!-font-weight-bold govuk-!-padding-left-5 govuk-!-padding-right-2 gysp-secondary-text-colour gysp-status gysp-status--active">\n    Verified\n  </span>' },
}];

const verifiedPartnerDetailWidowRows = (status) => [{
  key: { text: 'National Insurance number' },
  value: { text: 'AA123456C' },
}, {
  key: { text: 'First name' },
  value: { text: 'Joe' },
}, {
  key: { text: 'Last name' },
  value: { text: 'Bloggs' },
}, {
  key: { text: 'Other names' },
  value: { text: 'Bob' },
}, {
  key: { text: 'Date of birth' },
  value: { text: '19 March 1952' },
}, {
  key: { text: i18next.t(`task-detail:partner-details.summary-keys.marital-date.${status}`) },
  value: { text: '1 January 2000' },
}];

const baseClaimantDetailRows = [{
  key: { text: 'National Insurance Number' },
  value: { text: 'AA370773A' },
}, {
  key: { text: 'Full name' },
  value: { text: 'Joe Bloggs' },
}, {
  key: { text: 'Address' },
  value: { html: 'Sub Building Name, Building Name<br />Building Number Dependent Thoroughfare Name<br />Thoroughfare Name<br />Dependent Locality<br />Post Town<br />Post Code' },
}];

const blankPartnerDetailRows = (status) => [{
  key: { text: 'National Insurance number' },
  value: { text: '' },
  actions: {
    items: [{
      classes: 'govuk-link--no-visited-state',
      href: '/tasks/task/consider-entitlement/partner-nino',
      text: 'Add',
      visuallyHiddenText: 'national insurance number',
    }],
  },
}, {
  key: { text: 'First name' },
  value: { text: 'Joe' },
}, {
  key: { text: 'Last name' },
  value: { text: 'Bloggs' },
}, {
  key: { text: 'Other names' },
  value: { text: '' },
}, {
  key: { text: 'Date of birth' },
  value: { html: '' },
}, {
  key: { text: i18next.t(`task-detail:partner-details.summary-keys.marital-date.${status}`) },
  value: { html: '1 January 2000 <span class="govuk-!-font-weight-bold govuk-!-padding-left-5 govuk-!-padding-right-2 gysp-secondary-text-colour gysp-status gysp-status--active">\n    Verified\n  </span>' },
}];

const widowedPartnerDetailNoOptionalsRows = (status) => [{
  key: { text: 'First name' },
  value: { text: 'Joe' },
}, {
  key: { text: 'Last name' },
  value: { text: 'Bloggs' },
}, {
  key: { text: i18next.t(`task-detail:partner-details.summary-keys.marital-date.${status}`) },
  value: { text: '1 January 2000' },
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
  before(async () => {
    await i18next
      .use(i18nextFsBackend)
      .init(i18nextConfig);
  });

  describe('formatter', () => {
    it('should return blank optional rows when values are null - married', () => {
      const formatted = taskMaritalDetailObject.formatter(optionalNullPartnerDetails, 'MARRIED');
      assert.deepEqual(formatted.partnerSummary.rows, blankPartnerDetailRows('married'));
    });

    it('should return blank optional rows when values are not present - married', () => {
      const formatted = taskMaritalDetailObject.formatter(optionalMissingPartnerDetails, 'MARRIED');
      assert.deepEqual(formatted.partnerSummary.rows, blankPartnerDetailRows('married'));
    });

    it('should return blank optional rows when values are null - civil', () => {
      const formatted = taskMaritalDetailObject.formatter(optionalNullPartnerDetailsCivil, 'CIVILPARTNERSHIP');
      assert.deepEqual(formatted.partnerSummary.rows, blankPartnerDetailRows('civil'));
    });

    it('should return blank optional rows when values are not present - civil', () => {
      const formatted = taskMaritalDetailObject.formatter(optionalMissingPartnerDetailsCivil, 'CIVILPARTNERSHIP');
      assert.deepEqual(formatted.partnerSummary.rows, blankPartnerDetailRows('civil'));
    });

    it('should return miss optional rows when values are not present - widowed (pre married)', () => {
      const formatted = taskMaritalDetailObject.formatter(optionalMissingPartnerDetailsWidowedMarried, 'WIDOWED');
      assert.deepEqual(formatted.partnerSummary.rows, widowedPartnerDetailNoOptionalsRows('married'));
      assert.equal(formatted.partnerSummary.classes, 'gysp-widow-partner-details-summary');
    });

    it('should return miss optional rows when values are not present - widowed (pre civil partnership)', () => {
      const formatted = taskMaritalDetailObject.formatter(optionalMissingPartnerDetailsWidowedCivil, 'WIDOWED');
      assert.deepEqual(formatted.partnerSummary.rows, widowedPartnerDetailNoOptionalsRows('civil'));
    });

    it('should return all rows verified when verified fields are true', () => {
      const formatted = taskMaritalDetailObject.formatter(partnerAllElementsVerified, 'MARRIED');
      assert.deepEqual(formatted.partnerSummary.rows, verifiedPartnerDetailRows('married'));
    });

    it('should return all rows verified when verified fields are true - widowed', () => {
      const formatted = taskMaritalDetailObject.formatter(partnerAllElementsVerifiedWidowed, 'WIDOWED');
      assert.deepEqual(formatted.partnerSummary.rows, verifiedPartnerDetailWidowRows('married'));
    });

    validObjectsArray.forEach((item) => {
      it(`should return object when partner details are present with a status of ${item.object.maritalStatus}`, () => {
        const formatted = taskMaritalDetailObject.formatter(item.object, item.key);
        assert.isObject(formatted);
        assert.equal(formatted.header, i18next.t(`task-detail:header.${item.key}`));
        assert.isFalse(formatted.hint);
        assert.equal(formatted.partnerSummary.header, i18next.t(`task-detail:partner-details.header.${item.key}`));
        assert.deepEqual(formatted.partnerSummary.rows, basePartnerDetailRows(item.key));
        assert.isUndefined(formatted.partnerSummary.classes);
        assert.equal(formatted.claimantSummary.header, "Claimant's details");
        assert.deepEqual(formatted.claimantSummary.rows, baseClaimantDetailRows);
        assert.isUndefined(formatted.claimantSummary.classes);
        assert.equal(formatted.buttonHref, '/tasks/task/complete');
      });

      it(`should return object with updated partner details are present with a status of ${item.object.maritalStatus}`, () => {
        const formatted = taskMaritalDetailObject.formatter(item.object, item.key, allItemsUpdated);
        assert.isObject(formatted);
        assert.equal(formatted.header, i18next.t(`task-detail:header.${item.key}`));
        assert.isFalse(formatted.hint);
        assert.equal(formatted.partnerSummary.header, i18next.t(`task-detail:partner-details.header.${item.key}`));
        assert.deepEqual(formatted.partnerSummary.rows, updatedPartnerDetailRows(item.key));
        assert.isUndefined(formatted.partnerSummary.classes);
        assert.equal(formatted.claimantSummary.header, "Claimant's details");
        assert.deepEqual(formatted.claimantSummary.rows, baseClaimantDetailRows);
        assert.isUndefined(formatted.claimantSummary.classes);
        assert.equal(formatted.buttonHref, '/tasks/task/complete');
      });

      it(`should return object with updated partner details are present with a status of ${item.object.maritalStatus}`, () => {
        const formatted = taskMaritalDetailObject.formatter(item.object, item.key, allItemsUpdated);
        assert.isObject(formatted);
        assert.equal(formatted.header, i18next.t(`task-detail:header.${item.key}`));
        assert.isFalse(formatted.hint);
        assert.equal(formatted.partnerSummary.header, i18next.t(`task-detail:partner-details.header.${item.key}`));
        assert.deepEqual(formatted.partnerSummary.rows, updatedPartnerDetailRows(item.key));
        assert.isUndefined(formatted.partnerSummary.classes);
        assert.equal(formatted.claimantSummary.header, "Claimant's details");
        assert.deepEqual(formatted.claimantSummary.rows, baseClaimantDetailRows);
        assert.isUndefined(formatted.claimantSummary.classes);
        assert.equal(formatted.buttonHref, '/tasks/task/complete');
      });
    });


    it('should return object when partner details are present with a status of widowed', () => {
      const formatted = taskMaritalDetailObject.formatter(claimData.validClaimWidowed(), 'WIDOWED');
      assert.isObject(formatted);
      assert.equal(formatted.header, i18next.t('task-detail:header.widowed'));
      assert.equal(formatted.hint, i18next.t('task-detail:hint.widowed'));
      assert.equal(formatted.partnerSummary.header, i18next.t('task-detail:partner-details.header.widowed'));
      assert.isArray(formatted.partnerSummary.rows);
      assert.equal(formatted.partnerSummary.classes, 'gysp-widow-partner-details-summary');
      assert.equal(formatted.claimantSummary.header, "Claimant's details");
      assert.deepEqual(formatted.claimantSummary.rows, baseClaimantDetailRows);
      assert.equal(formatted.claimantSummary.classes, 'gysp-widow-partner-details-summary');
      assert.equal(formatted.buttonHref, '/tasks/task/consider-entitlement/entitled-to-any-inherited-state-pension');
    });
  });
});
