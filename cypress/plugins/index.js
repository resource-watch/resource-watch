/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)
// const applicationConfig = require('config');

const { loadEnvConfig } = require('@next/env');

const projectDir = process.cwd();

loadEnvConfig(
  projectDir,
  false,
);


/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  require('@cypress/code-coverage/task')(on, config)
  require("cypress-fail-fast/plugin")(on, config);

  // use this dictionary to pass external env vars to Cypress
  const envDictionary = {
    'NEXT_PUBLIC_API_ENV': process.env.NEXT_PUBLIC_API_ENV,
    'NEXT_PUBLIC_APPLICATIONS': process.env.NEXT_PUBLIC_APPLICATIONS,
    'NEXT_PUBLIC_BITLY_TOKEN': process.env.NEXT_PUBLIC_BITLY_TOKEN,
    'NEXT_PUBLIC_WRI_API_URL': process.env.NEXT_PUBLIC_WRI_API_URL,
  };

  Object.keys(envDictionary).map((envKey) => {
    config.env[envKey] = envDictionary[envKey];
  });

  // IMPORTANT to return the config object
  // with the any changed environment variables
  return config;
};
