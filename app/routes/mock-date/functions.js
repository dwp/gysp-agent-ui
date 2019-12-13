const mockdate = require('mockdate');
const moment = require('moment');

function getMockSetDate(req, res) {
  const { datetime } = req.params;
  if (moment(datetime, ['YYYY-MM-DD']).isValid()) {
    mockdate.set(moment(datetime));
    res.redirect('/');
  } else {
    res.locals.logger.error({ traceID: 'none' }, 'MockSetDate - Datetime format invalid');
    res.render('pages/error', { status: '- Datetime format invalid, please use YYYY-MM-DDTHH:MM:SS (2020-02-06T10:10:00)' });
  }
}

function getMockResetDate(req, res) {
  mockdate.reset();
  res.redirect('/');
}

module.exports.getMockSetDate = getMockSetDate;
module.exports.getMockResetDate = getMockResetDate;
