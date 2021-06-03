describe('A user updates its profile successfully', () => {
  before(() => {
    cy.login();

    cy.intercept(
      {
        method: 'POST',
        url: '/update-user',
      },
    ).as('updateUser');
  });

  it('a user visits its profile to update it and refreshes the page', function() {
    cy.visit('/myrw/profile');

    // updates user info
    cy.get('.c-form').find('input[name="name"]').clear().type('John Doe updated');
    cy.get('.c-form').find('button[type="submit"]').click();

    cy.wait('@updateUser');

    // refreshes page
    cy.visit('/myrw/profile');

    // confirms the updated data its reflected in the field
    cy.get('.c-form').find('input[name="name"]').then(($inputName) => {
      expect($inputName).to.have.value('John Doe updated');
    });
  });
});
