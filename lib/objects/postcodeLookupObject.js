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
    let convertedUprn;
    if (addressDetail !== undefined) {
      convertedUprn = parseInt(addressDetail.address, 10);
    }

    const { addressResults } = list;
    const addressList = addressResults.map((item) => {
      const object = {
        value: item.uprn,
        text: item.address,
      };
      if (convertedUprn !== undefined && item.uprn === convertedUprn) {
        object.selected = true;
      }
      return object;
    });
    const total = addressList.length;
    addressList.unshift(addressCountItem(total));
    return addressList;
  },
};
