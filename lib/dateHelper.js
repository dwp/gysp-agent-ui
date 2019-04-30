const moment = require('moment');

module.exports = {
  longDate(date) {
    return moment(date).format('D MMMM YYYY');
  },
};
