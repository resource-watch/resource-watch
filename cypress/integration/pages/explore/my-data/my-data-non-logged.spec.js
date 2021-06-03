describe('Explore – My Data fake door – Non logged user', () => {
  beforeEach(() => {
    cy.validateEnvVar('NEXT_PUBLIC_FEATURE_FLAG_DISABLE_MY_DATA');
  });

  it ('a non logged user sees the Coming Soon view when clicks on \'My Data\' tab', function() {
    if (Cypress.env('NEXT_PUBLIC_FEATURE_FLAG_DISABLE_MY_DATA') === 'true') {
      this.skip();
    }

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
});
