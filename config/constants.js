const changesAndEnquires = '/changes-and-enquiries';
const personal = `${changesAndEnquires}/personal`;
const death = `${personal}/death`;

module.exports = {
  routes: {
    changesAndEnquires: {
      BASE: changesAndEnquires,
      PERSONAL: personal,
      death: {
        BASE: death,
        CAN_VERIFY_DATE: `${death}/are-you-able-to-verify-the-date-of-death`,
        VERIFY_DATE: `${death}/verify`,
        VERIFIED_DATE: `${death}/verified-date`,
        DAP_NAME: `${death}/name`,
      },
    },
  },
};
