const { assert } = require('chai');
const checkChangeHelper = require('../../../../lib/helpers/checkChangeHelper');


const emptyRequest = {};
const emptySession = { session: {} };
const editTrueQueryRequest = { session: {}, query: { edit: 'true' } };
const editFalseQueryRequest = { session: {}, query: { edit: 'false' } };

const editSectionValidRequest = { session: { editSection: 'section' } };
const editSectionInvalidRequest = { session: {} };

const sessionRequest = { session: { foo: { bar: { foo: 'bar' } } } };

const editSection = { session: { editSection: true, editSectionShowError: true } };

const sessionNoEdits = { session: { test: { foo: {}, bar: {} } } };

const sessionEdits = { session: { test: { foo__edit: { foo: 'bar' }, bar__edit: { bar: 'food' } } } };
const sessionEditsClean = { session: { test: { } } };

const sessionEditsAddress = { session: { test: { 'dap-address__edit': { foo: 'bar' }, bar__edit: { bar: 'food' } } } };
const sessionEditsAddressClean = { session: { test: { 'dap-address': { foo: 'bar' }, bar: { bar: 'food' } } } };

describe('Check Change Helper ', () => {
  describe('checkAndSetEditMode', () => {
    it('should return false when query is undefined', () => {
      assert.equal(checkChangeHelper.checkAndSetEditMode(emptyRequest, 'section'), false);
    });

    it('should return false when query edit is not true', () => {
      assert.equal(checkChangeHelper.checkAndSetEditMode(editFalseQueryRequest, 'section'), false);
    });

    it('should return true when query edit is true', () => {
      checkChangeHelper.checkAndSetEditMode(editTrueQueryRequest, 'section');
      assert.equal(editTrueQueryRequest.session.editSection, 'section');
    });
  });

  describe('isEditMode', () => {
    it('should return false with empty request', () => {
      assert.equal(checkChangeHelper.isEditMode(emptyRequest, 'section'), false);
    });

    it('should return false when edit section does not match', () => {
      assert.equal(checkChangeHelper.isEditMode(editSectionInvalidRequest, 'section'), false);
    });

    it('should return true when edit section does match', () => {
      assert.equal(checkChangeHelper.isEditMode(editSectionValidRequest, 'section'), true);
    });

    it('should return true when edit section does match when an array is supplied', () => {
      assert.equal(checkChangeHelper.isEditMode(editSectionValidRequest, ['section', 'section2']), true);
    });
  });

  describe('clearCheckChange', () => {
    it('should return editSection session as undefined when editSection in session', () => {
      checkChangeHelper.clearCheckChange(editSection);
      assert.isUndefined(editSection.session.editSection);
    });
  });

  describe('checkEditSectionAndClearCheckChange', () => {
    it('should return false when edit mode is false', () => {
      assert.isFalse(checkChangeHelper.checkEditSectionAndClearCheckChange(emptySession, false));
    });

    it('should return false when edit mode is undefined', () => {
      assert.isFalse(checkChangeHelper.checkEditSectionAndClearCheckChange(emptySession));
    });

    it('should return true when edit mode true', () => {
      assert.isTrue(checkChangeHelper.checkEditSectionAndClearCheckChange(emptySession, true));
    });

    it('should clear check change edit section when edit mode is true and section exists in request', () => {
      const request = { session: { editSection: 'edit-section' } };
      assert.isTrue(checkChangeHelper.checkEditSectionAndClearCheckChange(request, true));
      assert.isUndefined(request.session.editSection);
    });

    it('should retain check change edit section when edit mode is false and section exists in request', () => {
      const request = { session: { editSection: 'edit-section' } };
      assert.isFalse(checkChangeHelper.checkEditSectionAndClearCheckChange(request, false));
      assert.equal(request.session.editSection, 'edit-section');
    });
  });

  describe('cleanUpCheckChange', () => {
    it('should return false as section not supplied', () => {
      assert.isFalse(checkChangeHelper.cleanUpCheckChange(emptySession));
    });

    it('should return false as section does not exist in request', () => {
      assert.isFalse(checkChangeHelper.cleanUpCheckChange(emptySession, 'test'));
    });

    it('should return true as section exits no edits keys exist in session', () => {
      assert.isTrue(checkChangeHelper.cleanUpCheckChange(sessionNoEdits, 'test'));
    });

    it('should return true and remove edit keys when section edits keys exist in session', () => {
      assert.isTrue(checkChangeHelper.cleanUpCheckChange(sessionEdits, 'test'));
      assert.deepEqual(sessionEdits, sessionEditsClean);
    });

    it('should return true, remove edit keys and repace with edit data when section edits keys exist in session', () => {
      assert.isTrue(checkChangeHelper.cleanUpCheckChange(sessionEditsAddress, 'test'));
      assert.deepEqual(sessionEditsAddress, sessionEditsAddressClean);
    });
  });

  describe('getEditOrPreviousData', () => {
    it('should return previous data session when edit data not in session and edit mode is true', () => {
      assert.deepEqual(checkChangeHelper.getEditOrPreviousData(sessionRequest, 'foo', 'bar', true), sessionRequest.session.foo.bar);
    });

    it('should return previous data session when edit data session and edit mode is false', () => {
      assert.deepEqual(checkChangeHelper.getEditOrPreviousData(sessionRequest, 'foo', 'bar', false), sessionRequest.session.foo.bar);
    });

    it('should return edit data session when edit data session and edit mode is true', () => {
      assert.deepEqual(checkChangeHelper.getEditOrPreviousData(sessionEdits, 'test', 'bar', true), sessionEdits.session.test.bar);
    });
  });
});
