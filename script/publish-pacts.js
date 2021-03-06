/* eslint-disable no-console */

/**
 * Publishes pacts generated by the Pact tests. Only meant to run in CI.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const pact = require('@pact-foundation/pact-node');

const pactsFolder = path.resolve(__dirname, '../pacts');

try {
  const pactFiles = fs.readdirSync(pactsFolder);
  if (!pactFiles.length) throw new Error('No pacts found.');
} catch (e) {
  console.warn(e.message);
  console.log('Skipping pact publishing.');
  return;
}

const consumerVersion = execSync('git rev-parse --verify HEAD')
  .toString()
  .trim();

const branchName = execSync('git rev-parse --abbrev-ref HEAD')
  .toString()
  .trim();

const opts = {
  pactBroker: process.env.PACT_BROKER_URL,
  pactBrokerUsername: process.env.PACT_BROKER_BASIC_AUTH_USERNAME,
  pactBrokerPassword: process.env.PACT_BROKER_BASIC_AUTH_PASSWORD,
  pactFilesOrDirs: [pactsFolder],
  consumerVersion,
  tags: [branchName],
};

pact
  .publishPacts(opts)
  .then(() => {
    console.log('Pact successfully published!');
  })
  .catch(e => {
    console.log(`Pact failed to publish: ${e}`);
  });
