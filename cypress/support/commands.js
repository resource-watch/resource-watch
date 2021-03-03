import { setUser } from '../../redactions/user';

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
Cypress.Commands.add("login", (callbackURL) => {
  // visiting a page is mandatory in order to initialize the store
  cy.visit('/sign-in');

  cy.request({
    method: 'POST',
    url: '/local-sign-in'
  })
  .then((response) => {
    if (response.status === 200) {
      cy.window().its('store').invoke('dispatch', setUser(response.body))
      if (callbackURL) cy.visit(callbackURL);
    }
  });
});
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
