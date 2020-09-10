const i18n = require('i18next');
const addressHelper = require('../../helpers/addressHelper');
const generalHelper = require('../../helpers/general');


function formatDetails(details) {
  return {
    address: addressHelper.address(details.residentialAddress).join('<br />'),
    homeTelephoneNumber: details.contactDetail.homeTelephoneNumber || '',
    mobileTelephoneNumber: details.contactDetail.mobileTelephoneNumber || '',
    workTelephoneNumber: details.contactDetail.workTelephoneNumber || '',
    email: details.contactDetail.email || '',
  };
}

function addOrChangeText(value) {
  if (generalHelper.isNotUndefinedEmptyOrNull(value)) {
    return i18n.t('contact-details-overview:summary.actions.change');
  }
  return i18n.t('contact-details-overview:summary.actions.add');
}

function contactDetailsOverviewRows(details) {
  return [{
    key: { text: i18n.t('contact-details-overview:summary.keys.address'), classes: 'govuk-!-width-two-thirds' },
    value: { html: details.address },
    actions: {
      items: [{
        href: '/changes-and-enquiries/address',
        text: i18n.t('contact-details-overview:summary.actions.change'),
        visuallyHiddenText: i18n.t('contact-details-overview:summary.keys.address').toLowerCase(),
        classes: 'govuk-link--no-visited-state',
      }],
    },
  }, {
    key: { text: i18n.t('contact-details-overview:summary.keys.home-phone-number'), classes: 'govuk-!-width-two-thirds' },
    value: { text: details.homeTelephoneNumber },
    actions: {
      items: [{
        href: '/changes-and-enquiries/contact/home',
        text: addOrChangeText(details.homeTelephoneNumber),
        visuallyHiddenText: i18n.t('contact-details-overview:summary.keys.home-phone-number').toLowerCase(),
        classes: 'govuk-link--no-visited-state',
      }],
    },
  }, {
    key: { text: i18n.t('contact-details-overview:summary.keys.work-phone-number'), classes: 'govuk-!-width-two-thirds' },
    value: { text: details.workTelephoneNumber },
    actions: {
      items: [{
        href: '/changes-and-enquiries/contact/work',
        text: addOrChangeText(details.workTelephoneNumber),
        visuallyHiddenText: i18n.t('contact-details-overview:summary.keys.work-phone-number').toLowerCase(),
        classes: 'govuk-link--no-visited-state',
      }],
    },
  }, {
    key: { text: i18n.t('contact-details-overview:summary.keys.mobile-phone-number'), classes: 'govuk-!-width-two-thirds' },
    value: { text: details.mobileTelephoneNumber },
    actions: {
      items: [{
        href: '/changes-and-enquiries/contact/mobile',
        text: addOrChangeText(details.mobileTelephoneNumber),
        visuallyHiddenText: i18n.t('contact-details-overview:summary.keys.mobile-phone-number').toLowerCase(),
        classes: 'govuk-link--no-visited-state',
      }],
    },
  }, {
    key: { text: i18n.t('contact-details-overview:summary.keys.email'), classes: 'govuk-!-width-two-thirds' },
    value: { text: details.email },
    actions: {
      items: [{
        href: '/changes-and-enquiries/contact/email',
        text: addOrChangeText(details.email),
        visuallyHiddenText: i18n.t('contact-details-overview:summary.keys.email').toLowerCase(),
        classes: 'govuk-link--no-visited-state',
      }],
    },
  }];
}

module.exports = {
  formatter(details) {
    const formattedDetails = formatDetails(details);
    return {
      contactDetailsSummaryRows: contactDetailsOverviewRows(formattedDetails),
    };
  },
};
