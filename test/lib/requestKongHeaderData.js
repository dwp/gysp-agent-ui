const kongData = require('./kongData');

module.exports = (northIreland = false) => {
  const { cis } = kongData(northIreland).user;
  return {
    reqheaders: {
      agentRef: cis.dwp_staffid,
      location: cis.SLOC,
    },
  };
};
