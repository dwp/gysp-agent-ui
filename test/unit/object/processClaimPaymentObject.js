const assert = require('assert');

const object = require('../../../lib/objects/processClaimPaymentObject');
const dataObjects = require('../lib/formDataObjects');

describe('process claim detail object formatter', () => {
  it('should return valid json when object is called with full object', (done) => {
    const json = object.formatter(dataObjects.validProcessClaimPaymentApiResponse());
    assert.equal(JSON.stringify(json), JSON.stringify(dataObjects.validProcessClaimPaymentFormattedObject()));
    assert.equal(json.bankDetails.rows.length, 4);
    assert.equal(json.firstPayment.rows.length, 3);
    assert.equal(json.regularPayment.rows.length, 3);
    done();
  });

  it('should return valid json when object is called with object without reference', (done) => {
    const json = object.formatter(dataObjects.validProcessClaimPaymentApiResponseWithoutReferenceNumber());
    assert.equal(JSON.stringify(json), JSON.stringify(dataObjects.validProcessClaimPaymentFormattedObjectWithoutReferenceNumber()));
    assert.equal(json.bankDetails.rows.length, 3);
    assert.equal(json.firstPayment.rows.length, 3);
    assert.equal(json.regularPayment.rows.length, 3);
    done();
  });

  it('should return valid json when object is called with object without first payment protected payment when payment protection undefined', (done) => {
    const json = object.formatter(dataObjects.validProcessClaimPaymentApiResponseWithoutFirstPaymentProtectedPayment());
    assert.equal(JSON.stringify(json), JSON.stringify(dataObjects.validProcessClaimPaymentFormattedObjectWithoutFirstPaymentProtectedPayment()));
    assert.equal(json.bankDetails.rows.length, 4);
    assert.equal(json.firstPayment.rows.length, 3);
    assert.equal(json.regularPayment.rows.length, 3);
    done();
  });

  it('should return valid json when object is called with object first payment protected payment when payment protection is zero', (done) => {
    const json = object.formatter(dataObjects.validProcessClaimPaymentApiResponseFirstPaymentProtectedPaymentZero());
    assert.equal(JSON.stringify(json), JSON.stringify(dataObjects.validProcessClaimPaymentFormattedObjectWithoutFirstPaymentProtectedPayment()));
    assert.equal(json.bankDetails.rows.length, 4);
    assert.equal(json.firstPayment.rows.length, 3);
    assert.equal(json.regularPayment.rows.length, 3);
    done();
  });

  it('should return valid json when object is called with object without regular payment protected payment when payment protection undefined', (done) => {
    const json = object.formatter(dataObjects.validProcessClaimPaymentApiResponseWithoutRegularPaymentProtectedPayment());
    assert.equal(JSON.stringify(json), JSON.stringify(dataObjects.validProcessClaimPaymentFormattedObjectWithoutRegularPaymentProtectedPayment()));
    assert.equal(json.bankDetails.rows.length, 4);
    assert.equal(json.firstPayment.rows.length, 3);
    assert.equal(json.regularPayment.rows.length, 3);
    assert.equal(json.regularPayment.caption, 'Second and regular payment');
    done();
  });

  it('should return valid json when object is called with object regular payment protected payment when payment protection is zero', (done) => {
    const json = object.formatter(dataObjects.validProcessClaimPaymentApiResponseRegularPaymentProtectedPaymentZero());
    assert.equal(JSON.stringify(json), JSON.stringify(dataObjects.validProcessClaimPaymentFormattedObjectWithoutRegularPaymentProtectedPayment()));
    assert.equal(json.bankDetails.rows.length, 4);
    assert.equal(json.firstPayment.rows.length, 3);
    assert.equal(json.regularPayment.rows.length, 3);
    assert.equal(json.regularPayment.caption, 'Second and regular payment');
    done();
  });

  it('should return valid json when object is called with object without first payment', (done) => {
    const json = object.formatter(dataObjects.validProcessClaimPaymentApiResponseWithoutFirstPayment());
    assert.equal(JSON.stringify(json), JSON.stringify(dataObjects.validProcessClaimPaymentFormattedObjectWithoutFirstPayment()));
    assert.equal(json.bankDetails.rows.length, 4);
    assert.equal(json.firstPayment, undefined);
    assert.equal(json.regularPayment.rows.length, 3);
    assert.equal(json.regularPayment.caption, 'First and regular payment');
    done();
  });

  it('should return valid json when object is called with first payment, second payment and regular payment', (done) => {
    const json = object.formatter(dataObjects.validProcessClaimPaymentApiResponseWithFirstSecondRegularPayment());
    assert.equal(JSON.stringify(json), JSON.stringify(dataObjects.validProcessClaimPaymentFormattedObjectWithFirstSecondRegularPayment()));
    assert.equal(json.bankDetails.rows.length, 4);
    assert.equal(json.firstPayment.rows.length, 3);
    assert.equal(json.secondPayment.rows.length, 3);
    assert.equal(json.regularPayment.rows.length, 3);
    assert.equal(json.regularPayment.caption, 'Regular payment');
    done();
  });
});
