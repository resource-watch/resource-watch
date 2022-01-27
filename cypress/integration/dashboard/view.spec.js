describe('An authenticated user creates a new dashboard', () => {
  beforeEach(() => {
    cy.validateEnvVar('NEXT_PUBLIC_WRI_API_URL');

    cy.fixture('auth').then((userPayload) => {
      cy.intercept({
        pathname: '/v1/dashboard',
        query: {
          'filter[user]': userPayload.id,
        }
      }, (req) => {
        req.reply({
          statusCode: 200,
          fixture: 'dashboards/get-all/output.json',
        });
      }).as('getDashboards');
    });

    cy.login('/myrw/dashboards');
  });

  it ('an authenticated user goes to see his/her dashboard page', () => {
    cy.fixture('dashboards/get-all/output').then((dashboardsPayload) => {
      cy.wait('@getDashboards').then(({ response }) => {
        expect(response.statusCode).to.eq(200);
        expect(response.body.data.length).to.eq(dashboardsPayload.data.length);
      });

      cy.get('.c-dashboards-list > .list > *').then((dashboardItems) => {
        expect(dashboardItems.length).to.eq(dashboardsPayload.data.length);
      });
    })
  });
});
