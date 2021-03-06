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
  addressList(list, addressDetail) {
    const addressResults = list.data;
    const addressList = addressResults.map((item) => {
      const object = {
        value: item.uprn,
        text: item.singleLine,
      };
      if (addressDetail !== undefined && item.uprn === addressDetail.address) {
        object.selected = true;
      }
      return object;
    });
    const total = addressList.length;
    addressList.unshift(addressCountItem(total));
    return addressList;
  },
};
