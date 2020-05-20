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
      if (req.session['review-award-date'] !== undefined) {
        delete req.session['review-award-date'];
      }
    }
    if (section === 'review-award') {
      if (req.session['review-award'] !== undefined) {
        delete req.session['review-award'];
      }
      if (req.session['review-award-date'] !== undefined) {
        delete req.session['review-award-date'];
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
  deleteDeathPayeeArrears(req) {
    this.deleteDeathDetail(req);
    if (req.session['death-payee-details'] !== undefined) {
      delete req.session['death-payee-details'];
    }
    if (req.session['death-payee-details-updated'] !== undefined) {
      delete req.session['death-payee-details-updated'];
    }
  },
  deleteDeathAddress(req) {
    if (req.session.death !== undefined) {
      if (req.session.death['dap-address'] !== undefined) {
        delete req.session.death['dap-address'];
      }
      if (req.session.death['address-lookup'] !== undefined) {
        delete req.session.death['address-lookup'];
      }
    }
    return false;
  },
  deleteEditSection(req) {
    if (req.session.editSection !== undefined) {
      delete req.session.editSection;
    }
    if (req.session.editSectionChanged !== undefined) {
      delete req.session.editSectionChanged;
    }
    if (req.session.editSectionShowError !== undefined) {
      delete req.session.editSectionShowError;
    }
  },
  deleteSessionBySection(req, section) {
    if (req.session[section] !== undefined) {
      delete req.session[section];
    }
  },
  deleteSessionBySectionKey(req, section, key) {
    if (req.session[section] !== undefined && req.session[section][key] !== undefined) {
      delete req.session[section][key];
    }
  },
  deleteSessionByArraysKey(req, section, keys) {
    if (Array.isArray(keys)) {
      keys.forEach((key) => {
        if (req.session[section][key] !== undefined) {
          delete req.session[section][key];
        }
      });
    }
  },
};
