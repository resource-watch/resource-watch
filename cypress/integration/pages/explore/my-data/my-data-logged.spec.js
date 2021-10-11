describe('Explore – My Data fake door - logged user', () => {
  beforeEach(() => {
    cy.validateEnvVar('NEXT_PUBLIC_WRI_API_URL');
    cy.validateEnvVar('NEXT_PUBLIC_APPLICATIONS');

    cy.login('/data/explore');
  });

  it ('a logged user with invalid datasets sees the Coming Soon view when clicks on \'My Data\' tab', function() {
    cy.fixture('auth').then((userPayload) => {
      cy.intercept({
        pathname: '/v1/dataset',
        query: {
          application: Cypress.env('NEXT_PUBLIC_APPLICATIONS'),
          userId: userPayload.id,
          includes: 'layer,metadata',
        }
      }, (req) => {
        req.reply({
          statusCode: 200,
          fixture: 'pages/explore/my-data/invalid-dataset-list',
        });
      }).as('getUserDatasets');
    });

    cy.get('div[data-cy=\'my-data-tab\']').then(($myDataTab) => {
      expect($myDataTab).to.have.length(1);
      $myDataTab.trigger('click');

      cy.wait('@getUserDatasets');

      cy.get('#sidebar-content-container').find('.card-coming-soon').then(($comingSoon) => {
        expect($comingSoon.find('p')).to.have.text('We are exploring ways to let you bring your data to the platform. Would you use this feature? Let us know.');
      });
    });
  });

  it ('a logged user with valid datasets sees its list of datasets when clicks on \'My Data\' tab', function() {
    cy.fixture('auth').then((userPayload) => {
      cy.intercept({
        pathname: '/v1/dataset',
        query: {
          application: Cypress.env('NEXT_PUBLIC_APPLICATIONS'),
          userId: userPayload.id,
          includes: 'layer,metadata',
        }
      }, (req) => {
        req.reply({
          statusCode: 200,
          // this list contains the following datasets:
          // - a valid one with GEE as provider and one layer,
          // - a valid one with CartoDB as provider and one layer,
          // - an invalid one with CartoDB as provider but without any layer,
          // - an invalid one with featureservice as provider and one layer,
          fixture: 'pages/explore/my-data/valid-dataset-list',
        });
      }).as('getUserDatasets');
    });

    cy.get('div[data-cy=\'my-data-tab\']').then(($myDataTab) => {
      expect($myDataTab).to.have.length(1);
      $myDataTab.trigger('click');

      cy.wait('@getUserDatasets');

      cy.get('.c-explore-dataset-list').then(($datasetList) => {
        expect($datasetList.find('.c-explore-dataset-list-item')).to.have.length(2);
      });
    });
  });
});
