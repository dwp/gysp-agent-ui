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
  deleteReviewAward(req, section) {
    if (section === 'all') {
      if (req.session['review-award'] !== undefined) {
        delete req.session['review-award'];
      }
      if (req.session.award !== undefined) {
        delete req.session.award;
      }
      if (req.session.awardReviewUserHasCompleted !== undefined) {
        delete req.session.awardReviewUserHasCompleted;
      }
    }
    if (section === 'review-award') {
      if (req.session['review-award'] !== undefined) {
        delete req.session['review-award'];
      }
    }
  },
  deleteChangesEnquiries(req) {
    if (req.session.awardDetails !== undefined) {
      delete req.session.awardDetails;
    }
    if (req.session['payment-history'] !== undefined) {
      delete req.session['payment-history'];
    }
  },
  deletePaymentDetail(req, id) {
    if (req.session['payment-history'] !== undefined && req.session['payment-history'][id] !== undefined) {
      delete req.session['payment-history'][id];
      return true;
    }
    return false;
  },
  deleteDeathDetail(req) {
    if (req.session.death !== undefined) {
      delete req.session.death;
      return true;
    }
    return false;
  },
};
