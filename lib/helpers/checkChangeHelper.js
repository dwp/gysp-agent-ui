const i18n = require('i18next');

const deleteSession = require('../deleteSession');
const dataStore = require('../dataStore');

i18n.init({ sendMissingTo: 'fallback' });

module.exports = {
  checkAndSetEditMode(req, section) {
    if (req.query !== undefined && req.query.edit === 'true') {
      req.session.editSection = section;
    }
    return false;
  },
  isEditMode(req, section) {
    if (req.session !== undefined) {
      if (Array.isArray(section) && section.includes(req.session.editSection)) {
        return true;
      }
      if (req.session.editSection === section) {
        return true;
      }
    }
    return false;
  },
  clearCheckChange(req) {
    deleteSession.deleteEditSection(req);
  },
  checkEditSectionAndClearCheckChange(req, editMode) {
    if (editMode) {
      this.clearCheckChange(req);
      return true;
    }
    return false;
  },
  cleanUpCheckChange(req, section) {
    if (req.session[section] === undefined) {
      return false;
    }
    const filteredEditSections = Object.keys(req.session[section]).filter((name) => /__edit/.test(name));
    if (req.session[section]['dap-address__edit']) {
      filteredEditSections.forEach((editKey) => {
        const details = dataStore.get(req, editKey, section);
        const key = editKey.replace(/__edit/g, '');
        dataStore.save(req, key, details, section);
      });
    }
    deleteSession.deleteSessionByArraysKey(req, section, filteredEditSections);
    deleteSession.deleteEditSection(req);
    return true;
  },
  getEditOrPreviousData(req, section, key, editMode) {
    if (editMode && req.session[section][`${key}__edit`]) {
      return dataStore.get(req, `${key}__edit`, section);
    }
    return dataStore.get(req, key, section);
  },
};
