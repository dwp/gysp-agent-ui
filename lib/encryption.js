const CryptoJS = require('crypto-js');

module.exports = {
  encrypt(text, secret) {
    const ciphertext = CryptoJS.AES.encrypt(text, secret);
    return ciphertext.toString();
  },
  decrypt(text, secret) {
    const bytes = CryptoJS.AES.decrypt(text.toString(), secret);
    return bytes.toString(CryptoJS.enc.Utf8);
  },
};
