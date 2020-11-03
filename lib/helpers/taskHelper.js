const request = require('request-promise');
const dataStore = require('../dataStore');

// Helpers
const requestHelper = require('../requestHelper');
const requestFilterHelper = require('./requestFilterHelper');

// View objects
const taskMaritalDetailObject = require('../objects/view/taskMaritalDetailObject');

// Api objects
const maritalDetailsEntitlementApiObject = require('../objects/api/maritalDetailsEntitlementObject');

// Api endpoints
const getAwardByInviteKeyEndPoint = 'api/award/award-by-invite-key';
const putMaritalDetailsEndPoint = 'api/award/update-marital-details';
const putWorkItemUpdateStatusCompleteEndPoint = 'api/workitem/update-status-complete';

const isMarriedOrCivilPartnershipTask = (workItemReason) => workItemReason === 'MARRIED' || workItemReason === 'CIVILPARTNERSHIP';
const throwInvalidWorkReasonError = (workItemReason) => {
  throw new Error(`Invalid workItemReason, got ${workItemReason}`);
};

async function awardAndReasonDetails(req, res) {
  const { inviteKey, workItemReason } = dataStore.get(req, 'work-item', 'tasks');
  const award = await dataStore.cacheRetrieveAndStore(req, 'tasks', 'awardDetails', () => {
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

module.exports = {
  taskDetail(req, workItemReason, award) {
    if (isMarriedOrCivilPartnershipTask(workItemReason)) {
      const updatedEntitlementDetails = dataStore.get(req, 'updated-entitlement-details');
      const details = taskMaritalDetailObject.formatter(award, workItemReason, updatedEntitlementDetails);
      return {
        view: 'entitlement/detail',
        data: { details },
      };
    }
    return throwInvalidWorkReasonError(workItemReason);
  },
  async taskEnd(req, res, workItemReason) {
    if (isMarriedOrCivilPartnershipTask(workItemReason)) {
      const updatedEntitlementDetails = dataStore.get(req, 'updated-entitlement-details');
      if (updatedEntitlementDetails) {
        await updateAwardMaritalDetails(req, res, updatedEntitlementDetails);
      }
      await updateWorkItem(req, res);
      return ['tasks', 'updated-entitlement-details'];
    }
    return throwInvalidWorkReasonError(workItemReason);
  },
};
