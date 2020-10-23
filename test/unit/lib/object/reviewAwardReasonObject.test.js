const assert = require('assert');

const reviewAwardReasonObject = require('../../../../lib/objects/reviewAwardReasonObject');

const formatList = [
  { reason: 'REVISION OF ENTITLEMENT DUE TO CHANGE IN CONT/CREDIT POSITION', formatted: 'Change in cont/credit position' },
  { reason: 'REVISION OF ENTITLEMENT DUE TO CHANGE IN LIABILITY', formatted: 'Change in liability' },
  { reason: 'REVISION OF ENTITLEMENT DUE TO CHANGE IN S2P LIABILITY', formatted: 'Change in State Second Pension liability' },
  { reason: 'REVISION OF ENTITLEMENT DUE TO CHANGE IN PERSONAL DETAILS', formatted: 'Change in personal details' },
  { reason: 'REVISION OF ENTITLEMENT DUE TO CHANGE IN BIRTH/DEATH DETAILS', formatted: 'Change in birth/death details' },
  { reason: 'AWARD RECONCILIATION - REVISED UPWARDS', formatted: 'Award reconciliation - revised upwards' },
  { reason: 'REVISION OF ENTITLEMENT DUE TO CHANGE IN CONT/CREDIT POSITION (ONLINE)', formatted: 'Change in cont/credit position (online)' },
  { reason: 'REVISION OF ENTITLEMENT DUE TO CHANGE IN BIRTH/DEATH DETAILS (ONLINE)', formatted: 'Change in birth/death details (online)' },
  { reason: 'REVISION OF ENTITLEMENT DUE TO CHANGE IN CONT/CREDIT POSITION (ENIRS2)', formatted: 'Change in cont/credit position (eNIRS2)' },
  { reason: 'REVISION OF ENTITLEMENT DUE TO CHANGE IN UNIVERSAL CREDIT (S2P)', formatted: 'Change in Universal Credit (State Second Pension)' },
  { reason: 'REVISION OF ENTITLEMENT DUE TO CHANGE IN CONT/CREDIT POSITION (COMPLIANCE AND YIELD)', formatted: 'Change in cont/credit position (compliance and yield)' },
  { reason: 'REVISION OF ENTITLEMENT DUE TO CHANGE IN LIABILITY', formatted: 'Change in liability' },
  { reason: 'REVISION OF ENTITLEMENT DUE TO PERIOD OF HRP ADDITION', formatted: 'Period of Home Responsibilities Protection addition' },
  { reason: 'REVISION OF ENTITLEMENT DUE TO CHANGE IN C.O. SCHEME MEMBERSHIP', formatted: 'Change in contracted out scheme membership' },
  { reason: 'REVISION OF ENTITLEMENT DUE TO CHANGE IN SUBSTITUTION/INHERITANCE DETAILS', formatted: 'Change in substitution/inheritance details' },
  { reason: 'REVIEW - DUMMY CALC', formatted: 'Review - dummy calc' },
  { reason: 'REVISION OF ENTITLEMENT DUE TO CHANGE IN S2P LIABILITY (ONLINE)', formatted: 'Change in State Second Pension liability (online)' },
  { reason: 'REVISION OF ENTITLEMENT DUE TO CHANGE IN C.O. SCHEME MEMBERSHIP (ONLINE)', formatted: 'Change in contracted out scheme membership (online)' },
  { reason: 'REVISION OF ENTITLEMENT DUE TO CHANGE IN PERSONAL DETAILS (CID)', formatted: 'Change in personal details (CID)' },
  { reason: 'REVISION OF ENTITLEMENT DUE TO CHANGE IN APP/SHP APP SCHEME MEMBERSHIP (ONLINE)', formatted: 'Change in APP/SHP scheme membership (online)' },
  { reason: 'REVISION OF ENTITLEMENT DUE TO CHANGE IN SCHEME MEMBERSHIP (ONLINE)', formatted: 'Change in scheme membership (online)' },
  { reason: 'REVISION OF ENTITLEMENT DUE TO REVIEW OF STATE SCHEME PREMIUM (ONLINE)', formatted: 'Review of state scheme premium (online)' },
  { reason: 'REVIEW - DUMMY CALC (COEG INVESTIGATION)', formatted: 'Review - dummy calc (COEG investigation)' },
  { reason: 'COEG INVESTIGATION C.O. POSITION - BP CALCULATION ONLY', formatted: 'COEG investigation contracted out position - basic pension calculation only' },
  { reason: 'RP BENEFIT CALCULATION MADE - FEDBACK DETAILS NOT RECEIVED', formatted: 'Retirement pension benefit calculation made - fedback details not received' },
  { reason: 'SCHEME RECONCILIATION SERVICE ACCOUNT', formatted: 'Scheme reconciliation service account' },
];


describe('review award reason object', () => {
  describe('formatter', () => {
    it('should return valid object with unknowen error when no match', () => {
      const response = reviewAwardReasonObject.formatter({ reasonForChange: 'UNKNOWEN' });
      assert.equal(JSON.stringify(response), JSON.stringify({ reasonForChange: 'Unexpected reason from HMRC – UNKNOWEN' }));
    });
    formatList.forEach((object) => {
      it(`should return valid object with formatted '${object.formatted}' reason when reason is '${object.reason}'`, () => {
        const response = reviewAwardReasonObject.formatter({ reasonForChange: object.reason });
        assert.equal(JSON.stringify(response), JSON.stringify({ reasonForChange: object.formatted }));
      });
    });
  });
});
