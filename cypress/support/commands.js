import authPayload from '../fixtures/auth.json';

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

Cypress.Commands.add('login', (callbackUrl) => {
  cy.intercept('GET', `${Cypress.env('NEXT_PUBLIC_WRI_API_URL')}/auth/user/me`, {
    statusCode: 200,
    fixture: 'auth.json',
  }).as('getUser');


  cy.visit(`/sign-in${callbackUrl ? `?callbackUrl=${callbackUrl}` : ''}`);

  cy.get('[data-cy="email-input"]').type('lorem@test.com');
  cy.get('[data-cy="password-input"]').type('my-secure-password');

  cy.get('[data-cy="submit-button"]').click();

  // if (callbackUrl) cy.visit(callbackUrl);
});

Cypress.Commands.add('validateEnvVar', (varName) => {
  const varValue = Cypress.env(varName);
  if (!varValue) {
    throw new Error(`The '${varName}' env var is missing on cypress.`)
  }
});
