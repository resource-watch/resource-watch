describe('loads about page successfully', () => {
  before(() => {
    cy.intercept({
      pathname: '/about',
    }).as('about');
  });

  it('visits about page', () => {
    cy.visit('/about');

    cy.wait('@about').its('response.statusCode').should('eq', 200);
  });
});

describe('loads partners page successfully', () => {
  before(() => {
    cy.intercept({
      pathname: '/about/partners',
    }).as('partners');
  });

  it('visits partners page', () => {
    cy.visit('/about/partners');

    cy.wait('@partners').its('response.statusCode').should('eq', 200);
  });
});

describe('loads FAQs page successfully', () => {
  before(() => {
    cy.intercept({
      pathname: '/about/faqs',
    }).as('faqs');
  });

  it('visits FAQs page', () => {
    cy.visit('/about/faqs');

    cy.wait('@faqs').its('response.statusCode').should('eq', 200);
  });
});

describe('loads How To page successfully', () => {
  before(() => {
    cy.intercept({
      pathname: '/about/howto',
    }).as('howTo');
  });

  it('visits How To page', () => {
    cy.visit('/about/howto');

    cy.wait('@howTo').its('response.statusCode').should('eq', 200);
  });
});

describe('loads Contact Us page successfully', () => {
  before(() => {
    cy.intercept({
      pathname: '/about/contact-us',
    }).as('contactUs');
  });

  it('visits Contact Us page', () => {
    cy.visit('/about/contact-us');

    cy.wait('@contactUs').its('response.statusCode').should('eq', 200);
  });
});
