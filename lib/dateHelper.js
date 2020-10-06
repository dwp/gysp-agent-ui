const moment = require('moment');

module.exports = {
  longDate(date) {
    return moment(date).format('D MMMM YYYY');
  },
  longDateWithWeekday(date) {
    return moment(date).format('dddd D MMMM YYYY');
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
  dateComponents(date, format = 'YYYY-MM-DD') {
    const suppliedDate = format ? moment(date, format) : moment(date);
    return { dateYear: suppliedDate.format('YYYY'), dateMonth: suppliedDate.format('MM'), dateDay: suppliedDate.format('DD') };
  },
  dateComponentsToUtcDate(year, month, day) {
    return moment(`${year}-${month}-${day}`).utc().toISOString();
  },
  dateDashToLongDate(date) {
    return moment(date, 'YYYY-MM-DD').format('D MMMM YYYY');
  },
};
