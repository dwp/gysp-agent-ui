const { assert } = require('chai');
const nameChangeObject = require('../../../../../lib/objects/api/nameChangeObject');

const nameChangeObjectFormatted = {
  nino: 'AA111111A',
  eventCategory: 'PERSONAL',
  eventName: 'name-change:timeline.name.changed',
  eventType: 'CHANGE',
  firstName: 'Rick',
  surname: 'Sanchez',
};

describe('nameChangeObject', () => {
  describe('formatter', () => {
    it('should return formatted name change object', () => {
      assert.deepEqual(nameChangeObject.formatter('AA111111A', { firstName: 'Rick', lastName: 'Sanchez' }), nameChangeObjectFormatted);
    });
  });
});
