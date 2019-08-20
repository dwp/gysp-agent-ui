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
  deleteReviewAward(req) {
    if (req.session['review-award'] !== undefined) {
      delete req.session['review-award'];
    }
    if (req.session.award !== undefined) {
      delete req.session.award;
    }
  },
};
