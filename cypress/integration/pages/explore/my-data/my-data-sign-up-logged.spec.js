describe('Explore – My Data - A logged user signs up', () => {
  beforeEach(() => {
    cy.intercept({
      method: 'POST',
      pathname: '/somewhere',
      url: '',
    },
    {
      "success": true,
    },
    ).as('fetchPardot');

    cy.login('/data/explore');
  });

  it ('a logged user signs up successfully', () => {
    cy.visit({
      method: 'GET',
      url: '/data/explore',
    });

    cy.get('div[data-cy=\'my-data-tab\']').then(($myDataTab) => {
      $myDataTab.trigger('click');

      cy.get('#my-data-sign-up').find('input[type="email"]').then(($inputEmail) => {
        expect($inputEmail).to.have.value('john@doe.com');
        expect($inputEmail).to.have.attr('disabled');
      });

      cy.get('#my-data-sign-up').find('button[type="submit"]').click();

      cy.wait('@fetchPardot');

      cy.get('.toastr')
        .find('.rrt-text')
        .should('have.text', 'You signed up successfully.');
    });
  });
});
