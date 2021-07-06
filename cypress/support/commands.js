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
  const cookieOptions = {
    domain: Cypress.env('NEXTAUTH_URL'),
    sameSite: 'no_restriction',
    secure: true,
  };
  // sets user session manually
  cy.setCookie('next-auth.session-token', 'eyJhbGciOiJIUzUxMiJ9.eyJuYW1lIjoiSm9obiBEb2UiLCJlbWFpbCI6ImpvaG5AZG9lLmNvbSIsInN1YiI6IjE5YjIxYjI4ODIxNGI1MDAwMWRlN2Y2MyIsImFjY2Vzc1Rva2VuIjoidmFsaWRfdG9rZW4iLCJpYXQiOjE2MjUyMjA5MjIsImV4cCI6MTYyNzgxMjkyMn0.VKLEZJoAvlNChBhy8nInmQ9ZYXhqhsNHd28f8K1o6LtCahg78ika61n_76Jy-QtC5DLJtjL7kecE2Zn9lg0Mag', cookieOptions);
  cy.setCookie('next-auth.csrf-token', '24570bb383dba6732619dd59c98ce2085d009542a4d660feb581f30fb999da7d%7Cbf21856cb87b532267efc59c04ecaaad0961de65a27e3174e90dbceb30b842b2', cookieOptions);

  cy.fixture('auth').then((authPayload) => {
    cy.intercept(
      {
        method: 'GET',
        url: `${Cypress.env('NEXT_PUBLIC_WRI_API_URL')}/auth/user/me`,
      },
      authPayload,
    ).as('getAuthPayload');
  });

  if (callbackUrl) cy.visit(callbackUrl);
});

Cypress.Commands.add('validateEnvVar', (varName) => {
  const varValue = Cypress.env(varName);
  if (!varValue) {
    throw new Error(`The '${varName}' env var is missing on cypress.`)
  }
});
