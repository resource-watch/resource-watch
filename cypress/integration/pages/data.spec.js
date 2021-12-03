describe('loads Explore page successfully', () => {
  before(() => {
    cy.intercept({
      pathname: '/data/explore',
    }).as('explore');
  });

  it('visits explore page', () => {
    cy.visit('/data/explore');

    cy.wait('@explore').its('response.statusCode').should('eq', 200);
  });
});
