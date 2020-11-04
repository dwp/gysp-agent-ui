const request = require('request-promise');
const dataStore = require('../dataStore');

// Helpers
const requestHelper = require('../requestHelper');
const requestFilterHelper = require('./requestFilterHelper');
const dateHelper = require('../dateHelper');

// View objects
const taskMaritalDetailObject = require('../objects/view/taskMaritalDetailObject');
const taskObject = require('../objects/view/taskObject');

// Api objects
const maritalDetailsEntitlementApiObject = require('../objects/api/maritalDetailsEntitlementObject');
const maritalWidowDetailsApiObject = require('../objects/api/maritalWidowDetailsObject');

// Api endpoints
const getAwardByInviteKeyEndPoint = 'api/award/award-by-invite-key';
const putMaritalDetailsEndPoint = 'api/award/update-marital-details';
const putWorkItemUpdateStatusCompleteEndPoint = 'api/workitem/update-status-complete';
const putMaritalWidowDetailsApiUri = 'api/award/update-widow-details';

const isMaritalTask = (workItemReason) => workItemReason === 'MARRIED' || workItemReason === 'CIVILPARTNERSHIP' || workItemReason === 'WIDOWED';
const isMarriedOrCivilTask = (workItemReason) => workItemReason === 'MARRIED' || workItemReason === 'CIVILPARTNERSHIP';
const isWidowedTask = (workItemReason) => workItemReason === 'WIDOWED';
const throwInvalidWorkReasonError = (workItemReason) => {
  throw new Error(`Invalid workItemReason, got ${workItemReason}`);
};

async function awardAndReasonDetails(req, res) {
  const { inviteKey, workItemReason } = dataStore.get(req, 'work-item', 'tasks');
  const award = await dataStore.cacheRetrieveAndStore(req, null, 'awardDetails', () => {
    const awardCall = requestHelper.generateGetCall(`${res.locals.agentGateway}${getAwardByInviteKeyEndPoint}/${inviteKey}`, {}, 'award');
    return request(awardCall);
  });
  return { award, workItemReason };
}

async function updateAwardMaritalDetails(req, res, updatedEntitlementDetails) {
  const { award } = await awardAndReasonDetails(req, res);
  const maritalDetails = maritalDetailsEntitlementApiObject.formatter(updatedEntitlementDetails, award);
  const updateMaritalDetailsCall = requestHelper.generatePutCall(res.locals.agentGateway + putMaritalDetailsEndPoint, maritalDetails, 'award', req.user);
  return request(updateMaritalDetailsCall);
}

async function updateWorkItem(req, res) {
  const workItem = dataStore.get(req, 'work-item', 'tasks');
  const filteredRequest = requestFilterHelper.requestFilter(requestFilterHelper.workItem(), workItem);
  const updateWorkItemCall = requestHelper.generatePutCall(res.locals.agentGateway + putWorkItemUpdateStatusCompleteEndPoint, filteredRequest, 'work-items', req.user);
  return request(updateWorkItemCall);
}

function saveWidowDetails(req, res, award, maritalFormDetails) {
  const maritalDetails = maritalWidowDetailsApiObject.formatter(maritalFormDetails, award, true);
  const putMaritalDetailsCall = requestHelper.generatePutCall(res.locals.agentGateway + putMaritalWidowDetailsApiUri, maritalDetails, 'award', req.user);
  return request(putMaritalDetailsCall);
}

module.exports = {
  taskDetail(req, workItemReason, award) {
    if (isMaritalTask(workItemReason)) {
      if (isWidowedTask(workItemReason)) {
        const { year, month, day } = dateHelper.epochDateToComponents(award.partnerDetail.widowedDate);
        dataStore.save(req, 'date', { dateYear: year, dateMonth: month, dateDay: day }, 'marital');
      }
      const updatedEntitlementDetails = dataStore.get(req, 'updated-entitlement-details');
      const details = taskMaritalDetailObject.formatter(award, workItemReason, updatedEntitlementDetails);
      return {
        view: 'entitlement/detail',
        data: { details },
      };
    }
    return throwInvalidWorkReasonError(workItemReason);
  },
  taskComplete(req) {
    const { workItemReason } = dataStore.get(req, 'work-item', 'tasks');
    let details = taskObject.complete(workItemReason);
    let backHref = '/task/detail';
    if (isWidowedTask(workItemReason)) {
      const { entitledInheritableStatePension } = dataStore.get(req, 'entitled-to-inherited-state-pension', 'marital');
      details = taskObject.complete(workItemReason, entitledInheritableStatePension);
      backHref = '/task/consider-entitlement/entitled-to-any-inherited-state-pension';
      if (entitledInheritableStatePension === 'yes') {
        backHref = '/task/consider-entitlement/update-state-pension-award';
      }
    }
    return {
      backHref,
      details,
    };
  },
  async taskEnd(req, res, workItemReason) {
    if (isMarriedOrCivilTask(workItemReason)) {
      const updatedEntitlementDetails = dataStore.get(req, 'updated-entitlement-details');
      if (updatedEntitlementDetails) {
        await updateAwardMaritalDetails(req, res, updatedEntitlementDetails);
      }
      await updateWorkItem(req, res);
      return ['tasks', 'updated-entitlement-details', 'awardDetails'];
    }
    if (isWidowedTask(workItemReason)) {
      const award = dataStore.get(req, 'awardDetails');
      const maritalFormDetails = dataStore.get(req, 'marital');
      await saveWidowDetails(req, res, award, maritalFormDetails);
      await updateWorkItem(req, res);
      return ['tasks', 'updated-entitlement-details', 'marital', 'awardDetails'];
    }
    return throwInvalidWorkReasonError(workItemReason);
  },
};
