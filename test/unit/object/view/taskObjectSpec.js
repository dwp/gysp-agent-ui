const { assert } = require('chai');
const taskObject = require('../../../../lib/objects/view/taskObject');

const marriedWorkItem = { inviteKey: 'BOB12345', workItemReason: 'MARRIED' };
const civilWorkItem = { inviteKey: 'BOB12345', workItemReason: 'CIVILPARTNERSHIP' };

describe('taskObject ', () => {
  describe('formatter', () => {
    it('should return formatted married object when MARRIED data supplied', () => {
      const formatted = taskObject.formatter(marriedWorkItem);
      assert.equal(formatted.reason, 'married');
    });
    it('should return formatted civil partnership object when CIVILPARTNERSHIP supplied', () => {
      const formatted = taskObject.formatter(civilWorkItem);
      assert.equal(formatted.reason, 'civilpartnership');
    });
  });
  describe('complete', () => {
    it('should return formatted married object when MARRIED data supplied', () => {
      const formatted = taskObject.complete(marriedWorkItem);
      assert.equal(formatted.reason, 'married');
    });
    it('should return formatted civil partnership object when CIVILPARTNERSHIP supplied', () => {
      const formatted = taskObject.complete(civilWorkItem);
      assert.equal(formatted.reason, 'civilpartnership');
    });
  });
});
