module.exports = {
  promiseWait(milliseconds = 100) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, milliseconds);
    });
  },
  cloneObject(object) {
    return JSON.parse(JSON.stringify(object));
  },
};
