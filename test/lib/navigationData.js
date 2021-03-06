module.exports = {
  validNavigation() {
    return [
      { text: 'Personal', href: '/changes-and-enquiries/personal' },
      { text: 'Contact', href: '/changes-and-enquiries/contact' },
      { text: 'Award', href: '/changes-and-enquiries/award' },
      { text: 'Payment', href: '/changes-and-enquiries/payment' }];
  },
  validNavigationPersonalSelected() {
    return [
      { text: 'Personal', href: '/changes-and-enquiries/personal', selected: true },
      { text: 'Contact', href: '/changes-and-enquiries/contact' },
      { text: 'Award', href: '/changes-and-enquiries/award' },
      { text: 'Payment', href: '/changes-and-enquiries/payment' }];
  },
  validNavigationContactSelected() {
    return [
      { text: 'Personal', href: '/changes-and-enquiries/personal' },
      { text: 'Contact', href: '/changes-and-enquiries/contact', selected: true },
      { text: 'Award', href: '/changes-and-enquiries/award' },
      { text: 'Payment', href: '/changes-and-enquiries/payment' }];
  },
  validNavigationAwardSelected() {
    return [
      { text: 'Personal', href: '/changes-and-enquiries/personal' },
      { text: 'Contact', href: '/changes-and-enquiries/contact' },
      { text: 'Award', href: '/changes-and-enquiries/award', selected: true },
      { text: 'Payment', href: '/changes-and-enquiries/payment' }];
  },
  validNavigationPaymentSelected() {
    return [
      { text: 'Personal', href: '/changes-and-enquiries/personal' },
      { text: 'Contact', href: '/changes-and-enquiries/contact' },
      { text: 'Award', href: '/changes-and-enquiries/award' },
      { text: 'Payment', href: '/changes-and-enquiries/payment', selected: true }];
  },
};
