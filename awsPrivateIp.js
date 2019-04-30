const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

function getEc2PrivateIp(ec2Name) {
  return new Promise((resolve, reject) => {
    AWS.config.update({ region: 'eu-west-2' });
    const ec2 = new AWS.EC2();
    ec2.describeInstances({
      Filters: [{ Name: 'instance-state-name', Values: ['running'] }, { Name: 'tag:Name', Values: [ec2Name] }],
    }, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data.Reservations[0].Instances[0].PrivateIpAddress);
      }
    });
  });
}

module.exports.getEc2PrivateIp = getEc2PrivateIp;
