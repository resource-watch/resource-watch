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
        expect($comingSoon.find('h4')).to.have.text('Would you like to see your data on Resource Watch?');
      });
    });
  });
});
