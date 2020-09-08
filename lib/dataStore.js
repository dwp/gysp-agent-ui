const deleteSession = require('./deleteSession');

module.exports = {
  get(req, key, section) {
    if (section !== undefined && req.session[section] !== undefined) {
      return req.session[section][key];
    }
    return req.session[key];
  },
  save(req, key, details, section) {
    if (section !== undefined) {
      if (req.session[section] === undefined) {
        req.session[section] = {};
      }
      req.session[section][key] = details;
    } else {
      req.session[key] = details;
    }
    return true;
  },
  async cacheRetriveAndStore(req, section, key, apiCall) {
    const sectionConverted = section === null ? undefined : section;
    if (this.get(req, key, sectionConverted)) {
      return this.get(req, key, sectionConverted);
    }
    const data = await apiCall();

    this.save(req, key, data, sectionConverted);
    return data;
  },
  checkAndSave(req, section, key, details, editMode) {
    if (req.session[section] !== undefined
      && req.session[section][key] !== undefined
      && JSON.stringify(req.session[section][key]) !== JSON.stringify(details)) {
      if (editMode) {
        req.session.editSectionChanged = true;
        if (req.session.editSectionShowError) {
          delete req.session.editSectionShowError;
        }
      }
    }
    this.save(req, key, details, section);
    return true;
  },
  checkSessionAndSave(req, section, key, details) {
    if (req.session[section] !== undefined && req.session[section][key] !== undefined && JSON.stringify(req.session[section][key]) !== JSON.stringify(details)) {
      deleteSession.bySectionKey(req, section, key);
    }
    this.save(req, key, details, section);
    return true;
  },
};
