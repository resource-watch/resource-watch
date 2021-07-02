describe('A user updates its profile successfully', () => {
  before(() => {
    cy.login('/');

    cy.fixture('auth').then((authPayload) => {
      cy.intercept(
        {
          method: 'PATCH',
          pathname: '/auth/user/me',
          url: Cypress.env('NEXT_PUBLIC_WRI_API_URL'),
          headers: {
            Authorization: 'Bearer valid_token',
          },
        },
        {
          ...authPayload,
          name: 'John Doe updated',
        }
      ).as('updateUser');
    })
  });

  it('a user visits its profile to update it and refreshes the page', function() {
    this.skip();
    cy.visit('/myrw/profile');

    // updates user info
    cy.get('.c-form').find('input[name="name"]').clear().type('John Doe updated');
    cy.get('.c-form').find('button[type="submit"]').click();

    cy.wait('@updateUser');

    // refreshes page
    cy.reload();

    cy.wait('@getUserData');

    // confirms the updated data its reflected in the field
    cy.get('.c-form').find('input[name="name"]').then(($inputName) => {
      expect($inputName).to.have.value('John Doe updated');
    });
  });
});
