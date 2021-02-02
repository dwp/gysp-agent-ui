const moment = require('moment');

const dateComponentsToUtcDate = (year, month, day) => moment(`${year}-${month}-${day}`).utc().toISOString();
const dateDash = (date) => moment(date, 'YYYY-MM-DD').format('YYYY-MM-DD');
const dateDashToLongDate = (date) => moment(date, 'YYYY-MM-DD').format('D MMMM YYYY');
const longDate = (date) => moment(date).format('D MMMM YYYY');
const longDateWithAbbMonth = (date) => moment(date).format('D MMM YYYY');
const longDateWithWeekday = (date) => moment(date).format('dddd D MMM YYYY');
const slashDate = (date) => moment(date).format('DD/MM/YYYY');
const timestampToDateDash = (date) => moment(date).format('YYYY-MM-DD');

module.exports = {
  dateComponents(date, format = 'YYYY-MM-DD') {
    const suppliedDate = format ? moment(date, format) : moment(date);
    return { dateYear: suppliedDate.format('YYYY'), dateMonth: suppliedDate.format('MM'), dateDay: suppliedDate.format('DD') };
  },
  dateComponentsToUtcDate,
  dateDash,
  dateDashToLongDate,
  daysBetweenNowDate(date) {
    const currentDate = moment();
    const suppliedDate = moment(date);
    return currentDate.diff(suppliedDate, 'days');
  },
  epochDateToComponents(epochDate) {
    const date = moment(epochDate);
    return {
      day: date.format('D'),
      month: date.format('M'),
      year: date.format('YYYY'),
    };
  },
  formatEntitlementDate(entitlementDate, reviewAwardDate) {
    if (reviewAwardDate !== undefined) {
      return dateDashToLongDate(`${reviewAwardDate.dateYear}-${reviewAwardDate.dateMonth}-${reviewAwardDate.dateDay}`);
    }
    return longDate(entitlementDate);
  },
  longDate,
  longDateWithAbbMonth,
  longDateWithWeekday,
  slashDate,
  timestampToDateDash,
};
