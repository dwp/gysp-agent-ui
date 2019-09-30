module.exports = {
  navigationItems(selected) {
    const items = [
      { text: 'Personal', href: '/changes-and-enquiries/personal' },
      { text: 'Contact', href: '/changes-and-enquiries/contact' },
      { text: 'Award', href: '/changes-and-enquiries/award' },
      { text: 'Payment', href: '/changes-and-enquiries/payment' },
    ];

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
