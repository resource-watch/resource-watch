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

describe('loads Near Real-Time Data page successfully', () => {
  before(() => {
    cy.intercept({
      pathname: '/data/pulse',
    }).as('nrtData');
  });

  it('visits Near Real-Time Data page', () => {
    cy.visit('/data/pulse');

    cy.wait('@nrtData').its('response.statusCode').should('eq', 200);
  });
});
