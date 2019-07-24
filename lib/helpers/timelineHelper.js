const request = require('request-promise');
const httpStatus = require('http-status-codes');

const requestHelper = require('../requestHelper');
const dateHelper = require('../dateHelper');

function catergoryDetail(category) {
  if (category === 'CONTACT') {
    return {
      header: 'contact-details:timeline.header',
      empty: 'contact-details:timeline.empty',
    };
  }
  if (category === 'PAYMENT') {
    return {
      header: 'payment:timeline.header',
      empty: 'payment:timeline.empty',
    };
  }
  if (category === 'PERSONAL') {
    return {
      header: 'personal:timeline.header',
      empty: 'personal:timeline.empty',
    };
  }
  return null;
}

function formatList(details) {
  if (details) {
    return details.map(item => ({
      date: dateHelper.longDate(item.eventDate),
      title: item.eventName,
    }));
  }
  return null;
}

module.exports = {
  formatter(details, category) {
    const list = formatList(details);
    const categoryData = catergoryDetail(category);

    const json = { list };
    if (categoryData) {
      return Object.assign(json, categoryData);
    }
    return json;
  },
  async getTimeline(req, res, category, limit = 6) {
    const { inviteKey } = req.session.awardDetails;
    const serviceCall = requestHelper.generateGetCall(
      `${res.locals.agentGateway}api/audit/${inviteKey}/category/${category}?page=0&limit=${limit}`,
      {},
      'audit',
    );
    try {
      const response = await request(serviceCall);
      return this.formatter(response, category);
    } catch (err) {
      if (err.statusCode === httpStatus.NOT_FOUND) {
        return this.formatter(null, category);
      }
      const traceID = requestHelper.getTraceID(err);
      requestHelper.loggingHelper(err, `cannot get ${category} timeline`, traceID, res.locals.logger);
      return this.formatter(null, category);
    }
  },
};
