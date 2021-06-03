import invalidDatasets from '../../../../fixtures/pages/explore/my-data/invalid-dataset-list';
import validDatasets from '../../../../fixtures/pages/explore/my-data/valid-dataset-list';

describe('Explore – My Data fake door - logged user', () => {
  beforeEach(() => {
    cy.validateEnvVar('NEXT_PUBLIC_WRI_API_URL');
    cy.validateEnvVar('NEXT_PUBLIC_APPLICATIONS');
    cy.validateEnvVar('NEXT_PUBLIC_FEATURE_FLAG_DISABLE_MY_DATA');

    cy.intercept({
      method: 'GET',
      pathname: '/auth/user/me',
      url: Cypress.env('NEXT_PUBLIC_WRI_API_URL'),
      headers: {
        Authorization: 'Bearer fake_token',
      },
    },
    {
      "provider": "local",
      "role": "ADMIN",
      "_id": "19b21b288214b50001de7f63",
      "id": "19b21b288214b50001de7f63",
      "email": "john@doe.com",
      "extraUserData": {
          "apps": [
            "app-1",
            "app-2",
            "app-3"
          ]
      },
      "createdAt": "2019-10-31T13:00:58.191Z",
      "updatedAt": "2019-10-31T13:00:58.191Z"
    }).as('getMe');

    cy.login();

    cy.visit({
      method: 'GET',
      url: '/data/explore',
    });
  });

  it ('a logged user with invalid datasets sees the Coming Soon view when clicks on \'My Data\' tab', function() {
    if (Cypress.env('NEXT_PUBLIC_FEATURE_FLAG_DISABLE_MY_DATA') === 'true') {
      this.skip();
    }

    cy.intercept({
      method: 'GET',
      pathname: '/v1/dataset',
      url: Cypress.env('NEXT_PUBLIC_WRI_API_URL'),
      query: {
        userId: '19b21b288214b50001de7f63',
        application: Cypress.env('NEXT_PUBLIC_APPLICATIONS'),
        env: Cypress.env('NEXT_PUBLIC_API_ENV'),
        includes: 'layer,metadata'
      }
    },
    {
      data: invalidDatasets,
    },
    ).as('getUserDatasets');

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
    if (Cypress.env('NEXT_PUBLIC_FEATURE_FLAG_DISABLE_MY_DATA') === 'true') {
      this.skip();
    }

    cy.intercept({
      method: 'GET',
      pathname: '/v1/dataset',
      url: Cypress.env('NEXT_PUBLIC_WRI_API_URL'),
      query: {
        userId: '19b21b288214b50001de7f63',
        application: Cypress.env('NEXT_PUBLIC_APPLICATIONS'),
        env: Cypress.env('NEXT_PUBLIC_API_ENV'),
        includes: 'layer,metadata'
      }
    },
    {
      data: validDatasets,
    },
    ).as('getUserDatasets');

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
