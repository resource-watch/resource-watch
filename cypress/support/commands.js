// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

Cypress.Commands.add("login", () => {
  // visiting a page is mandatory in order to initialize the store
  cy.visit('/sign-in');

  cy.log('user logging...');

  cy.request({
    method: 'POST',
    url: '/local-sign-in'
  })
  .then((response) => {
    if (response.status === 200) {
      cy.window().its('store').invoke('dispatch',{ type: 'user/setUser', payload: response.body });
      cy.log('user logged successfully');
    }
  });
});

Cypress.Commands.add('validateEnvVar', (varName) => {
  const varValue = Cypress.env(varName);
  if (!varValue) {
    throw new Error(`The '${varName}' env var is missing on cypress.`)
  }
});
