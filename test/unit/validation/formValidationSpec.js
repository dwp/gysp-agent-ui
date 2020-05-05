const assert = require('assert');
const validator = require('../../../lib/formValidator');
const customerData = require('../../lib/customerData');

const fullCustomerData = customerData.validPost();
const emptyCustomerData = customerData.emptyPost();

const longTelephoneNumber = '12345678901234567890123456789012345678901234567890123456789012345678901';
const longEmail = 'qwertyuiopqwertyuiopqwertyuiopqwertyuiop@qwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiop.com';

const contactAdd = 'add';
const contactChange = 'change';
const contactTypeHome = 'home';
const contactTypeWork = 'work';
const contactTypeMobile = 'mobile';
const contactTypeEmail = 'email';

const emptyHomePostData = { homePhoneNumber: '' };
const populatedHomePostInvalidRequest = { homePhoneNumber: '01929x939393' };
const populatedHomePostLongRequest = { homePhoneNumber: longTelephoneNumber };

const emptyWorkPostData = { workPhoneNumber: '' };
const populatedWorkPostInvalidRequest = { workPhoneNumber: '01929x939393' };
const populatedWorkPostLongRequest = { workPhoneNumber: longTelephoneNumber };

const emptyMobilePostData = { mobilePhoneNumber: '' };
const populatedMobilePostInvalidRequest = { mobilePhoneNumber: '01929x939393' };
const populatedMobilePostLongRequest = { mobilePhoneNumber: longTelephoneNumber };

const validEmailPostData = { email: 'a@b.com' };
const validEmailSpacesStartPostData = { email: '         a@b.com' };
const validEmailSpacesEndPostData = { email: 'a@b.com      ' };
const validEmailSpacesBothPostData = { email: '      a@b.com      ' };
const emptyEmailPostData = { email: '' };
const populatedEmailPostInvalidRequest = { email: 'invalidemail' };
const populatedEmailPostLongRequest = { email: longEmail };

const emptyPostcodePostData = {};
const blankPostcodePostData = { postcode: '' };
const formatPostcodePostData = { postcode: 'postcode' };

const emptyAddressPostData = {};
const blankAddressPostData = { address: '' };

const emptyBankBuildingPostData = {};
const blankBankPostData = { accountName: '', accountNumber: '', sortCode: '' };

const bankObjects = {
  emptyObject: { accountName: '', accountNumber: '', sortCode: '' },
  longTextObject: { accountName: 'qwertyuiopasdfghjklzqwertyuiopasdfghjklzqwertyuiopasdfghjklzqwertyuiowe', accountNumber: '', sortCode: '' },
  maxTextObject: { accountName: 'qwertyuiopasdfghjklzqwertyuiopasdfghjklzqwertyuiopasdfghjklzqwertyuiow', accountNumber: '', sortCode: '' },
  validObject: { accountName: 'Mr P. Peterson', accountNumber: '12345678', sortCode: '112233' },
  validObjectWithSpaces: { accountName: 'Mr P. Peterson', accountNumber: '12345678', sortCode: ' 11 22 33 ' },
  validObjectWithHyphens: { accountName: 'Mr P. Peterson', accountNumber: '12345678', sortCode: '11-22-33' },
  validObjectWithHyphensAndSpaces: { accountName: 'Mr P. Peterson', accountNumber: '12345678', sortCode: '   11-22-  33   ' },
  shortAccount: { accountName: 'Mr P. Peterson', accountNumber: '1234567', sortCode: '123' },
  longAccount: { accountName: 'Mr P. Peterson', accountNumber: '123456789', sortCode: '111222333' },
  textAccount: { accountName: 'Mr P. Peterson', accountNumber: 'AAnereo', sortCode: 'abc' },
  nonAlphaName: { accountName: '££', accountNumber: '123456789' },
  includesAnd: { accountName: 'One && Two', accountNumber: '123456789' },
  startNotAlphaName: { accountName: ' Space Mistake', accountNumber: '123456789' },
};

const buildingObjects = {
  emptyObject: {
    accountName: '', accountNumber: '', sortCode: '', referenceNumber: '',
  },
  emptyRoll: {
    accountName: 'Mr P. Peterson', accountNumber: '12345678', sortCode: '112233', referenceNumber: '',
  },
  validRoll: {
    accountName: 'Mr P. Peterson', accountNumber: 'AAnereo', sortCode: 'abc', referenceNumber: '342',
  },
  invalidRoll: {
    accountName: 'Mr P. Peterson', accountNumber: 'AAnereo', sortCode: 'abc', referenceNumber: '$$roll',
  },
  longRoll: {
    accountName: 'Mr P. Peterson', accountNumber: 'AAnereo', sortCode: 'abc', referenceNumber: 'qwertyqwertyqwertyq',
  },
};

const emptyPaymentFrequencyPostData = {};
const blankPaymentFrequencyPostData = { frequency: '' };
const invalidPaymentFrequencyPostData = { frequency: 'bob' };

const titles = customerData.validTitles();

describe('Form validation', () => {
  describe('customer validator', () => {
    it('Should return 13 errors when empty object is supplied', () => {
      const errors = validator.customerDetails(emptyCustomerData, titles);
      assert.equal(Object.keys(errors).length, 13);
    });

    it('Should return no errors when populated object is supplied', () => {
      const errors = validator.customerDetails(fullCustomerData, titles);
      assert.equal(Object.keys(errors).length, 0);
    });

    it('Should return date error when invalid date supplied', () => {
      fullCustomerData.dobDay = 50;
      fullCustomerData.dobMonth = 13;
      const errors = validator.customerDetails(fullCustomerData, titles);
      assert.equal(Object.keys(errors).length, 3);
      assert.equal(errors.dob.text, 'add:errors.dob.format');
      assert.equal(errors.dobDay, true);
      assert.equal(errors.dobMonth, true);
    });
    it('Should return date error when invalid year date supplied (1 digit)', () => {
      fullCustomerData.dobDay = 10;
      fullCustomerData.dobMonth = 10;
      fullCustomerData.dobYear = 1;
      const errors = validator.customerDetails(fullCustomerData, titles);
      assert.equal(Object.keys(errors).length, 2);
      assert.equal(errors.dob.text, 'add:errors.dob.format');
      assert.equal(errors.dobDay, undefined);
      assert.equal(errors.dobMonth, undefined);
      assert.equal(errors.dobYear, true);
    });
    it('Should return date error when invalid year date supplied (2 digit)', () => {
      fullCustomerData.dobDay = 10;
      fullCustomerData.dobMonth = 10;
      fullCustomerData.dobYear = 13;
      const errors = validator.customerDetails(fullCustomerData, titles);
      assert.equal(Object.keys(errors).length, 2);
      assert.equal(errors.dob.text, 'add:errors.dob.format');
      assert.equal(errors.dobDay, undefined);
      assert.equal(errors.dobMonth, undefined);
      assert.equal(errors.dobYear, true);
    });
    it('Should return date error when invalid year date supplied (3 digit)', () => {
      fullCustomerData.dobDay = 10;
      fullCustomerData.dobMonth = 10;
      fullCustomerData.dobYear = 134;
      const errors = validator.customerDetails(fullCustomerData, titles);
      assert.equal(Object.keys(errors).length, 2);
      assert.equal(errors.dob.text, 'add:errors.dob.format');
      assert.equal(errors.dobDay, undefined);
      assert.equal(errors.dobMonth, undefined);
      assert.equal(errors.dobYear, true);
    });
    it('Should return State Pension Date error when invalid date supplied', () => {
      fullCustomerData.dobDay = 12;
      fullCustomerData.dobMonth = 12;
      fullCustomerData.dobYear = 1950;
      const errors = validator.customerDetails(fullCustomerData, titles);
      assert.equal(Object.keys(errors).length, 1);
      assert.equal(errors.statePensionDate.text, 'add:errors.state_pension_date.date');
    });
  });

  describe('contactDetails validator', () => {
    describe('add home phone number', () => {
      it('should return error when empty object is supplied', () => {
        const errors = validator.contactDetails(emptyHomePostData, contactTypeHome, contactAdd);
        assert.equal(Object.keys(errors).length, 1);
        assert.equal(errors[`${contactTypeHome}PhoneNumber`].text, `contact-details:fields.${contactTypeHome}_phone_number.add.errors.required`);
      });

      it('should return error when invalid format object is supplied', () => {
        const errors = validator.contactDetails(emptyHomePostData, contactTypeHome, contactAdd);
        assert.equal(Object.keys(errors).length, 1);
        assert.equal(errors[`${contactTypeHome}PhoneNumber`].text, `contact-details:fields.${contactTypeHome}_phone_number.add.errors.required`);
      });

      it('should return error if phone number is not valid', () => {
        const errors = validator.contactDetails(populatedHomePostInvalidRequest, contactTypeHome, contactAdd);
        assert.equal(Object.keys(errors).length, 1);
        assert.equal(errors[`${contactTypeHome}PhoneNumber`].text, `contact-details:fields.${contactTypeHome}_phone_number.add.errors.format`);
      });

      it('should return error if phone number is to long (above 100 characters)', () => {
        const errors = validator.contactDetails(populatedHomePostLongRequest, contactTypeHome, contactAdd);
        assert.equal(Object.keys(errors).length, 1);
        assert.equal(errors[`${contactTypeHome}PhoneNumber`].text, `contact-details:fields.${contactTypeHome}_phone_number.add.errors.length`);
      });
    });
    describe('change home phone number', () => {
      it('should return error when empty object is supplied', () => {
        const errors = validator.contactDetails(emptyHomePostData, contactTypeHome, contactChange);
        assert.equal(Object.keys(errors).length, 1);
        assert.equal(errors[`${contactTypeHome}PhoneNumber`].text, `contact-details:fields.${contactTypeHome}_phone_number.change.errors.required`);
      });

      it('should return error when invalid format object is supplied', () => {
        const errors = validator.contactDetails(emptyHomePostData, contactTypeHome, contactChange);
        assert.equal(Object.keys(errors).length, 1);
        assert.equal(errors[`${contactTypeHome}PhoneNumber`].text, `contact-details:fields.${contactTypeHome}_phone_number.change.errors.required`);
      });

      it('should return error if phone number is not valid', () => {
        const errors = validator.contactDetails(populatedHomePostInvalidRequest, contactTypeHome, contactChange);
        assert.equal(Object.keys(errors).length, 1);
        assert.equal(errors[`${contactTypeHome}PhoneNumber`].text, `contact-details:fields.${contactTypeHome}_phone_number.change.errors.format`);
      });

      it('should return error if phone number is to long (above 100 characters)', () => {
        const errors = validator.contactDetails(populatedHomePostLongRequest, contactTypeHome, contactChange);
        assert.equal(Object.keys(errors).length, 1);
        assert.equal(errors[`${contactTypeHome}PhoneNumber`].text, `contact-details:fields.${contactTypeHome}_phone_number.change.errors.length`);
      });
    });
    describe('add work phone number', () => {
      it('should return error when empty object is supplied', () => {
        const errors = validator.contactDetails(emptyWorkPostData, contactTypeWork, contactAdd);
        assert.equal(Object.keys(errors).length, 1);
        assert.equal(errors[`${contactTypeWork}PhoneNumber`].text, `contact-details:fields.${contactTypeWork}_phone_number.add.errors.required`);
      });

      it('should return error when invalid format object is supplied', () => {
        const errors = validator.contactDetails(emptyWorkPostData, contactTypeWork, contactAdd);
        assert.equal(Object.keys(errors).length, 1);
        assert.equal(errors[`${contactTypeWork}PhoneNumber`].text, `contact-details:fields.${contactTypeWork}_phone_number.add.errors.required`);
      });

      it('should return error if phone number is not valid', () => {
        const errors = validator.contactDetails(populatedWorkPostInvalidRequest, contactTypeWork, contactAdd);
        assert.equal(Object.keys(errors).length, 1);
        assert.equal(errors[`${contactTypeWork}PhoneNumber`].text, `contact-details:fields.${contactTypeWork}_phone_number.add.errors.format`);
      });

      it('should return error if phone number is to long (above 100 characters)', () => {
        const errors = validator.contactDetails(populatedWorkPostLongRequest, contactTypeWork, contactAdd);
        assert.equal(Object.keys(errors).length, 1);
        assert.equal(errors[`${contactTypeWork}PhoneNumber`].text, `contact-details:fields.${contactTypeWork}_phone_number.add.errors.length`);
      });
    });
    describe('change work phone number', () => {
      it('should return error when empty object is supplied', () => {
        const errors = validator.contactDetails(emptyWorkPostData, contactTypeWork, contactChange);
        assert.equal(Object.keys(errors).length, 1);
        assert.equal(errors[`${contactTypeWork}PhoneNumber`].text, `contact-details:fields.${contactTypeWork}_phone_number.change.errors.required`);
      });

      it('should return error when invalid format object is supplied', () => {
        const errors = validator.contactDetails(emptyWorkPostData, contactTypeWork, contactChange);
        assert.equal(Object.keys(errors).length, 1);
        assert.equal(errors[`${contactTypeWork}PhoneNumber`].text, `contact-details:fields.${contactTypeWork}_phone_number.change.errors.required`);
      });

      it('should return error if phone number is not valid', () => {
        const errors = validator.contactDetails(populatedWorkPostInvalidRequest, contactTypeWork, contactChange);
        assert.equal(Object.keys(errors).length, 1);
        assert.equal(errors[`${contactTypeWork}PhoneNumber`].text, `contact-details:fields.${contactTypeWork}_phone_number.change.errors.format`);
      });

      it('should return error if phone number is to long (above 100 characters)', () => {
        const errors = validator.contactDetails(populatedWorkPostLongRequest, contactTypeWork, contactChange);
        assert.equal(Object.keys(errors).length, 1);
        assert.equal(errors[`${contactTypeWork}PhoneNumber`].text, `contact-details:fields.${contactTypeWork}_phone_number.change.errors.length`);
      });
    });
    describe('add mobile phone number', () => {
      it('should return error when empty object is supplied', () => {
        const errors = validator.contactDetails(emptyMobilePostData, contactTypeMobile, contactAdd);
        assert.equal(Object.keys(errors).length, 1);
        assert.equal(errors[`${contactTypeMobile}PhoneNumber`].text, `contact-details:fields.${contactTypeMobile}_phone_number.add.errors.required`);
      });

      it('should return error when invalid format object is supplied', () => {
        const errors = validator.contactDetails(emptyMobilePostData, contactTypeMobile, contactAdd);
        assert.equal(Object.keys(errors).length, 1);
        assert.equal(errors[`${contactTypeMobile}PhoneNumber`].text, `contact-details:fields.${contactTypeMobile}_phone_number.add.errors.required`);
      });

      it('should return error if phone number is not valid', () => {
        const errors = validator.contactDetails(populatedMobilePostInvalidRequest, contactTypeMobile, contactAdd);
        assert.equal(Object.keys(errors).length, 1);
        assert.equal(errors[`${contactTypeMobile}PhoneNumber`].text, `contact-details:fields.${contactTypeMobile}_phone_number.add.errors.format`);
      });

      it('should return error if phone number is to long (above 100 characters)', () => {
        const errors = validator.contactDetails(populatedMobilePostLongRequest, contactTypeMobile, contactAdd);
        assert.equal(Object.keys(errors).length, 1);
        assert.equal(errors[`${contactTypeMobile}PhoneNumber`].text, `contact-details:fields.${contactTypeMobile}_phone_number.add.errors.length`);
      });
    });
    describe('change mobile phone number', () => {
      it('should return error when empty object is supplied', () => {
        const errors = validator.contactDetails(emptyMobilePostData, contactTypeMobile, contactChange);
        assert.equal(Object.keys(errors).length, 1);
        assert.equal(errors[`${contactTypeMobile}PhoneNumber`].text, `contact-details:fields.${contactTypeMobile}_phone_number.change.errors.required`);
      });

      it('should return error when invalid format object is supplied', () => {
        const errors = validator.contactDetails(emptyMobilePostData, contactTypeMobile, contactChange);
        assert.equal(Object.keys(errors).length, 1);
        assert.equal(errors[`${contactTypeMobile}PhoneNumber`].text, `contact-details:fields.${contactTypeMobile}_phone_number.change.errors.required`);
      });

      it('should return error if phone number is not valid', () => {
        const errors = validator.contactDetails(populatedMobilePostInvalidRequest, contactTypeMobile, contactChange);
        assert.equal(Object.keys(errors).length, 1);
        assert.equal(errors[`${contactTypeMobile}PhoneNumber`].text, `contact-details:fields.${contactTypeMobile}_phone_number.change.errors.format`);
      });

      it('should return error if phone number is to long (above 100 characters)', () => {
        const errors = validator.contactDetails(populatedMobilePostLongRequest, contactTypeMobile, contactChange);
        assert.equal(Object.keys(errors).length, 1);
        assert.equal(errors[`${contactTypeMobile}PhoneNumber`].text, `contact-details:fields.${contactTypeMobile}_phone_number.change.errors.length`);
      });
    });
    describe('add email', () => {
      it('should return error when empty object is supplied', () => {
        const errors = validator.contactDetails(emptyEmailPostData, contactTypeEmail, contactAdd);
        assert.equal(Object.keys(errors).length, 1);
        assert.equal(errors[contactTypeEmail].text, `contact-details:fields.${contactTypeEmail}.add.errors.required`);
      });

      it('should return error when invalid format object is supplied', () => {
        const errors = validator.contactDetails(emptyEmailPostData, contactTypeEmail, contactAdd);
        assert.equal(Object.keys(errors).length, 1);
        assert.equal(errors[contactTypeEmail].text, `contact-details:fields.${contactTypeEmail}.add.errors.required`);
      });

      it('should return error if email is not valid', () => {
        const errors = validator.contactDetails(populatedEmailPostInvalidRequest, contactTypeEmail, contactAdd);
        assert.equal(Object.keys(errors).length, 1);
        assert.equal(errors[contactTypeEmail].text, `contact-details:fields.${contactTypeEmail}.add.errors.format`);
      });

      it('should return error if email is to long (above 100 characters)', () => {
        const errors = validator.contactDetails(populatedEmailPostLongRequest, contactTypeEmail, contactAdd);
        assert.equal(Object.keys(errors).length, 1);
        assert.equal(errors[contactTypeEmail].text, `contact-details:fields.${contactTypeEmail}.add.errors.length`);
      });
    });
    describe('change email', () => {
      it('should return error when empty object is supplied', () => {
        const errors = validator.contactDetails(emptyEmailPostData, contactTypeEmail, contactChange);
        assert.equal(Object.keys(errors).length, 1);
        assert.equal(errors[contactTypeEmail].text, `contact-details:fields.${contactTypeEmail}.change.errors.required`);
      });

      it('should return error when invalid format object is supplied', () => {
        const errors = validator.contactDetails(emptyEmailPostData, contactTypeEmail, contactChange);
        assert.equal(Object.keys(errors).length, 1);
        assert.equal(errors[contactTypeEmail].text, `contact-details:fields.${contactTypeEmail}.change.errors.required`);
      });

      it('should return error if email is not valid', () => {
        const errors = validator.contactDetails(populatedEmailPostInvalidRequest, contactTypeEmail, contactChange);
        assert.equal(Object.keys(errors).length, 1);
        assert.equal(errors[contactTypeEmail].text, `contact-details:fields.${contactTypeEmail}.change.errors.format`);
      });

      it('should return error if email is to long (above 100 characters)', () => {
        const errors = validator.contactDetails(populatedEmailPostLongRequest, contactTypeEmail, contactChange);
        assert.equal(Object.keys(errors).length, 1);
        assert.equal(errors[contactTypeEmail].text, `contact-details:fields.${contactTypeEmail}.change.errors.length`);
      });

      it('should return no errors when email address is valid', () => {
        const errors = validator.contactDetails(validEmailPostData, contactTypeEmail, contactChange);
        assert.equal(Object.keys(errors).length, 0);
      });

      it('should return no errors when email address is valid but contains spaces at start', () => {
        const errors = validator.contactDetails(validEmailSpacesStartPostData, contactTypeEmail, contactChange);
        assert.equal(Object.keys(errors).length, 0);
      });

      it('should return no errors when email address is valid but contains spaces at end', () => {
        const errors = validator.contactDetails(validEmailSpacesEndPostData, contactTypeEmail, contactChange);
        assert.equal(Object.keys(errors).length, 0);
      });

      it('should return no errors when email address is valid but contains spaces at start and end', () => {
        const errors = validator.contactDetails(validEmailSpacesBothPostData, contactTypeEmail, contactChange);
        assert.equal(Object.keys(errors).length, 0);
      });
    });
  });

  describe('addressPostcodeDetails validator', () => {
    it('should return error when empty object is supplied', () => {
      const errors = validator.addressPostcodeDetails(emptyPostcodePostData);
      assert.equal(Object.keys(errors).length, 1);
      assert.equal(errors.postcode.text, 'address:fields.postcode.errors.required');
    });

    it('should return error when blank object is supplied', () => {
      const errors = validator.addressPostcodeDetails(blankPostcodePostData);
      assert.equal(Object.keys(errors).length, 1);
      assert.equal(errors.postcode.text, 'address:fields.postcode.errors.required');
    });

    it('should return error when invalid format object is supplied', () => {
      const errors = validator.addressPostcodeDetails(formatPostcodePostData);
      assert.equal(Object.keys(errors).length, 1);
      assert.equal(errors.postcode.text, 'address:fields.postcode.errors.format');
    });
  });

  describe('addressDetails validator', () => {
    it('should return error when empty object is supplied', () => {
      const errors = validator.addressDetails(emptyAddressPostData);
      assert.equal(Object.keys(errors).length, 1);
      assert.equal(errors.address.text, 'address:fields.address.errors.required');
    });

    it('should return error when blank object is supplied', () => {
      const errors = validator.addressDetails(blankAddressPostData);
      assert.equal(Object.keys(errors).length, 1);
      assert.equal(errors.address.text, 'address:fields.address.errors.required');
    });
  });

  describe('bankBuildingAccountDetails validator', () => {
    it('should return error when empty object is supplied', () => {
      const errors = validator.bankBuildingAccountDetails(emptyBankBuildingPostData);
      assert.equal(Object.keys(errors).length, 3);
    });

    it('should return error when blank object is supplied', () => {
      const errors = validator.bankBuildingAccountDetails(blankBankPostData);
      assert.equal(Object.keys(errors).length, 3);
    });

    describe(' accountName ', () => {
      it('should return error if empty ', () => {
        const accountValidationResponse = validator.bankBuildingAccountDetails(bankObjects.emptyObject);
        assert.equal(accountValidationResponse.accountName.text, 'account:fields.accountName.errors.required');
      });
      it('should return error if to long (greater then 70 characters) ', () => {
        const accountValidationResponse = validator.bankBuildingAccountDetails(bankObjects.longTextObject);
        assert.equal(accountValidationResponse.accountName.text, 'account:fields.accountName.errors.length');
      });
      it('should return error if text includes none alpha ', () => {
        const accountValidationResponse = validator.bankBuildingAccountDetails(bankObjects.nonAlphaName);
        assert.equal(accountValidationResponse.accountName.text, 'account:fields.accountName.errors.format');
      });
      it('should return no error if text includes a & ', () => {
        const accountValidationResponse = validator.bankBuildingAccountDetails(bankObjects.includesAnd);
        assert.equal(accountValidationResponse.accountName, undefined);
      });
      it('should return error if text does not start with alpha ', () => {
        const accountValidationResponse = validator.bankBuildingAccountDetails(bankObjects.startNotAlphaName);
        assert.equal(accountValidationResponse.accountName.text, 'account:fields.accountName.errors.format');
      });
    });

    describe('account number ', () => {
      it('should return error if empty', () => {
        const accountValidationResponse = validator.bankBuildingAccountDetails(bankObjects.emptyObject);
        assert.equal(accountValidationResponse.accountNumber.text, 'account:fields.accountNumber.errors.required');
      });
      it('should return error if less then 8 numbers', () => {
        const accountValidationResponse = validator.bankBuildingAccountDetails(bankObjects.shortAccount);
        assert.equal(accountValidationResponse.accountNumber.text, 'account:fields.accountNumber.errors.length');
      });

      it('should return error if more then 8 numbers', () => {
        const accountValidationResponse = validator.bankBuildingAccountDetails(bankObjects.longAccount);
        assert.equal(accountValidationResponse.accountNumber.text, 'account:fields.accountNumber.errors.length');
      });
    });

    describe('sort code ', () => {
      it('should return error if empty', () => {
        const accountValidationResponse = validator.bankBuildingAccountDetails(bankObjects.emptyObject);
        assert.equal(accountValidationResponse.sortCode.text, 'account:fields.sortCode.errors.required');
      });
      it('should return error if not numbers', () => {
        const accountValidationResponse = validator.bankBuildingAccountDetails(bankObjects.textAccount);
        assert.equal(accountValidationResponse.sortCode.text, 'account:fields.sortCode.errors.format');
      });
      it('should return error if one numbers', () => {
        const accountValidationResponse = validator.bankBuildingAccountDetails(bankObjects.shortAccount);
        assert.equal(accountValidationResponse.sortCode.text, 'account:fields.sortCode.errors.length');
      });
      it('should return error if length greater then 6', () => {
        const accountValidationResponse = validator.bankBuildingAccountDetails(bankObjects.longAccount);
        assert.equal(accountValidationResponse.sortCode.text, 'account:fields.sortCode.errors.length');
      });
      it('should return no errors when sort code is valid and contains spaces', () => {
        const accountValidationResponse = validator.bankBuildingAccountDetails(bankObjects.validObjectWithSpaces);
        assert.equal(accountValidationResponse.length, 0);
      });
      it('should return no errors when sort code valid and contains hyphens', () => {
        const accountValidationResponse = validator.bankBuildingAccountDetails(bankObjects.validObjectWithHyphens);
        assert.equal(accountValidationResponse.length, 0);
      });
      it('should return no errors when sort code valid, contains hyphens and spaces', () => {
        const accountValidationResponse = validator.bankBuildingAccountDetails(bankObjects.validObjectWithHyphensAndSpaces);
        assert.equal(accountValidationResponse.length, 0);
      });
    });

    describe('buildingRoll  ', () => {
      it('should return no error if roll is empty ', () => {
        const accountValidationResponse = validator.bankBuildingAccountDetails(buildingObjects.emptyRoll);
        assert.equal(accountValidationResponse.referenceNumber, undefined);
      });
      it('should return no error if roll is valid', () => {
        const accountValidationResponse = validator.bankBuildingAccountDetails(buildingObjects.validRoll);
        assert.equal(accountValidationResponse.referenceNumber, undefined);
      });
      it('should return error if contains $$', () => {
        const accountValidationResponse = validator.bankBuildingAccountDetails(buildingObjects.invalidRoll);
        assert.equal(accountValidationResponse.referenceNumber.text, 'account:fields.referenceNumber.errors.format');
      });
      it('should return error if to long', () => {
        const accountValidationResponse = validator.bankBuildingAccountDetails(buildingObjects.longRoll);
        assert.equal(accountValidationResponse.referenceNumber.text, 'account:fields.referenceNumber.errors.length');
      });
    });
  });

  describe('paymentFrequency validator', () => {
    it('should return error when empty object is supplied', () => {
      const errors = validator.paymentFrequency(emptyPaymentFrequencyPostData);
      assert.equal(Object.keys(errors).length, 1);
      assert.equal(errors.frequency.text, 'payment-frequency:fields.frequency.errors.required');
    });

    it('should return error when blank object is supplied', () => {
      const errors = validator.paymentFrequency(blankPaymentFrequencyPostData);
      assert.equal(Object.keys(errors).length, 1);
      assert.equal(errors.frequency.text, 'payment-frequency:fields.frequency.errors.required');
    });

    it('should return error when invalid frequency is supplied', () => {
      const errors = validator.paymentFrequency(invalidPaymentFrequencyPostData);
      assert.equal(Object.keys(errors).length, 1);
      assert.equal(errors.frequency.text, 'payment-frequency:fields.frequency.errors.required');
    });

    it('should return no error when valid frequency is supplied - 1W', () => {
      const errors = validator.paymentFrequency({ frequency: '1W' });
      assert.equal(Object.keys(errors).length, 0);
    });

    it('should return no error when valid frequency is supplied - 2W', () => {
      const errors = validator.paymentFrequency({ frequency: '2W' });
      assert.equal(Object.keys(errors).length, 0);
    });

    it('should return no error when valid frequency is supplied - 4W', () => {
      const errors = validator.paymentFrequency({ frequency: '4W' });
      assert.equal(Object.keys(errors).length, 0);
    });

    it('should return no error when valid frequency is supplied - 13W', () => {
      const errors = validator.paymentFrequency({ frequency: '13W' });
      assert.equal(Object.keys(errors).length, 0);
    });
  });

  describe('dateOfDeath validator', () => {
    it('should return no error when valid data is supplied - V', () => {
      const errors = validator.dateOfDeathValidation({
        dateYear: '2019', dateMonth: '01', dateDay: '01', verification: 'V',
      });
      assert.equal(Object.keys(errors).length, 0);
    });

    it('should return no error when valid data is supplied - NV', () => {
      const errors = validator.dateOfDeathValidation({
        dateYear: '2019', dateMonth: '01', dateDay: '01', verification: 'NV',
      });
      assert.equal(Object.keys(errors).length, 0);
    });

    it('should return all errors when empty', () => {
      const errors = validator.dateOfDeathValidation({ });
      assert.equal(Object.keys(errors).length, 5);
    });

    it('should return all errors when blank', () => {
      const errors = validator.dateOfDeathValidation({
        dateYear: '', dateMonth: '', dateDay: '', verification: '',
      });
      assert.equal(Object.keys(errors).length, 5);
    });

    it('should return error when date in the future', () => {
      const errors = validator.dateOfDeathValidation({
        dateYear: '2099', dateMonth: '01', dateDay: '01', verification: 'V',
      });
      assert.equal(Object.keys(errors).length, 1);
      assert.equal(errors.date.text, 'date-of-death:fields.date.errors.future');
    });

    it('should return error when month is invalid', () => {
      const errors = validator.dateOfDeathValidation({
        dateYear: '2018', dateMonth: '20', dateDay: '01', verification: 'V',
      });
      assert.equal(Object.keys(errors).length, 2);
      assert.equal(errors.date.text, 'date-of-death:fields.date.errors.format');
    });

    it('should return error when day is invalid', () => {
      const errors = validator.dateOfDeathValidation({
        dateYear: '2018', dateMonth: '01', dateDay: '40', verification: 'V',
      });
      assert.equal(Object.keys(errors).length, 2);
      assert.equal(errors.date.text, 'date-of-death:fields.date.errors.format');
    });

    it('should return error when verification is invalid', () => {
      const errors = validator.dateOfDeathValidation({
        dateYear: '2018', dateMonth: '01', dateDay: '01', verification: 'bob',
      });
      assert.equal(Object.keys(errors).length, 1);
      assert.equal(errors.verification.text, 'date-of-death:fields.verification.errors.required');
    });
  });

  describe('dateOfDeathVerify validator', () => {
    it('should return no error when yes is supplied', () => {
      const errors = validator.dateOfDeathVerify({
        verify: 'yes',
      });
      assert.equal(Object.keys(errors).length, 0);
    });

    it('should return no error when no is supplied', () => {
      const errors = validator.dateOfDeathVerify({
        verify: 'no',
      });
      assert.equal(Object.keys(errors).length, 0);
    });

    it('should return error when empty', () => {
      const errors = validator.dateOfDeathVerify({ });
      assert.equal(Object.keys(errors).length, 1);
      assert.equal(errors.verify.text, 'verify-date-of-death:fields.verify.errors.required');
    });

    it('should return error when blank', () => {
      const errors = validator.dateOfDeathVerify({
        verify: '',
      });
      assert.equal(Object.keys(errors).length, 1);
      assert.equal(errors.verify.text, 'verify-date-of-death:fields.verify.errors.required');
    });

    it('should return error when not yes or no', () => {
      const errors = validator.dateOfDeathVerify({
        verify: 'bob',
      });
      assert.equal(Object.keys(errors).length, 1);
      assert.equal(errors.verify.text, 'verify-date-of-death:fields.verify.errors.required');
    });
  });

  describe('dateOfDeathVerifed validator', () => {
    it('should return no error when valid data is supplied', () => {
      const errors = validator.dateOfDeathVerifedValidation({
        dateYear: '2019', dateMonth: '01', dateDay: '01', verification: 'V',
      });
      assert.equal(Object.keys(errors).length, 0);
    });

    it('should return all errors when empty', () => {
      const errors = validator.dateOfDeathVerifedValidation({ });
      assert.equal(Object.keys(errors).length, 4);
    });

    it('should return all errors when blank', () => {
      const errors = validator.dateOfDeathVerifedValidation({
        dateYear: '', dateMonth: '', dateDay: '',
      });
      assert.equal(Object.keys(errors).length, 4);
    });

    it('should return error when date in the future', () => {
      const errors = validator.dateOfDeathVerifedValidation({
        dateYear: '2099', dateMonth: '01', dateDay: '01',
      });
      assert.equal(Object.keys(errors).length, 1);
      assert.equal(errors.date.text, 'verified-date-of-death:fields.date.errors.future');
    });

    it('should return error when month is invalid', () => {
      const errors = validator.dateOfDeathVerifedValidation({
        dateYear: '2018', dateMonth: '20', dateDay: '01',
      });
      assert.equal(Object.keys(errors).length, 2);
      assert.equal(errors.date.text, 'verified-date-of-death:fields.date.errors.format');
    });

    it('should return error when day is invalid', () => {
      const errors = validator.dateOfDeathVerifedValidation({
        dateYear: '2018', dateMonth: '01', dateDay: '40',
      });
      assert.equal(Object.keys(errors).length, 2);
      assert.equal(errors.date.text, 'verified-date-of-death:fields.date.errors.format');
    });
  });

  describe('reviewAwardEntitlementDateValidation validator', () => {
    it('should return no error when valid data is supplied', () => {
      const errors = validator.reviewAwardEntitlementDateValidation(1541030400000, {
        dateYear: '2019', dateMonth: '01', dateDay: '01', verification: 'V',
      });
      assert.equal(Object.keys(errors).length, 0);
    });

    it('should return all errors when empty', () => {
      const errors = validator.reviewAwardEntitlementDateValidation(1541030400000, { });
      assert.equal(Object.keys(errors).length, 4);
    });

    it('should return all errors when blank', () => {
      const errors = validator.reviewAwardEntitlementDateValidation(1541030400000, {
        dateYear: '', dateMonth: '', dateDay: '',
      });
      assert.equal(Object.keys(errors).length, 4);
    });

    it('should return error when date in before sp data', () => {
      const errors = validator.reviewAwardEntitlementDateValidation(1541030400000, {
        dateYear: '2017', dateMonth: '01', dateDay: '01',
      });
      assert.equal(Object.keys(errors).length, 1);
      assert.equal(errors.date.text, 'review-award-date:fields.date.errors.before');
    });

    it('should return no error when date in sp data', () => {
      const errors = validator.reviewAwardEntitlementDateValidation(1583474400000, {
        dateYear: '2020', dateMonth: '03', dateDay: '06',
      });
      assert.equal(Object.keys(errors).length, 0);
    });

    it('should return error when month is invalid', () => {
      const errors = validator.reviewAwardEntitlementDateValidation(1541030400000, {
        dateYear: '2018', dateMonth: '20', dateDay: '01',
      });
      assert.equal(Object.keys(errors).length, 2);
      assert.equal(errors.date.text, 'review-award-date:fields.date.errors.format');
    });

    it('should return error when day is invalid', () => {
      const errors = validator.reviewAwardEntitlementDateValidation(1541030400000, {
        dateYear: '2018', dateMonth: '01', dateDay: '40',
      });
      assert.equal(Object.keys(errors).length, 2);
      assert.equal(errors.date.text, 'review-award-date:fields.date.errors.format');
    });
  });

  describe('payeeAccountDetails validator', () => {
    it('should return error when empty object is supplied', () => {
      const errors = validator.payeeAccountDetails(emptyBankBuildingPostData);
      assert.equal(Object.keys(errors).length, 3);
    });

    it('should return error when blank object is supplied', () => {
      const errors = validator.payeeAccountDetails(blankBankPostData);
      assert.equal(Object.keys(errors).length, 3);
    });

    describe(' accountName ', () => {
      it('should return error if empty ', () => {
        const accountValidationResponse = validator.payeeAccountDetails(bankObjects.emptyObject);
        assert.equal(accountValidationResponse.accountName.text, 'payee-account:fields.accountName.errors.required');
      });
      it('should return error if to long (greater then 70 characters) ', () => {
        const accountValidationResponse = validator.payeeAccountDetails(bankObjects.longTextObject);
        assert.equal(accountValidationResponse.accountName.text, 'payee-account:fields.accountName.errors.length');
      });
      it('should return no error if 70 characters long', () => {
        const accountValidationResponse = validator.payeeAccountDetails(bankObjects.maxTextObject);
        assert.equal(accountValidationResponse.accountName, undefined);
      });
      it('should return error if text includes none alpha ', () => {
        const accountValidationResponse = validator.payeeAccountDetails(bankObjects.nonAlphaName);
        assert.equal(accountValidationResponse.accountName.text, 'payee-account:fields.accountName.errors.format');
      });
      it('should return no error if text includes a & ', () => {
        const accountValidationResponse = validator.payeeAccountDetails(bankObjects.includesAnd);
        assert.equal(accountValidationResponse.accountName, undefined);
      });
      it('should return error if text does not start with alpha ', () => {
        const accountValidationResponse = validator.payeeAccountDetails(bankObjects.startNotAlphaName);
        assert.equal(accountValidationResponse.accountName.text, 'payee-account:fields.accountName.errors.format');
      });
    });

    describe('account number ', () => {
      it('should return error if empty', () => {
        const accountValidationResponse = validator.payeeAccountDetails(bankObjects.emptyObject);
        assert.equal(accountValidationResponse.accountNumber.text, 'payee-account:fields.accountNumber.errors.required');
      });
      it('should return error if less then 8 numbers', () => {
        const accountValidationResponse = validator.payeeAccountDetails(bankObjects.shortAccount);
        assert.equal(accountValidationResponse.accountNumber.text, 'payee-account:fields.accountNumber.errors.length');
      });

      it('should return error if more then 8 numbers', () => {
        const accountValidationResponse = validator.payeeAccountDetails(bankObjects.longAccount);
        assert.equal(accountValidationResponse.accountNumber.text, 'payee-account:fields.accountNumber.errors.length');
      });
    });

    describe('sort code ', () => {
      it('should return error if empty', () => {
        const accountValidationResponse = validator.payeeAccountDetails(bankObjects.emptyObject);
        assert.equal(accountValidationResponse.sortCode.text, 'payee-account:fields.sortCode.errors.required');
      });
      it('should return error if not numbers', () => {
        const accountValidationResponse = validator.payeeAccountDetails(bankObjects.textAccount);
        assert.equal(accountValidationResponse.sortCode.text, 'payee-account:fields.sortCode.errors.format');
      });
      it('should return error if one numbers', () => {
        const accountValidationResponse = validator.payeeAccountDetails(bankObjects.shortAccount);
        assert.equal(accountValidationResponse.sortCode.text, 'payee-account:fields.sortCode.errors.length');
      });
      it('should return error if length greater then 6', () => {
        const accountValidationResponse = validator.payeeAccountDetails(bankObjects.longAccount);
        assert.equal(accountValidationResponse.sortCode.text, 'payee-account:fields.sortCode.errors.length');
      });
      it('should return no errors when sort code is valid and contains spaces', () => {
        const accountValidationResponse = validator.payeeAccountDetails(bankObjects.validObjectWithSpaces);
        assert.equal(accountValidationResponse.length, 0);
      });
      it('should return no errors when sort code valid and contains hyphens', () => {
        const accountValidationResponse = validator.payeeAccountDetails(bankObjects.validObjectWithHyphens);
        assert.equal(accountValidationResponse.length, 0);
      });
      it('should return no errors when sort code valid, contains hyphens and spaces', () => {
        const accountValidationResponse = validator.payeeAccountDetails(bankObjects.validObjectWithHyphensAndSpaces);
        assert.equal(accountValidationResponse.length, 0);
      });
    });

    describe('buildingRoll  ', () => {
      it('should return no error if roll is empty ', () => {
        const accountValidationResponse = validator.payeeAccountDetails(buildingObjects.emptyRoll);
        assert.equal(accountValidationResponse.referenceNumber, undefined);
      });
      it('should return no error if roll is valid', () => {
        const accountValidationResponse = validator.payeeAccountDetails(buildingObjects.validRoll);
        assert.equal(accountValidationResponse.referenceNumber, undefined);
      });
      it('should return error if contains $$', () => {
        const accountValidationResponse = validator.payeeAccountDetails(buildingObjects.invalidRoll);
        assert.equal(accountValidationResponse.referenceNumber.text, 'payee-account:fields.referenceNumber.errors.format');
      });
      it('should return error if to long', () => {
        const accountValidationResponse = validator.payeeAccountDetails(buildingObjects.longRoll);
        assert.equal(accountValidationResponse.referenceNumber.text, 'payee-account:fields.referenceNumber.errors.length');
      });
    });
  });

  describe('maritalDate validator', () => {
    ['divorced', 'widowed', 'dissolved'].forEach((status) => {
      it(`should return no error when valid data is supplied - V ${status} status`, () => {
        const errors = validator.maritalDate({
          dateYear: '2019', dateMonth: '01', dateDay: '01', verification: 'V',
        });
        assert.equal(Object.keys(errors).length, 0);
      });

      it(`should return no error when valid data is supplied - NV V ${status} status`, () => {
        const errors = validator.maritalDate({
          dateYear: '2019', dateMonth: '01', dateDay: '01', verification: 'NV',
        });
        assert.equal(Object.keys(errors).length, 0);
      });

      it(`should return all errors when empty - ${status} status`, () => {
        const errors = validator.maritalDate({ }, status);
        assert.equal(Object.keys(errors).length, 5);
      });

      it(`should return all errors when blank - ${status}`, () => {
        const errors = validator.maritalDate({
          dateYear: '', dateMonth: '', dateDay: '', verification: '',
        }, status);
        assert.equal(Object.keys(errors).length, 5);
      });

      it(`should return error when date in the future - ${status}`, () => {
        const errors = validator.maritalDate({
          dateYear: '2099', dateMonth: '01', dateDay: '01', verification: 'V',
        }, status);
        assert.equal(Object.keys(errors).length, 1);
        assert.equal(errors.date.text, `marital-date:fields.date.errors.${status}.future`);
      });

      it(`should return error when year is invalid - ${status}`, () => {
        const errors = validator.maritalDate({
          dateYear: '20', dateMonth: '01', dateDay: '01', verification: 'V',
        }, status);
        assert.equal(Object.keys(errors).length, 2);
        assert.equal(errors.date.text, `marital-date:fields.date.errors.${status}.format`);
      });

      it(`should return error when month is invalid - ${status}`, () => {
        const errors = validator.maritalDate({
          dateYear: '2018', dateMonth: '20', dateDay: '01', verification: 'V',
        }, status);
        assert.equal(Object.keys(errors).length, 2);
        assert.equal(errors.date.text, `marital-date:fields.date.errors.${status}.format`);
      });

      it(`should return error when day is invalid - ${status}`, () => {
        const errors = validator.maritalDate({
          dateYear: '2018', dateMonth: '01', dateDay: '40', verification: 'V',
        }, status);
        assert.equal(Object.keys(errors).length, 2);
        assert.equal(errors.date.text, `marital-date:fields.date.errors.${status}.format`);
      });

      it(`should return error when verification is invalid - ${status}`, () => {
        const errors = validator.maritalDate({
          dateYear: '2018', dateMonth: '01', dateDay: '01', verification: 'bob',
        }, status);
        assert.equal(Object.keys(errors).length, 1);
        assert.equal(errors.verification.text, `marital-date:fields.verification.errors.${status}.required`);
      });
    });
  });

  describe('maritalStatus validator', () => {
    it('should return error when data is undefined', () => {
      const errors = validator.maritalStatus();
      assert.equal(Object.keys(errors).length, 1);
      assert.equal(errors.maritalStatus.text, 'marital-status:fields.status.errors.required');
    });
    it('should return error when status is undefined', () => {
      const errors = validator.maritalStatus({});
      assert.equal(Object.keys(errors).length, 1);
      assert.equal(errors.maritalStatus.text, 'marital-status:fields.status.errors.required');
    });
    it('should return no error when valid data is supplied - Married', () => {
      const errors = validator.maritalStatus({
        maritalStatus: 'divorced',
      }, 'Married');
      assert.equal(Object.keys(errors).length, 0);
    });
    ['Married', 'Civil Partnership'].forEach((currentMaritalStatus) => {
      it(`should return error when status is undefined - ${currentMaritalStatus}`, () => {
        const errors = validator.maritalStatus({}, currentMaritalStatus);
        assert.equal(Object.keys(errors).length, 1);
        assert.equal(errors.maritalStatus.text, 'marital-status:fields.status.errors.required');
      });
      it(`should return error when status is blank - ${currentMaritalStatus}`, () => {
        const errors = validator.maritalStatus({ maritalStatus: '' }, currentMaritalStatus);
        assert.equal(Object.keys(errors).length, 1);
        assert.equal(errors.maritalStatus.text, 'marital-status:fields.status.errors.required');
      });
      it(`should return error when status is invalid status - ${currentMaritalStatus}`, () => {
        const errors = validator.maritalStatus({ maritalStatus: 'bob' }, currentMaritalStatus);
        assert.equal(Object.keys(errors).length, 1);
        assert.equal(errors.maritalStatus.text, 'marital-status:fields.status.errors.required');
      });
    });
  });

  describe('maritalPartnerNino validator', () => {
    ['married', 'civil', 'divorced', 'widowed', 'dissolved'].forEach((status) => {
      it(`should return error when data is undefined - ${status}`, () => {
        const errors = validator.maritalPartnerNino({ }, status);
        assert.equal(Object.keys(errors).length, 1);
        assert.equal(errors.partnerNino.text, `marital-detail:${status}.fields.nino.errors.invalid`);
      });
      it(`should return error when partnerNino is blank - ${status}`, () => {
        const errors = validator.maritalPartnerNino({ partnerNino: '' }, status);
        assert.equal(Object.keys(errors).length, 1);
        assert.equal(errors.partnerNino.text, `marital-detail:${status}.fields.nino.errors.invalid`);
      });
      it(`should return error when partnerNino is invalid - ${status}`, () => {
        const errors = validator.maritalPartnerNino({ partnerNino: 'ZZ123456C' }, status);
        assert.equal(Object.keys(errors).length, 1);
        assert.equal(errors.partnerNino.text, `marital-detail:${status}.fields.nino.errors.invalid`);
      });
      it(`should return error when partnerNino length is 7 - ${status}`, () => {
        const errors = validator.maritalPartnerNino({ partnerNino: 'AA12345' }, status);
        assert.equal(Object.keys(errors).length, 1);
        assert.equal(errors.partnerNino.text, `marital-detail:${status}.fields.nino.errors.length`);
      });
      it(`should return error when partnerNino length is 10 - ${status}`, () => {
        const errors = validator.maritalPartnerNino({ partnerNino: 'AA12345678' }, status);
        assert.equal(Object.keys(errors).length, 1);
        assert.equal(errors.partnerNino.text, `marital-detail:${status}.fields.nino.errors.length`);
      });
      it(`should return no errors when partnerNino valid - ${status}`, () => {
        const errors = validator.maritalPartnerNino({ partnerNino: 'AA123456C' }, status);
        assert.equal(Object.keys(errors).length, 0);
      });
    });
  });
});
