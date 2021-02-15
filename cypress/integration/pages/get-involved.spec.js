describe('loads Get Involved page successfully', () => {
  before(() => {
    cy.intercept({
      pathname: '/get-involved',
    }).as('getInvolved');
  });

  it('visits Get Involved page', () => {
    cy.visit('/get-involved');

    cy.wait('@getInvolved').its('response.statusCode').should('eq', 200);
  });
});

describe('loads Suggest A Story page successfully', () => {
  before(() => {
    cy.intercept({
      pathname: '/get-involved/suggest-a-story',
    }).as('suggestAStory');
  });

  it('visits Suggest A Story page', () => {
    cy.visit('/get-involved/suggest-a-story');

    cy.wait('@suggestAStory').its('response.statusCode').should('eq', 200);
  });
});

describe('loads Contribute Data page successfully', () => {
  before(() => {
    cy.intercept({
      pathname: '/get-involved/contribute-data',
    }).as('contributeData');
  });

  it('visits Contribute Data page', () => {
    cy.visit('/get-involved/contribute-data');

    cy.wait('@contributeData').its('response.statusCode').should('eq', 200);
  });
});

describe('loads Join the Community page successfully', () => {
  before(() => {
    cy.intercept({
      pathname: '/get-involved/join-the-community',
    }).as('joinCommunity');
  });

  it('visits Join the Community page', () => {
    cy.visit('/get-involved/join-the-community');

    cy.wait('@joinCommunity').its('response.statusCode').should('eq', 200);
  });
});

describe('loads Develop Your App page successfully', () => {
  before(() => {
    cy.intercept({
      pathname: '/get-involved/develop-your-app',
    }).as('developYourApp');
  });

  it('visits Develop Your App page', () => {
    cy.visit('/get-involved/develop-your-app');

    cy.wait('@developYourApp').its('response.statusCode').should('eq', 200);
  });
});

describe('loads App Gallery page successfully', () => {
  before(() => {
    cy.intercept({
      pathname: '/get-involved/apps',
    }).as('appGallery');
  });

  it('visits App Gallery page', () => {
    cy.visit('/get-involved/apps');

    cy.wait('@appGallery').its('response.statusCode').should('eq', 200);
  });
});
