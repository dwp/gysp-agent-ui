const userAgent = 'Mozilla/5.0 (X11; Linux x86_64; rv:12.0) Gecko/20100101 Firefox/12.0';

module.exports = {
  appUrl() {
    if (process.env.WEB_APP) {
      return `http://${process.env.WEB_APP}:3002`;
    }
    return (process.env.APPURL || 'http://localhost:3002');
  },
  getUserAgent() {
    return userAgent;
  },
};
