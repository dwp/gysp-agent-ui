const moment = require('moment');

module.exports = {
  longDate(date) {
    return moment(date).format('D MMMM YYYY');
  },
  slashDate(date) {
    return moment(date).format('DD/MM/YYYY');
  },
};
