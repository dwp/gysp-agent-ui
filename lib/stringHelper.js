module.exports = {
  uppercaseFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  },
  formatNino(nino) {
    return nino.replace(/(.{2})/g, '$1 ');
  },
};
