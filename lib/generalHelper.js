module.exports = {
  isNotUndefinedEmtpyOrNull(...inputs) {
    let result = true;
    inputs.forEach((input) => {
      if (input === undefined) {
        result = false;
      } else if (input === '') {
        result = false;
      } else if (input === null) {
        result = false;
      }
    });
    return result;
  },
};
