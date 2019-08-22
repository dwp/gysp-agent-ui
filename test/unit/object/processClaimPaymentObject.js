const assert = require('assert');

const object = require('../../../lib/objects/processClaimPaymentObject');
const dataObjects = require('../lib/formDataObjects');

describe('process claim detail object formatter', () => {
  it('should return valid json when object is called with full object', (done) => {
    const json = object.formatter(dataObjects.validPaymentApiResponse());
    assert.equal(JSON.stringify(json), JSON.stringify(dataObjects.validPaymentFormattedObject()));
    assert.equal(json.bankDetails.rows.length, 4);
    assert.equal(json.firstPayment.rows.length, 3);
    assert.equal(json.regularPayment.rows.length, 3);
    done();
  });

  it('should return valid json when object is called with object without reference', (done) => {
    const json = object.formatter(dataObjects.validPaymentApiResponseWithoutReferenceNumber());
    assert.equal(JSON.stringify(json), JSON.stringify(dataObjects.validPaymentFormattedObjectWithoutReferenceNumber()));
    assert.equal(json.bankDetails.rows.length, 3);
    assert.equal(json.firstPayment.rows.length, 3);
    assert.equal(json.regularPayment.rows.length, 3);
    done();
  });

  it('should return valid json when object is called with object without first payment protected payment when payment protection undefined', (done) => {
    const json = object.formatter(dataObjects.validPaymentApiResponseWithoutFirstPaymentProtectedPayment());
    assert.equal(JSON.stringify(json), JSON.stringify(dataObjects.validPaymentFormattedObjectWithoutFirstPaymentProtectedPayment()));
    assert.equal(json.bankDetails.rows.length, 4);
    assert.equal(json.firstPayment.rows.length, 3);
    assert.equal(json.regularPayment.rows.length, 3);
    done();
  });

  it('should return valid json when object is called with object first payment protected payment when payment protection is zero', (done) => {
    const json = object.formatter(dataObjects.validPaymentApiResponseFirstPaymentProtectedPaymentZero());
    assert.equal(JSON.stringify(json), JSON.stringify(dataObjects.validPaymentFormattedObjectWithoutFirstPaymentProtectedPayment()));
    assert.equal(json.bankDetails.rows.length, 4);
    assert.equal(json.firstPayment.rows.length, 3);
    assert.equal(json.regularPayment.rows.length, 3);
    done();
  });

  it('should return valid json when object is called with object without regular payment protected payment when payment protection undefined', (done) => {
    const json = object.formatter(dataObjects.validPaymentApiResponseWithoutRegularPaymentProtectedPayment());
    assert.equal(JSON.stringify(json), JSON.stringify(dataObjects.validPaymentFormattedObjectWithoutRegularPaymentProtectedPayment()));
    assert.equal(json.bankDetails.rows.length, 4);
    assert.equal(json.firstPayment.rows.length, 3);
    assert.equal(json.regularPayment.rows.length, 3);
    assert.equal(json.regularPayment.caption, 'Second and regular payment');
    done();
  });

  it('should return valid json when object is called with object regular payment protected payment when payment protection is zero', (done) => {
    const json = object.formatter(dataObjects.validPaymentApiResponseRegularPaymentProtectedPaymentZero());
    assert.equal(JSON.stringify(json), JSON.stringify(dataObjects.validPaymentFormattedObjectWithoutRegularPaymentProtectedPayment()));
    assert.equal(json.bankDetails.rows.length, 4);
    assert.equal(json.firstPayment.rows.length, 3);
    assert.equal(json.regularPayment.rows.length, 3);
    assert.equal(json.regularPayment.caption, 'Second and regular payment');
    done();
  });

  it('should return valid json when object is called with object without first payment', (done) => {
    const json = object.formatter(dataObjects.validPaymentApiResponseWithoutFirstPayment());
    assert.equal(JSON.stringify(json), JSON.stringify(dataObjects.validPaymentFormattedObjectWithoutFirstPayment()));
    assert.equal(json.bankDetails.rows.length, 4);
    assert.equal(json.firstPayment, undefined);
    assert.equal(json.regularPayment.rows.length, 3);
    assert.equal(json.regularPayment.caption, 'First and regular payment');
    done();
  });

  it('should return valid json when object is called with first payment, second payment and regular payment', (done) => {
    const json = object.formatter(dataObjects.validPaymentApiResponseWithFirstSecondRegularPayment());
    assert.equal(JSON.stringify(json), JSON.stringify(dataObjects.validPaymentFormattedObjectWithFirstSecondRegularPayment()));
    assert.equal(json.bankDetails.rows.length, 4);
    assert.equal(json.firstPayment.rows.length, 3);
    assert.equal(json.secondPayment.rows.length, 3);
    assert.equal(json.regularPayment.rows.length, 3);
    assert.equal(json.regularPayment.caption, 'Regular payment');
    done();
  });
});
