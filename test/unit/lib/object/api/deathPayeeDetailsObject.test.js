const { assert } = require('chai');
const deathPayeeDetailsObject = require('../../../../../lib/objects/api/deathPayeeDetailsObject');

const bankRequest = {
  accountName: 'Test',
  accountNumber: '12345678',
  sortCode: '112233',
  nino: 'AA664499C',
};

const bankRequestSortCodeDash = {
  accountName: 'Test',
  accountNumber: '12345678',
  sortCode: '11-22-33',
};

const buildingSocietyRequest = {
  accountName: 'Test',
  accountNumber: '12345678',
  sortCode: '112233',
  nino: 'AA664499C',
  referenceNumber: 'TEST123',
};

const awardDetails = {
  nino: 'AA664499C',
};

const deathPayeeDetailsFormatted = {
  accountName: 'Test',
  accountNumber: '12345678',
  sortCode: '112233',
  nino: 'AA664499C',
};

const buildingSocietyFormatted = {
  accountName: 'Test',
  accountNumber: '12345678',
  sortCode: '112233',
  nino: 'AA664499C',
  referenceNumber: 'TEST123',
};

describe('deathPayeeDetailsObject', () => {
  describe('formatter', () => {
    it('should return formatted bank object when sort code is supplied with dashes', () => {
      assert.deepEqual(deathPayeeDetailsObject.formatter(bankRequest, awardDetails), deathPayeeDetailsFormatted);
    });

    it('should return formatted bank object when sort code is supplied without dashes', () => {
      assert.deepEqual(deathPayeeDetailsObject.formatter(bankRequestSortCodeDash, awardDetails), deathPayeeDetailsFormatted);
    });

    it('should return formatted building society object when referenceNumber is supplied ', () => {
      assert.deepEqual(deathPayeeDetailsObject.formatter(buildingSocietyRequest, awardDetails), buildingSocietyFormatted);
    });
  });
});
