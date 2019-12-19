const request = require('request-promise');
const httpStatus = require('http-status-codes');
const requestHelper = require('../../../lib/requestHelper');
const dataStore = require('../../../lib/dataStore');
const deleteSession = require('../../../lib/deleteSession');

const formValidator = require('../../../lib/formValidator');
const findSomeoneFormatter = require('../../../lib/findSomeoneDetailsObject');

const noStausCodeErrorMessage = 'Error - could not get citizen data';
const error500Message = 'Error - There has been an internal sever error, try again';
const backendErrorMessage = 'Can\'t connect to backend';

const citizenAPIEndpoint = 'api/award/';

function bodyOrReturnedStatus(req) {
  if (req.returnedStatus) {
    return req.returnedStatus.nino;
  }
  return req.body.nino;
}

function postFindSomeoneErrorHandle(err, req, res) {
  const details = req.body;
  if (err.statusCode) {
    if (err.statusCode === httpStatus.INTERNAL_SERVER_ERROR) {
      res.render('pages/find-someone/search', { details, globalError: error500Message });
    } else {
      res.render('pages/find-someone/search', { details, globalError: noStausCodeErrorMessage });
    }
  } else {
    res.render('pages/find-someone/search', { details, globalError: backendErrorMessage });
  }
}

function getFindSomeone(req, res) {
  res.render('pages/find-someone/search');
}

async function postFindSomeone(req, res) {
  const details = req.body;
  const errors = formValidator.ninoDetails(req.body);
  if (Object.keys(errors).length === 0) {
    const search = bodyOrReturnedStatus(req);
    try {
      const award = await dataStore.cacheRetriveAndStore(req, null, 'awardDetails', () => {
        const awardCall = requestHelper.generateGetCall(`${res.locals.agentGateway}${citizenAPIEndpoint}${search}`, {}, 'batch');
        return request(awardCall);
      });
      req.session.searchedNino = award.nino;
      res.render('pages/find-someone/search', { details: { result: findSomeoneFormatter.formatter(award) } });
    } catch (err) {
      deleteSession.deleteChangesEnquiries(req);
      if (err.statusCode === httpStatus.NOT_FOUND) {
        details.noResult = true;
        res.render('pages/find-someone/search', { details });
      } else {
        const traceID = requestHelper.getTraceID(err);
        requestHelper.loggingHelper(err, citizenAPIEndpoint + search, traceID, res.locals.logger);
        postFindSomeoneErrorHandle(err, req, res);
      }
    }
  } else {
    res.render('pages/find-someone/search', { details, errors });
  }
}

module.exports.getFindSomeone = getFindSomeone;
module.exports.postFindSomeone = postFindSomeone;
