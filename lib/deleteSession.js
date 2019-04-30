module.exports = {
  deleteProcessClaim(req) {
    if (req.session.processClaim !== undefined) {
      delete req.session.processClaim;
    }
  },
  deleteChangeAddress(req) {
    if (req.session.addressLookup !== undefined) {
      delete req.session.addressLookup;
    }
    if (req.session.postcode !== undefined) {
      delete req.session.postcode;
    }
  },
};
