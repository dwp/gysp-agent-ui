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
    if (this.get(req, key, section)) {
      return this.get(req, key, section);
    }
    const data = await apiCall();
    this.save(req, key, data, section);
    return data;
  },
};
