const i18n = require('i18next');
const dateHelper = require('../../dateHelper');
const generalHelper = require('../../helpers/general');

function head() {
  return [
    { text: i18n.t('award-list:table.head.from'), classes: 'govuk-!-width-one-quarter' },
    { text: i18n.t('award-list:table.head.to'), classes: 'govuk-!-width-one-quarter' },
    { text: i18n.t('award-list:table.head.weekly-amount') },
    { text: '' },
    { text: '' },
  ];
}

function banner(awardAmounts) {
  if (awardAmounts.reasonCode === 'ANNUALUPRATING' && awardAmounts.inPayment !== true) {
    return {
      text: i18n.t('award-list:banner.text', { date: dateHelper.longDate(awardAmounts.fromDate) }),
      link: i18n.t('award-list:banner.link'),
    };
  }
  return null;
}

function rows(details) {
  let skipFirst = 0;
  return details.filter((item, index) => {
    if (item.reasonCode === 'ANNUALUPRATING' && index === 0 && item.inPayment !== true) {
      skipFirst = 1;
      return false;
    }
    return true;
  }).map((item, index) => {
    const id = index + skipFirst;
    const array = [
      { text: dateHelper.longDate(item.fromDate) },
      { text: generalHelper.isNotUndefinedEmptyOrNull(item.toDate) ? dateHelper.longDate(item.toDate) : '' },
      { text: generalHelper.formatCurrency(item.totalAmount) },
      { html: `<a href="/changes-and-enquiries/award/${id}" class="govuk-link">Details</a>` },
    ];
    if (item.inPayment) {
      array.push({ html: '<span class="govuk-!-font-size-16 govuk-!-font-weight-bold gysp-secondary-text-colour gysp-payment gysp-payment--active">In Payment</span>' });
    } else {
      array.push({ text: '' });
    }
    return array;
  });
}

module.exports = {
  formatter(details) {
    return {
      banner: banner(details.awardAmounts[0]),
      table: {
        firstCellIsHeader: false,
        head: head(),
        rows: rows(details.awardAmounts),
      },
    };
  },
};
