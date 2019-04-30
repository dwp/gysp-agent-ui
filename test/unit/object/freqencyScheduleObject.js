const assert = require('assert');

const object = require('../../../lib/objects/freqencyScheduleObject');
const dataObjects = require('../lib/awardDataObjects');

const nino = 'AA370773A';
const frequency = '1W';

describe('frequency schedule object formatter', () => {
  it('should return valid json when object is called with full object, nino and freqency', (done) => {
    const json = object.formatter(dataObjects.validScheduleApiResponse(), frequency, nino);
    assert.equal(JSON.stringify(json), JSON.stringify(dataObjects.validScheduleFormatterResponse(frequency, nino)));
    done();
  });
});
