const assert = require('assert');

const i18next = require('i18next');
const i18nextFsBackend = require('i18next-fs-backend');

const i18nextConfig = require('../../../config/i18next');

const changeCircumstancesOverview = require('../../../lib/changeCircumstancesOverview');
const claimData = require('../../lib/claimData');

describe('change of circumstances overview ', () => {
  before(async () => {
    await i18next
      .use(i18nextFsBackend)
      .init(i18nextConfig);
  });

  describe('formatter ', () => {
    it('should return formatted object with populated values when every address field is complete', () => {
      const formatter = changeCircumstancesOverview.formatter(claimData.validClaim());
      assert.equal(JSON.stringify(formatter), JSON.stringify(claimData.validPersonalDetailsViewData()));
    });

    it('should return formatted object with populated values with dateOfDeath verified', () => {
      const formatter = changeCircumstancesOverview.formatter(claimData.validClaimWithDeathVerified());
      assert.deepEqual(formatter, claimData.validClaimWithDeathVerifiedData());
    });

    it('should return formatted object with populated values with deathArrearsAmount arrears due', () => {
      const formatter = changeCircumstancesOverview.formatter(claimData.validClaimWithDeathArrearsDue());
      assert.deepEqual(formatter, claimData.validClaimWithDeathVerifiedArrearsData());
    });

    it('should return formatted object with populated values show link true when marital status is not Single', () => {
      const formatter = changeCircumstancesOverview.formatter(claimData.validClaimMarried());
      assert.equal(JSON.stringify(formatter), JSON.stringify(claimData.validPersonalDetailsMarriedViewData()));
    });

    it('should return formatted object with payment stopped link enabled - INPAYMENT', () => {
      const formatter = changeCircumstancesOverview.formatter({ ...claimData.validClaim(), awardStatus: 'INPAYMENT' });
      assert.equal(JSON.stringify(formatter), JSON.stringify(claimData.validPersonalDetailsViewData()));
    });

    it('should return formatted object with payment stopped link enabled - DEAD', () => {
      const formatter = changeCircumstancesOverview.formatter({ ...claimData.validClaim(), awardStatus: 'DEAD' });
      assert.equal(JSON.stringify(formatter), JSON.stringify({ ...claimData.validPersonalDetailsViewData(), enableStopStatePension: false }));
    });

    it('should return formatted object with payment stopped link enabled - DEADNOTVERIFIED', () => {
      const formatter = changeCircumstancesOverview.formatter({ ...claimData.validClaim(), awardStatus: 'DEADNOTVERIFIED' });
      assert.equal(JSON.stringify(formatter), JSON.stringify({ ...claimData.validPersonalDetailsViewData(), enableStopStatePension: false }));
    });

    it('should return formatted object with payment stopped link enabled - DEFERRED', () => {
      const formatter = changeCircumstancesOverview.formatter({ ...claimData.validClaim(), awardStatus: 'DEFERRED' });
      assert.equal(JSON.stringify(formatter), JSON.stringify({ ...claimData.validPersonalDetailsViewData(), enableStopStatePension: false }));
    });

    context('warnings', () => {
      it('should return final payment is not calculated warning', () => {
        const details = {
          ...claimData.validClaim(),
          deathAllActionsPerformed: false,
          deathCalculationPerformed: false,
          deathDetail: { dateOfDeathVerification: 'V', payeeDetails: { foo: 'bar' } },
        };
        const formatter = changeCircumstancesOverview.formatter(details);
        assert.equal(formatter.warning.html, 'Final payment has not been calculated<br /><a href="&#x2F;changes-and-enquiries&#x2F;personal&#x2F;death&#x2F;retry-calculation" class="govuk-link govuk-link--no-visited-state">Calculate final payment</a>');
      });

      it('should return arrears payment due warning', () => {
        const details = {
          ...claimData.validClaim(),
          deathAllActionsPerformed: false,
          deathCalculationPerformed: true,
          deathDetail: { amountDetails: { amount: 100.0 } },
        };
        const formatter = changeCircumstancesOverview.formatter(details);
        assert.equal(formatter.warning.html, '£100.00 arrears payment due<br /><a href="&#x2F;changes-and-enquiries&#x2F;personal&#x2F;death&#x2F;payee-details" class="govuk-link govuk-link--no-visited-state">Enter payee details</a>');
      });

      it('should return date of death not verified warning', () => {
        const details = {
          ...claimData.validClaim(),
          deathDetail: { dateOfDeathVerification: 'NV', payeeDetails: { } },
        };
        const formatter = changeCircumstancesOverview.formatter(details);
        assert.equal(formatter.warning.html, 'Date of death awaiting verification<br /><a href="&#x2F;changes-and-enquiries&#x2F;personal&#x2F;death&#x2F;verify" class="govuk-link govuk-link--no-visited-state">Verify date of death</a>');
      });

      it('should return awaiting dap details warning', () => {
        const details = {
          ...claimData.validClaim(),
          awardStatus: 'DEAD',
          deathAllActionsPerformed: false,
          deathDetail: { dateOfDeathVerification: 'V' },
        };
        const formatter = changeCircumstancesOverview.formatter(details);
        assert.equal(formatter.warning.html, 'Awaiting details of the person dealing with the estate<br /><a href="&#x2F;changes-and-enquiries&#x2F;personal&#x2F;death&#x2F;enter-person-dealing-with-the-estate-details" class="govuk-link govuk-link--no-visited-state">Enter details</a>');
      });

      it('should return awaiting verification and dap details warning', () => {
        const details = {
          ...claimData.validClaim(),
          awardStatus: 'DEADNOTVERIFIED',
          deathAllActionsPerformed: false,
          deathDetail: { dateOfDeathVerification: 'NV' },
        };
        const formatter = changeCircumstancesOverview.formatter(details);
        assert.equal(formatter.warning.html, 'Awaiting verification of death and details of the person dealing with the estate<br /><a href="&#x2F;changes-and-enquiries&#x2F;personal&#x2F;death&#x2F;are-you-able-to-verify-the-date-of-death" class="govuk-link govuk-link--no-visited-state">Update details</a>');
      });
    });
  });
});
