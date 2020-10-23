const assert = require('assert');

const headersToObject = require('../../../lib/headersToObject');

const validStaffIdAndBenefit = 'staff_email=test@test.com;benefit_type=Two';

describe('headers to object ', () => {
  it('should return agentRefObject with populated values if staff_id is in cookie', () => {
    const agentObject = headersToObject.formatAgentObject(validStaffIdAndBenefit);
    assert.equal(agentObject.staff_email, 'test@test.com');
    assert.equal(agentObject.benefit_type, 'Two');
  });
});
