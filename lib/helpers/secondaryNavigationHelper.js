const i18n = require('i18next');

const baseRoute = '/changes-and-enquiries';

module.exports = {
  navigationItems(selected) {
    const items = [{
      text: i18n.t('changes-and-enquiries:secondary-nav.personal.text'),
      href: `${baseRoute}/personal`,
      visuallyHiddenTextStart: i18n.t('changes-and-enquiries:secondary-nav.personal.visuallyHiddenTextStart'),
      visuallyHiddenTextEnd: i18n.t('changes-and-enquiries:secondary-nav.personal.visuallyHiddenTextEnd'),
    }, {
      text: i18n.t('changes-and-enquiries:secondary-nav.contact.text'),
      href: `${baseRoute}/contact`,
      visuallyHiddenTextStart: i18n.t('changes-and-enquiries:secondary-nav.contact.visuallyHiddenTextStart'),
      visuallyHiddenTextEnd: i18n.t('changes-and-enquiries:secondary-nav.contact.visuallyHiddenTextEnd'),
    }, {
      text: i18n.t('changes-and-enquiries:secondary-nav.award.text'),
      href: `${baseRoute}/award`,
      visuallyHiddenTextStart: i18n.t('changes-and-enquiries:secondary-nav.award.visuallyHiddenTextStart'),
      visuallyHiddenTextEnd: i18n.t('changes-and-enquiries:secondary-nav.award.visuallyHiddenTextEnd'),
    }, {
      text: i18n.t('changes-and-enquiries:secondary-nav.payment.text'),
      href: `${baseRoute}/payment`,
      visuallyHiddenTextStart: i18n.t('changes-and-enquiries:secondary-nav.payment.visuallyHiddenTextStart'),
      visuallyHiddenTextEnd: i18n.t('changes-and-enquiries:secondary-nav.payment.visuallyHiddenTextEnd'),
    }];

    if (selected !== undefined) {
      if (selected === 'personal') {
        items[0].selected = true;
      } else if (selected === 'contact') {
        items[1].selected = true;
      } else if (selected === 'award') {
        items[2].selected = true;
      } else if (selected === 'payment') {
        items[3].selected = true;
      }
    }

    return items;
  },
};
