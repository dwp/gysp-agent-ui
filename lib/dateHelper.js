const moment = require('moment');

module.exports = {
  longDate(date) {
    return moment(date).format('D MMMM YYYY');
  },
  slashDate(date) {
    return moment(date).format('DD/MM/YYYY');
  },
  dateDash(date) {
    return moment(date, 'YYYY-MM-DD').format('YYYY-MM-DD');
  },
  timestampToDateDash(date) {
    return moment(date).format('YYYY-MM-DD');
  },
  daysBetweenNowDate(date) {
    const currentDate = moment();
    const suppliedDate = moment(date);
    return currentDate.diff(suppliedDate, 'days');
  },
  dateComponents(date) {
    const suppliedDate = moment(date, 'YYYY-MM-DD');
    return { dateYear: suppliedDate.format('YYYY'), dateMonth: suppliedDate.format('MM'), dateDay: suppliedDate.format('DD') };
  },
};
