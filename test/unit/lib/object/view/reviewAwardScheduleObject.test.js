const { assert } = require('chai');
const i18next = require('i18next');
const i18nextFsBackend = require('i18next-fs-backend');

const i18nextConfig = require('../../../../../config/i18next');

const object = require('../../../../../lib/objects/view/reviewAwardScheduleObject');
const dataObjects = require('../../../../lib/reviewDataObjects');

const entitlementDate = '2018-11-09T06:00:00.000Z';

describe('reviewAwardScheduleObject', () => {
  before(async () => {
    await i18next
      .use(i18nextFsBackend)
      .init(i18nextConfig);
  });

  it('should be defined', () => {
    assert.isDefined(object.formatter);
  });

  it('should be a function', () => {
    assert.isFunction(object.formatter);
  });

  it('should return valid json when object is called with full object', (done) => {
    const json = object.formatter(dataObjects.validPaymentApiResponse(), entitlementDate);
    assert.equal(JSON.stringify(json), JSON.stringify(dataObjects.validPaymentFormattedObjectEndTask()));
    done();
  });

  it('should return valid award increase json when updated award is more than current award', (done) => {
    const json = object.formatter(dataObjects.validPaymentApiResponseAwardIncreaseWithoutArrears(), entitlementDate);
    assert.equal(JSON.stringify(json), JSON.stringify(dataObjects.validPaymentFormattedObjectAwardIncreaseWithoutArrearsTask()));
    done();
  });

  it('should return valid award increase with arrears json when updated award is more than current award', (done) => {
    const json = object.formatter(dataObjects.validPaymentApiResponseAwardIncreaseWithArrears(), entitlementDate);
    assert.equal(JSON.stringify(json), JSON.stringify(dataObjects.validPaymentFormattedObjectAwardIncreaseWithArrearsTask()));
    done();
  });

  it('should return valid award decrease json when updated award is less than current award', (done) => {
    const json = object.formatter(dataObjects.validPaymentApiResponseAwardDecrease(), entitlementDate);
    assert.equal(JSON.stringify(json), JSON.stringify(dataObjects.validPaymentFormattedObjectAwardDecreaseTask()));
    done();
  });

  it('should return valid award decrease json when review spans uprating', (done) => {
    const json = object.formatter(dataObjects.validPaymentApiResponseAwardDecreaseSpansUprating(), entitlementDate);
    assert.equal(JSON.stringify(json), JSON.stringify(dataObjects.validPaymentFormattedObjectAwardDecreaseSpansUprating()));
    done();
  });
});
