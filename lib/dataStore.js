module.exports = {
  get(req, key) {
    return req.session[key];
  },
  save(req, key, details) {
    req.session[key] = details;
    return true;
  },
};
