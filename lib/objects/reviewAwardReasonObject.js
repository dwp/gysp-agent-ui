function formatReasonForChange(reasonForChange) {
  let reason;
  switch (reasonForChange.trim()) {
  case 'REVISION OF ENTITLEMENT DUE TO CHANGE IN CONT/CREDIT POSITION':
    reason = 'Change in cont/credit position';
    break;
  case 'REVISION OF ENTITLEMENT DUE TO CHANGE IN LIABILITY':
    reason = 'Change in liability';
    break;
  case 'REVISION OF ENTITLEMENT DUE TO CHANGE IN S2P LIABILITY':
    reason = 'Change in State Second Pension liability';
    break;
  case 'REVISION OF ENTITLEMENT DUE TO CHANGE IN PERSONAL DETAILS':
    reason = 'Change in personal details';
    break;
  case 'REVISION OF ENTITLEMENT DUE TO CHANGE IN BIRTH/DEATH DETAILS':
    reason = 'Change in birth/death details';
    break;
  case 'AWARD RECONCILIATION - REVISED UPWARDS':
    reason = 'Award reconciliation - revised upwards';
    break;
  case 'REVISION OF ENTITLEMENT DUE TO CHANGE IN CONT/CREDIT POSITION (ONLINE)':
    reason = 'Change in cont/credit position (online)';
    break;
  case 'REVISION OF ENTITLEMENT DUE TO CHANGE IN BIRTH/DEATH DETAILS (ONLINE)':
    reason = 'Change in birth/death details (online)';
    break;
  case 'REVISION OF ENTITLEMENT DUE TO CHANGE IN PERSONAL DETAILS (ONLINE)':
    reason = 'Change in personal details (online)';
    break;
  case 'REVISION OF ENTITLEMENT DUE TO CHANGE IN CONT/CREDIT POSITION (ENIRS2)':
    reason = 'Change in cont/credit position (eNIRS2)';
    break;
  case 'REVISION OF ENTITLEMENT DUE TO CHANGE IN UNIVERSAL CREDIT (S2P)':
    reason = 'Change in Universal Credit (State Second Pension)';
    break;
  case 'REVISION OF ENTITLEMENT DUE TO CHANGE IN CONT/CREDIT POSITION (COMPLIANCE AND YIELD)':
    reason = 'Change in cont/credit position (compliance and yield)';
    break;
  case 'REVISION OF ENTITLEMENT DUE TO PERIOD OF HRP ADDITION':
    reason = 'Period of Home Responsibilities Protection addition';
    break;
  case 'REVISION OF ENTITLEMENT DUE TO CHANGE IN C.O. SCHEME MEMBERSHIP':
    reason = 'Change in contracted out scheme membership';
    break;
  case 'REVISION OF ENTITLEMENT DUE TO CHANGE IN SUBSTITUTION/INHERITANCE DETAILS':
    reason = 'Change in substitution/inheritance details';
    break;
  case 'REVIEW - DUMMY CALC':
    reason = 'Review - dummy calc';
    break;
  case 'REVISION OF ENTITLEMENT DUE TO CHANGE IN S2P LIABILITY (ONLINE)':
    reason = 'Change in State Second Pension liability (online)';
    break;
  case 'REVISION OF ENTITLEMENT DUE TO CHANGE IN C.O. SCHEME MEMBERSHIP (ONLINE)':
    reason = 'Change in contracted out scheme membership (online)';
    break;
  case 'REVISION OF ENTITLEMENT DUE TO CHANGE IN PERSONAL DETAILS (CID)':
    reason = 'Change in personal details (CID)';
    break;
  case 'REVISION OF ENTITLEMENT DUE TO CHANGE IN APP/SHP APP SCHEME MEMBERSHIP (ONLINE)':
    reason = 'Change in APP/SHP scheme membership (online)';
    break;
  case 'REVISION OF ENTITLEMENT DUE TO CHANGE IN SCHEME MEMBERSHIP (ONLINE)':
    reason = 'Change in scheme membership (online)';
    break;
  case 'REVISION OF ENTITLEMENT DUE TO REVIEW OF STATE SCHEME PREMIUM (ONLINE)':
    reason = 'Review of state scheme premium (online)';
    break;
  case 'REVIEW - DUMMY CALC (COEG INVESTIGATION)':
    reason = 'Review - dummy calc (COEG investigation)';
    break;
  case 'COEG INVESTIGATION C.O. POSITION - BP CALCULATION ONLY':
    reason = 'COEG investigation contracted out position - basic pension calculation only';
    break;
  case 'RP BENEFIT CALCULATION MADE - FEDBACK DETAILS NOT RECEIVED':
    reason = 'Retirement pension benefit calculation made - fedback details not received';
    break;
  case 'SCHEME RECONCILIATION SERVICE ACCOUNT':
    reason = 'Scheme reconciliation service account';
    break;
  default:
    reason = `Unexpected reason from HMRC – ${reasonForChange}`;
  }
  return reason;
}

module.exports = {
  formatter(details) {
    return {
      reasonForChange: formatReasonForChange(details.reasonForChange),
    };
  },
};
