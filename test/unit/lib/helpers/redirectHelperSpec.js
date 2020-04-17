const { assert } = require('chai');

const helper = require('../../../../lib/helpers/redirectHelper');

let response = {};

// Mocks
const flash = { type: '', message: '' };
const flashMock = (type, message) => {
  flash.type = type;
  flash.message = message;
};

describe('redirect helper', () => {
  describe('redirectBasedOnPageAndEditMode', () => {
    it('should return dap-postcode next url when edit mode true', () => {
      assert.equal(helper.redirectBasedOnPageAndEditMode('dap-postcode', true), '/changes-and-enquiries/personal/death/address-select');
    });
    it('should return dap-postcode next url when dap-postcode and edit mode false', () => {
      assert.equal(helper.redirectBasedOnPageAndEditMode('dap-postcode', false), '/changes-and-enquiries/personal/death/address-select');
    });
    it('should return dap-name next url when dap-name and edit mode false', () => {
      assert.equal(helper.redirectBasedOnPageAndEditMode('dap-name', false), '/changes-and-enquiries/personal/death/phone-number');
    });
    it('should return check details url when dap-name and edit mode true', () => {
      assert.equal(helper.redirectBasedOnPageAndEditMode('dap-name', true), '/changes-and-enquiries/personal/death/check-details');
    });
    it('should return dap-phone-number next url when dap-phone-number and edit mode false', () => {
      assert.equal(helper.redirectBasedOnPageAndEditMode('dap-phone-number', false), '/changes-and-enquiries/personal/death/address');
    });
    it('should return check details url when dap-phone-number and edit mode true', () => {
      assert.equal(helper.redirectBasedOnPageAndEditMode('dap-phone-number', true), '/changes-and-enquiries/personal/death/check-details');
    });
    it('should return dap-address next url when dap-address and edit mode false', () => {
      assert.equal(helper.redirectBasedOnPageAndEditMode('dap-address', false), '/changes-and-enquiries/personal/death/payment');
    });
    it('should return check details url when dap-address and edit mode true', () => {
      assert.equal(helper.redirectBasedOnPageAndEditMode('dap-address', true), '/changes-and-enquiries/personal/death/check-details');
    });
  });
  describe('redirectAndClearSessionKey', () => {
    beforeEach(() => {
      response = {
        address: '',
        redirect(url) {
          this.address = url;
        },
      };
    });
    it('should return redirect with session key cleared when called', () => {
      const request = { session: { foo: 'bar' } };
      helper.redirectAndClearSessionKey(request, response, 'foo', '/redirect');
      assert.isUndefined(request.session.foo);
      assert.equal(response.address, '/redirect');
    });
  });
  describe('successAlertAndRedirect', () => {
    beforeEach(() => {
      response = {
        address: '',
        redirect(url) {
          this.address = url;
        },
      };
    });
    it('should return redirect with session key cleared when called', () => {
      const request = { flash: flashMock };
      helper.successAlertAndRedirect(request, response, 'foo:bar.bar', '/redirect');
      assert.equal(flash.type, 'success');
      assert.equal(flash.message, 'foo:bar.bar');
      assert.equal(response.address, '/redirect');
    });
  });
});
