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
  deleteStopStatePensionDetails(req) {
    if (req.session['stop-state-pension'] !== undefined) {
      delete req.session['stop-state-pension'];
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
  deleteDeathPayment(req) {
    if (req.session['death-payment-details'] !== undefined) {
      delete req.session['death-payment-details'];
    }
  },
  deleteAllDeathSession(req) {
    this.deleteStopStatePensionDetails(req);
    this.deleteDeathDetail(req);
    this.deleteDeathPayeeArrears(req);
    this.deleteDeathAddress(req);
    this.deleteDeathPayment(req);
  },
  deleteTasksSession(req) {
    ['tasks', 'updated-entitlement-details', 'marital', 'awardDetails'].forEach((key) => {
      this.deleteSessionBySection(req, key);
    });
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
  bySectionKey(req, section, key) {
    if (section === 'marital' && key === 'check-for-inheritable-state-pension') {
      this.deleteSessionByArraysKey(req, 'marital', [
        'entitled-to-inherited-state-pension',
        'relevant-inherited-amounts',
        'update-state-pension-award-new-state-pension',
        'update-state-pension-award-protected-payment',
        'update-state-pension-award-inherited-extra-state-pension',
      ]);
    }
    if (section === 'marital' && key === 'check-for-inheritable-state-pension') {
      this.deleteSessionByArraysKey(req, 'marital', [
        'relevant-inherited-amounts',
        'update-state-pension-award-new-state-pension',
        'update-state-pension-award-protected-payment',
        'update-state-pension-award-inherited-extra-state-pension',
      ]);
    }
    return true;
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
