const i18n = require('i18next');
const moment = require('moment');

const generalHelper = require('../helpers/general');

const yearLength = 4;

const isToDateBeforeFromDate = (td, tm, ty, fd, fm, fy) => moment(`${ty}-${generalHelper.formatDate(tm)}-${generalHelper.formatDate(td)}`)
  .isBefore(`${fy}-${generalHelper.formatDate(fm)}-${generalHelper.formatDate(fd)}`);

module.exports = {
  details(form) {
    const errors = {};

    const fromRequiredError = () => {
      errors.fromDate = {
        text: i18n.t('manual-payment-details:fields.payment_period.errors.fromRequired'),
      };
      errors.fromDay = true;
      errors.fromMonth = true;
      errors.fromYear = true;
    };

    const toRequiredError = () => {
      errors.toDate = {
        text: i18n.t('manual-payment-details:fields.payment_period.errors.toRequired'),
      };
      errors.toDay = true;
      errors.toMonth = true;
      errors.toYear = true;
    };

    const paymentRequiredError = () => {
      errors.paymentDate = {
        text: i18n.t('manual-payment-details:fields.payment_date.errors.required'),
      };
      errors.paymentDay = true;
      errors.paymentMonth = true;
      errors.paymentYear = true;
    };

    if (form === undefined) {
      fromRequiredError();
      toRequiredError();
      paymentRequiredError();
    } else {
      const {
        fromDay, fromMonth, fromYear,
        toDay, toMonth, toYear,
        paymentDay, paymentMonth, paymentYear,
      } = form;

      const fromDayIsUndefinedOrEmpty = generalHelper.isThisUndefinedOrEmpty(fromDay);
      const fromMonthIsUndefinedOrEmpty = generalHelper.isThisUndefinedOrEmpty(fromMonth);
      const fromYearIsUndefinedOrEmpty = generalHelper.isThisUndefinedOrEmpty(fromYear);
      const toDayIsUndefinedOrEmpty = generalHelper.isThisUndefinedOrEmpty(toDay);
      const toMonthIsUndefinedOrEmpty = generalHelper.isThisUndefinedOrEmpty(toMonth);
      const toYearIsUndefinedOrEmpty = generalHelper.isThisUndefinedOrEmpty(toYear);
      const paymentDayIsUndefinedOrEmpty = generalHelper.isThisUndefinedOrEmpty(paymentDay);
      const paymentMonthIsUndefinedOrEmpty = generalHelper.isThisUndefinedOrEmpty(paymentMonth);
      const paymentYearIsUndefinedOrEmpty = generalHelper.isThisUndefinedOrEmpty(paymentYear);

      if (fromDayIsUndefinedOrEmpty && fromMonthIsUndefinedOrEmpty && fromYearIsUndefinedOrEmpty) {
        fromRequiredError();
      } else if (!generalHelper.isDateValid(fromDay, fromMonth, fromYear)) {
        errors.fromDate = {
          text: i18n.t('manual-payment-details:fields.payment_period.errors.invalid'),
        };

        if (fromDay < 1 || (fromDay > generalHelper.daysInMonth(fromMonth, fromYear))) {
          errors.fromDay = true;
        }
        if (fromMonth < 1 || fromMonth > 12) {
          errors.fromMonth = true;
        }
        if (fromYear.toString().length !== yearLength) {
          errors.fromYear = true;
        }
      }

      if (toDayIsUndefinedOrEmpty && toMonthIsUndefinedOrEmpty && toYearIsUndefinedOrEmpty) {
        toRequiredError();
      } else if (!generalHelper.isDateValid(toDay, toMonth, toYear)) {
        errors.toDate = {
          text: i18n.t('manual-payment-details:fields.payment_period.errors.invalid'),
        };

        if (toDay < 1 || (toDay > generalHelper.daysInMonth(toMonth, toYear))) {
          errors.toDay = true;
        }
        if (toMonth < 1 || toMonth > 12) {
          errors.toMonth = true;
        }
        if (toYear.toString().length !== yearLength) {
          errors.toYear = true;
        }
      }

      if (Object.keys(errors).length === 0) {
        if (isToDateBeforeFromDate(toDay, toMonth, toYear, fromDay, fromMonth, fromYear)) {
          errors.toDate = {
            text: i18n.t('manual-payment-details:fields.payment_period.errors.sequence'),
          };
          errors.toDay = true;
          errors.toMonth = true;
          errors.toYear = true;
        }
      }

      if (paymentDayIsUndefinedOrEmpty && paymentMonthIsUndefinedOrEmpty && paymentYearIsUndefinedOrEmpty) {
        paymentRequiredError();
      } else if (!generalHelper.isDateValid(paymentDay, paymentMonth, paymentYear)) {
        errors.paymentDate = {
          text: i18n.t('manual-payment-details:fields.payment_date.errors.invalid'),
        };

        if (paymentDay < 1 || (paymentDay > generalHelper.daysInMonth(paymentMonth, paymentYear))) {
          errors.paymentDay = true;
        }
        if (paymentMonth < 1 || paymentMonth > 12) {
          errors.paymentMonth = true;
        }
        if (paymentYear.toString().length !== yearLength) {
          errors.paymentYear = true;
        }
      }
    }

    return errors;
  },
};
