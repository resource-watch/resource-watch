describe('A visitor signs-up successfully', () => {
  before(() => {
    cy.validateEnvVar('NEXT_PUBLIC_WRI_API_URL');

    cy.intercept('POST', `${Cypress.env('NEXT_PUBLIC_WRI_API_URL')}/auth/sign-up`,
    {
      fixture: 'user/new-user',
    }).as('registerUser');
  });

  it('the visitor fills up the form and register successfully', function() {
    if (Cypress.isBrowser('firefox')) {
      cy.log('This test tries to access to an iframe. Firefox Same Origin Policy doesn\'t support this test. Skipping...');
      this.skip();
    }
    cy.visit('/sign-in');

    cy.get('button[data-cy="register-button"]').click();
    cy.get('input[name="email"]').type('lorem@test.com')

    cy.wait(1000);

    const iframeDocument = cy.get('iframe').first()
      .its('0.contentDocument').should('exist')

    const iframeBody = iframeDocument
      .its('body').should('not.be.undefined')
      .then(cy.wrap)

    iframeBody.find('span[role="checkbox"]').click();

    // wait for recaptcha to validate
    cy.wait(1000);

    cy.get('button[type="submit"]').click();

    cy.wait('@registerUser')
      .its('response.statusCode').should('eq', 200);

    cy.get('.toastr')
      .find('.rrt-text')
      .should('have.text', 'You will receive an email shortly. Please confirm your registration.');
  });
});
