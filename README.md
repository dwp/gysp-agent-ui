# Get your State Pension Agent UI
[![Build Status](https://travis-ci.org/dwp/gysp-agent-ui.svg?branch=master)](https://travis-ci.org/dwp/gysp-agent-ui) [![Known Vulnerabilities](https://snyk.io/test/github/dwp/gysp-agent-ui/badge.svg)](https://snyk.io/test/github/dwp/gysp-agent-ui)

Agent frontend service for Get your State Pension.

### Requirements

* Docker 18.0.0+
* Docker compose 1.23.0+

### Running Locally

#### Config

Use to provided `.env.example` file and create your own `.env` file and complete the config.

If you wish to change the port from the default port of `3002` you will need to update in a 2 files:

```
.env # PORT=
docker-compose.yaml # within the port map config
```

#### Running

```
make up
```

This is using `docker-compose` to spin up a redis server and a nodeJS server and will be available on your configered URL, default is: `http://localhost:3002`.

#### Stopping

To stop the app running, in the terminal window press `CTRL` + `C`.

### Running in DEV/QA

There are various system variables that need to be set for the application to run correctly in different environments, most have some form of default.

### Testing

#### Requirements

* Node.JS v12.0.0+
* npm v6.9.0+

There is a few options for testing within the application, these have been configured on jenkins. Testing uses [mocha](https://github.com/mochajs/mocha), [chai](https://github.com/chaijs/chai) and [nyc](https://github.com/istanbuljs/nyc).

Setup:
```
npm install
```

Unit tests:
```
npm run test
```

Code coverage using [nyc](https://github.com/istanbuljs/nyc):
```
npm run test-coverage
```

Code linting using [ESLint](https://github.com/eslint/eslint):
```
npm run lint
```

Dependancy checks using [npm-audit](https://docs.npmjs.com/cli/audit) & [npm-outdated](https://docs.npmjs.com/cli/outdated):
```
npm run security-tests
```