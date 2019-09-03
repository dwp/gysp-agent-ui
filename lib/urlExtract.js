module.exports = {
  extract(url) {
    let domain;
    if (url !== undefined) {
      const [segment1, segment2] = url.split('/').filter((segment) => segment !== '');
      if (url.indexOf('://') > -1) {
        domain = segment2;
      } else {
        domain = segment1;
      }

      const [domainPart1] = domain.split(':');
      domain = domainPart1;
    }
    return domain;
  },
};
