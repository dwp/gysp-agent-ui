module.exports = {
  get(req, key) {
    return req.session[key];
  },
  save(req, key, details) {
    req.session[key] = details;
    return true;
  },
  async cacheRetriveAndStore(req, key, apiCall) {
    if (this.get(req, key)) {
      return this.get(req, key);
    }
    const data = await apiCall();
    this.save(req, key, data);
    return data;
  },
};
