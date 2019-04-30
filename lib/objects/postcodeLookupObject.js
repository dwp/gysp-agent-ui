function addressCountItem(total) {
  if (total > 1) {
    return { text: `${total} addresses found` };
  }
  return { text: `${total} address found` };
}

module.exports = {
  formatter(details) {
    return {
      postcode: details.postcode.replace(/\s/g, ''),
    };
  },
  addressList(list) {
    const { addressResults } = list;
    const addressList = addressResults.map(item => ({
      value: item.uprn,
      text: item.address,
    }));
    const total = addressList.length;
    addressList.unshift(addressCountItem(total));
    return addressList;
  },
};
