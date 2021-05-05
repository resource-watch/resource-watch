describe('Explore – My Data fake door – Non logged user', () => {
  it ('a non logged user sees the Coming Soon view when clicks on \'My Data\' tab', () => {
    cy.visit({
      method: 'GET',
      url: '/data/explore',
    });

    cy.get('div[data-cy=\'my-data-tab\']').then(($myDataTab) => {
      expect($myDataTab).to.have.length(1);
      $myDataTab.trigger('click');

      cy.get('#sidebar-content-container').find('.card-coming-soon').then(($comingSoon) => {
        expect($comingSoon).to.have.length(1);
        expect($comingSoon.find('p')).to.have.text('We are exploring ways to let you bring your data to the platform. Would you use this feature? Let us know.');
      });
    });
  });

  it ('a non logged user signs up successfully', () => {
    cy.visit({
      method: 'GET',
      url: '/data/explore',
    });

    cy.get('div[data-cy=\'my-data-tab\']').then(($myDataTab) => {
      expect($myDataTab).to.have.length(1);
      $myDataTab.trigger('click');

      cy.get('#my-data-sign-up').find('input[type="email"]').type('test@test.com');
      cy.get('#my-data-sign-up').find('button[type="submit"]').click();

      cy.get('.toastr')
        .find('.rrt-text')
        .should('have.text', 'You signed up successfully.');
    });
  });
});
