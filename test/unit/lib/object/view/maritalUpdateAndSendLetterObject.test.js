const { assert } = require('chai');
const i18next = require('i18next');
const i18nextFsBackend = require('i18next-fs-backend');

const i18nextConfig = require('../../../../../config/i18next');

const object = require('../../../../../lib/objects/view/maritalUpdateAndSendLetterObject');
const dataObjects = require('../../../../lib/reviewDataObjects');

const entitlementDate = '2018-11-09T06:00:00.000Z';

describe('maritalUpdateAndSendLetterObject', () => {
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

  it('should return valid json when object is called with full object', () => {
    const json = object.formatter(dataObjects.validPaymentApiResponse(), entitlementDate);
    assert.equal(JSON.stringify(json), JSON.stringify(dataObjects.validPaymentFormattedObject()));
  });

  it('should return valid award increase json when updated award is more than current award', () => {
    const json = object.formatter(dataObjects.validPaymentApiResponseAwardIncreaseWithoutArrears(), entitlementDate);
    assert.equal(JSON.stringify(json), JSON.stringify(dataObjects.validPaymentFormattedObjectAwardIncreaseWithoutArrears()));
  });

  it('should return valid award increase with arrears json when updated award is more than current award', () => {
    const json = object.formatter(dataObjects.validPaymentApiResponseAwardIncreaseWithArrears(), entitlementDate);
    assert.equal(JSON.stringify(json), JSON.stringify(dataObjects.validPaymentFormattedObjectAwardIncreaseWithArrears()));
  });

  it('should return valid award decrease json when updated award is less than current award', () => {
    const json = object.formatter(dataObjects.validPaymentApiResponseAwardDecrease(), entitlementDate);
    assert.equal(JSON.stringify(json), JSON.stringify(dataObjects.validPaymentFormattedObjectAwardDecrease()));
  });
});
