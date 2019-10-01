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
};
