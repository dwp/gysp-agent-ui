module.exports = {
  getLastSegment(uri) {
    if (uri) {
      const segments = uri.split('/');
      const segment = segments.pop();
      return segment;
    }
    return null;
  },
};
