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
});
