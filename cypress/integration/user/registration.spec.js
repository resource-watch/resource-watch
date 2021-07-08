describe('A visitor signs-up successfully', () => {
  before(() => {
    cy.validateEnvVar('NEXT_PUBLIC_WRI_API_URL');

    cy.intercept({
      method: 'POST',
      pathname: '/auth/sign-up',
      url: Cypress.env('NEXT_PUBLIC_WRI_API_URL')
    },
    {
      "data": { "id": "6058c355b4966c00bb7ddf1d", "email": "lorem@test.com", "name": "Lorem Test", "createdAt": "2021-03-26T11:19:49.000Z", "role": "USER", "extraUserData": { "apps": [] } } }
    ).as('registerUser');
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
