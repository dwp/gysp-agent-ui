const request = require('request-promise');
const httpStatus = require('http-status-codes');

const requestHelper = require('../requestHelper');
const dateHelper = require('../dateHelper');

const eventNames = {
  RETURNED: 'Returned',
  SENT: 'Sent',
  RECALLING: 'Recalling',
  RECALLED: 'Recalled',
  PAID: 'Paid',
  REISSUING: 'Reissuing',
  REISSUED: 'Reissued',
};

function catergoryDetail(category, error) {
  let detail = null;
  if (category === 'CONTACT') {
    detail = {
      header: 'contact-details:timeline.header',
      empty: 'contact-details:timeline.empty',
    };
  }
  if (category === 'PAYMENT') {
    detail = {
      header: 'payment:timeline.header',
      empty: 'payment:timeline.empty',
    };
  }
  if (category === 'PERSONAL') {
    detail = {
      header: 'personal:timeline.header',
      empty: 'personal:timeline.empty',
    };
  }
  if (category === 'PAYMENTDETAIL') {
    detail = {
      header: 'payment-status:timeline.header',
      empty: 'payment-status:timeline.empty',
    };
  }

  if (detail && error) {
    return {
      header: detail.header,
      unavailable: 'timeline.unavailable',
    };
  }

  return detail;
}

function formatEventName(name) {
  const eventName = eventNames[name];
  if (eventName !== undefined) {
    return eventName;
  }
  return name;
}

function formatList(details) {
  if (details && Object.keys(details).length !== 0) {
    return details.map((item) => ({
      date: dateHelper.longDate(item.eventDate),
      title: formatEventName(item.eventName),
    }));
  }
  return null;
}

function timelineServiceCall(res, inviteKey, category, subId, limit) {
  if (subId) {
    return requestHelper.generateGetCall(`${res.locals.agentGateway}api/event/search?subId=${subId}&category=${category}&page=0&limit=${limit}`, {}, 'event');
  }
  return requestHelper.generateGetCall(`${res.locals.agentGateway}api/event?itemId=${inviteKey}&category=${category}&page=0&limit=${limit}`, {}, 'event');
}

module.exports = {
  formatter(details, category, error) {
    const list = formatList(details);
    const categoryData = catergoryDetail(category, error);
    const json = { list };
    if (categoryData) {
      return Object.assign(json, categoryData);
    }
    return json;
  },
  async getTimeline(req, res, category, subId = null, limit = 6) {
    const { inviteKey } = req.session.awardDetails;
    const serviceCall = timelineServiceCall(res, inviteKey, category, subId, limit);
    try {
      const response = await request(serviceCall);
      return this.formatter(response, category);
    } catch (err) {
      if (err.statusCode === httpStatus.NOT_FOUND) {
        return this.formatter(null, category);
      }
      const traceID = requestHelper.getTraceID(err);
      requestHelper.loggingHelper(err, `cannot get ${category} timeline`, traceID, res.locals.logger);
      return this.formatter(null, category, true);
    }
  },
};
