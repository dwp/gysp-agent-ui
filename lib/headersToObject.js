
function cookieStringToObject(value) {
  const object = {};
  const items = value.split(';');
  items.forEach((entry) => {
    const [valueKey0, valueKey1] = entry.split('=');
    object[valueKey0] = valueKey1;
  });
  return object;
}

module.exports = {
  formatAgentObject(cookieValue) {
    return cookieStringToObject(cookieValue);
  },
};
