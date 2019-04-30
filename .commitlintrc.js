module.exports = {
  "extends": ["@dwp/commitlint-config-base"],
  "rules": {
    "references-empty": [ 1, "never" ]
  },
  "parserPreset": {
    "parserOpts": {
      // Change this JIRA prefix to something that makes sense for your service
      "issuePrefixes": [ "SA-" ]
    }
  }
};
