const request = require('request-promise');
const httpStatus = require('http-status-codes');
const requestHelper = require('../../../lib/requestHelper');

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
  if (req.session && req.session.searchedNino) {
    delete req.session.searchedNino;
  }
  res.render('pages/find-someone/search');
}

function postFindSomeone(req, res) {
  const details = req.body;
  const errors = formValidator.ninoDetails(req.body);
  if (Object.keys(errors).length === 0) {
    const search = bodyOrReturnedStatus(req);
    const getSearch = requestHelper.generateGetCallWithFullResponse(res.locals.agentGateway + citizenAPIEndpoint + search, {}, 'batch');
    request(getSearch).then((citizenDetails) => {
      if (citizenDetails.statusCode === httpStatus.NOT_FOUND || citizenDetails.statusCode === httpStatus.NOT_ACCEPTABLE) {
        details.noResult = true;
        res.render('pages/find-someone/search', { details });
      } else if (citizenDetails.statusCode === httpStatus.OK) {
        req.session.searchedNino = citizenDetails.body.nino;
        res.render('pages/find-someone/search', { details: { result: findSomeoneFormatter.formatter(citizenDetails.body) } });
      } else {
        throw citizenDetails;
      }
    }).catch((err) => {
      const traceID = requestHelper.getTraceID(err);
      requestHelper.loggingHelper(err, citizenAPIEndpoint + search, traceID, res.locals.logger);
      postFindSomeoneErrorHandle(err, req, res);
    });
  } else {
    res.render('pages/find-someone/search', { details, errors });
  }
}

module.exports.getFindSomeone = getFindSomeone;
module.exports.postFindSomeone = postFindSomeone;
