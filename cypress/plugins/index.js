const { loadEnvConfig } = require('@next/env');

loadEnvConfig(
  process.cwd(),
  false,
);

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
  require('@cypress/code-coverage/task')(on, config)
  require("cypress-fail-fast/plugin")(on, config);

  // use this dictionary to pass external env vars to Cypress
  const envDictionary = {
    'NEXT_PUBLIC_API_ENV': process.env.NEXT_PUBLIC_API_ENV,
    'NEXT_PUBLIC_APPLICATIONS': process.env.NEXT_PUBLIC_APPLICATIONS,
    'NEXT_PUBLIC_BITLY_TOKEN': process.env.NEXT_PUBLIC_BITLY_TOKEN,
    'NEXT_PUBLIC_WRI_API_URL': process.env.NEXT_PUBLIC_WRI_API_URL,
    'NEXT_PUBLIC_CONTROL_TOWER_URL': process.env.NEXT_PUBLIC_CONTROL_TOWER_URL,
    'NEXT_PUBLIC_APPLICATIONS': process.env.NEXT_PUBLIC_APPLICATIONS,
    'NEXT_PUBLIC_RW_ENV': process.env.NEXT_PUBLIC_RW_ENV,
    'NEXT_PUBLIC_FEATURE_FLAG_OCEAN_WATCH': process.env.NEXT_PUBLIC_FEATURE_FLAG_OCEAN_WATCH,
  };

  Object.keys(envDictionary).map((envKey) => {
    config.env[envKey] = envDictionary[envKey];
  });

  return config;
};
