const assert = require('assert');

const object = require('../../../lib/objects/processClaimPaymentObject');
const dataObjects = require('../lib/formDataObjects');

describe('process claim detail object formatter', () => {
  it('should return valid json when object is called with full object', (done) => {
    const json = object.formatter(dataObjects.validPaymentApiResponse());
    assert.equal(JSON.stringify(json), JSON.stringify(dataObjects.validPaymentFormattedObject()));
    assert.equal(json.firstPayment.rows.length, 2);
    assert.equal(json.regularPayment.rows.length, 2);
    done();
  });

  it('should return valid json when object is called with object without first payment protected payment when payment protection undefined', (done) => {
    const json = object.formatter(dataObjects.validPaymentApiResponseWithoutFirstPaymentProtectedPayment());
    assert.equal(JSON.stringify(json), JSON.stringify(dataObjects.validPaymentFormattedObjectWithoutFirstPaymentProtectedPayment()));
    assert.equal(json.firstPayment.rows.length, 2);
    assert.equal(json.regularPayment.rows.length, 2);
    done();
  });

  it('should return valid json when object is called with object first payment protected payment when payment protection is zero', (done) => {
    const json = object.formatter(dataObjects.validPaymentApiResponseFirstPaymentProtectedPaymentZero());
    assert.equal(JSON.stringify(json), JSON.stringify(dataObjects.validPaymentFormattedObjectWithoutFirstPaymentProtectedPayment()));
    assert.equal(json.firstPayment.rows.length, 2);
    assert.equal(json.regularPayment.rows.length, 2);
    done();
  });

  it('should return valid json when object is called with object without regular payment protected payment when payment protection undefined', (done) => {
    const json = object.formatter(dataObjects.validPaymentApiResponseWithoutRegularPaymentProtectedPayment());
    assert.equal(JSON.stringify(json), JSON.stringify(dataObjects.validPaymentFormattedObjectWithoutRegularPaymentProtectedPayment()));
    assert.equal(json.firstPayment.rows.length, 2);
    assert.equal(json.regularPayment.rows.length, 2);
    assert.equal(json.regularPayment.title, 'Second and regular payment');
    done();
  });

  it('should return valid json when object is called with object regular payment protected payment when payment protection is zero', (done) => {
    const json = object.formatter(dataObjects.validPaymentApiResponseRegularPaymentProtectedPaymentZero());
    assert.equal(JSON.stringify(json), JSON.stringify(dataObjects.validPaymentFormattedObjectWithoutRegularPaymentProtectedPayment()));
    assert.equal(json.firstPayment.rows.length, 2);
    assert.equal(json.regularPayment.rows.length, 2);
    assert.equal(json.regularPayment.title, 'Second and regular payment');
    done();
  });

  it('should return valid json when object is called with object without first payment and arrears is false', (done) => {
    const json = object.formatter(dataObjects.validPaymentApiResponseWithoutFirstPayment());
    assert.equal(JSON.stringify(json), JSON.stringify(dataObjects.validPaymentFormattedObjectWithoutFirstPayment()));
    assert.equal(json.firstPayment, undefined);
    assert.equal(json.regularPayment.rows.length, 2);
    assert.equal(json.regularPayment.title, 'First and regular payment');
    done();
  });

  it('should return valid json when object is called with first payment when first payment is present and arrears is false', (done) => {
    const json = object.formatter(dataObjects.validPaymentApiResponseWithFirstPaymentArrearsFalse());
    assert.equal(JSON.stringify(json), JSON.stringify(dataObjects.validPaymentFormattedObjectWithFirstPaymentArrearsFalse()));
    assert.equal(json.firstPayment.rows.length, 2);
    assert.equal(json.regularPayment.rows.length, 2);
    assert.equal(json.regularPayment.title, 'Second and regular payment');
    done();
  });

  it('should return valid json when object is called with first payment when first payment is present and arrears is true', (done) => {
    const json = object.formatter(dataObjects.validPaymentApiResponseWithFirstPaymentArrearsTrue());
    assert.equal(JSON.stringify(json), JSON.stringify(dataObjects.validPaymentFormattedObjectWithFirstPaymentArrearsTrue()));
    assert.equal(json.firstPayment.rows.length, 2);
    assert.equal(json.regularPayment.rows.length, 2);
    assert.equal(json.firstPayment.title, 'Arrears payment');
    assert.equal(json.regularPayment.title, 'Next and regular payment');
    done();
  });

  it('should return valid json when object is called when additional payment is present and not arrears', (done) => {
    const json = object.formatter(dataObjects.validPaymentApiResponseWithAdditionalRegularPayment());
    assert.equal(JSON.stringify(json), JSON.stringify(dataObjects.validPaymentFormattedObjectWithAdditionalRegularPaymentPresent()));
    assert.equal(json.firstPayment.rows.length, 2);
    assert.equal(json.regularPayment.rows.length, 2);
    assert.equal(json.firstPayment.title, 'Next payment');
    assert.equal(json.regularPayment.title, 'Next regular payment');
    done();
  });

  it('should return valid json when object is called without first payment and payments already made and no arrears', (done) => {
    const json = object.formatter(dataObjects.validPaymentApiResponseWithoutFirstPaymentAndPaymentsAlreadyMade());
    assert.equal(JSON.stringify(json), JSON.stringify(dataObjects.validPaymentFormattedObjectWithNoFirstPaymentAndPaymentsMade()));
    assert.equal(json.firstPayment, undefined);
    assert.equal(json.regularPayment.rows.length, 2);
    assert.equal(json.regularPayment.title, 'Next and regular payment');
    done();
  });
});
