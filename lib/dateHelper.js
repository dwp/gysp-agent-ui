const moment = require('moment');

module.exports = {
  longDate(date) {
    return moment(date).format('D MMMM YYYY');
  },
  slashDate(date) {
    return moment(date).format('DD/MM/YYYY');
  },
  daysBetweenNowDate(date) {
    const currentDate = moment();
    const suppliedDate = moment(date);
    return currentDate.diff(suppliedDate, 'days');
  },
};
