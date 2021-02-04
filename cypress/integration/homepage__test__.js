describe('loads homepage successfully', () => {
  before(() => {
    cy.intercept({
      pathname: '/',
    }).as('homepage');
  });

  it('visits homepage', () => {
    cy.visit('/');

    // assert that a request to this route received a response with HTTP status 200
    cy.wait('@homepage').its('response.statusCode').should('eq', 200);
  });
});


describe('clicking on \'Explore Data\' button in the homepage goes to Explore page', () => {
  before(() => {
    cy.intercept({
      pathname: '/data/explore',
    }).as('explore');
  })

  it('visits explore page from homepage', () => {
    cy.visit('/');

    cy.get('a[href*=\'/data/explore\']')
      .first()
      .then(($link) => {
        const href = $link.attr('href');
        cy.visit(href)
      });

    cy.wait('@explore').its('response.statusCode').should('eq', 200);
  });
});
