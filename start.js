const gulp = require('gulp');
const gulpFile = require('./gulpfile.js');
const awsPrivateIp = require('./awsPrivateIp');


if (process.env.CONFIG_LOCATION === undefined) {
  process.env.CONFIG_LOCATION = './';
}

if (process.env.PORT === undefined) {
  process.env.PORT = 3002;
}

if (process.env.KONG_ENABLED === undefined) {
  process.env.KONG_ENABLED = false;
}

async function setIpAddresses() {
  if (process.env.GATEWAY === undefined) {
    const kongIP = await awsPrivateIp.getEc2PrivateIp('gysp-dev-kong');
    process.env.GATEWAYHOST = kongIP;
    process.env.GATEWAY = `http://${kongIP}:8000/`;
  }
}

setIpAddresses().then(() => {
  gulp.series(gulpFile.default)(() => {});
  process.on('SIGINT', () => {
    process.kill(process.pid, 'SIGTERM');
    process.exit();
  });
});
