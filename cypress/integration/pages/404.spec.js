describe('tests 404 page', () => {
  it ('visiting a page doesn\'t exist displays 404 page', () => {
    cy.intercept({
      method: 'GET',
      url:'/non-existent-page',
    }).as('nonExistentPage');

    cy.visit({
      method: 'GET',
      url: '/non-existent-page',
      failOnStatusCode: false,
    });

    cy.wait('@nonExistentPage')
      .its('response.statusCode').should('eq', 404);
    cy.title()
      .should('eq', 'Page Not Found | Resource Watch');
    cy.get('h1')
      .should('have.text', '404');
    cy.get('p')
      .should('have.text', 'The page could not be found');
  });
});
