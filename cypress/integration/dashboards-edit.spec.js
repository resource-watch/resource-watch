describe('An authenticated user edits a dashboard', () => {
  beforeEach(() => {

    cy.validateEnvVar('NEXT_PUBLIC_WRI_API_URL');
    cy.validateEnvVar('NEXT_PUBLIC_API_ENV');
    cy.validateEnvVar('NEXT_PUBLIC_APPLICATIONS');

    cy.login();

    cy.fixture('subscriptions/get-all').then((subscriptionsPayload) => {
      cy.intercept({
          method: 'GET',
          pathname: `/v1/subscriptions?application=rw&env=production`,
          url: Cypress.env('NEXT_PUBLIC_WRI_API_URL')
        },
        subscriptionsPayload
      ).as('getUserSubscriptions');
    });

    cy.fixture('areas/get-user-areas').then((userAreasPayload) => {
      cy.intercept({
          method: 'GET',
          pathname: `/v2/area?application=rw&env=production`,
          url: Cypress.env('NEXT_PUBLIC_WRI_API_URL'),
          auth: {
            bearer: 'valid_token',
          },
        },
        userAreasPayload
      ).as('getUserAreas');
    });

    cy.fixture('dashboards/post/output').then((dashboardPayload) => {
      cy.intercept({
          method: 'GET',
          pathname: `/v1/dashboard/529`,
          url: Cypress.env('NEXT_PUBLIC_WRI_API_URL'),
          query: {
            application: Cypress.env('NEXT_PUBLIC_APPLICATIONS'),
            env: Cypress.env('NEXT_PUBLIC_API_ENV')
          }
        },
        dashboardPayload
      ).as('getOriginalDashboard');
    });

    cy.fixture('dashboards/patch/output').then((dashboardPayload) => {
      cy.intercept({
          method: 'PATCH',
          pathname: `/v1/dashboard/529`,
          url: Cypress.env('NEXT_PUBLIC_WRI_API_URL')
        },
        dashboardPayload
      ).as('getEditedDashboard');

      cy.intercept({
          method: 'GET',
          pathname: `/v1/dashboard`,
          url: Cypress.env('NEXT_PUBLIC_WRI_API_URL')
        },
        {
          data: [
            dashboardPayload.data,
          ],
        }
      ).as('getDashboards');
    });
  });

  it('a user edits a dashboard', () => {
    cy.visit('/myrw-detail/dashboards/529');

    cy.wait('@getOriginalDashboard').then(({ response }) => {
      expect(response.statusCode).to.eq(200);
    });

    cy.fixture('dashboards/patch/input').then((dashboard) => {
      cy.log('Edits dashboard form');

      cy.get('form').find('input[id="input-name"]').clear().type(dashboard.name);
      cy.get('form').find('textarea[id="input-summary"]').clear().type(dashboard.summary);
      cy.get('form').find('textarea[id="input-description"]').clear().type(dashboard.description);
      cy.get('input[type="file"]').attachFile({
        filePath: `../fixtures/${dashboard.photo}`,
      });

      // wysiwyg
      cy.get('.cw-wysiwyg').find('h1').clear().type(dashboard.wysiwyg.title);

      cy.log('Submits dashboard form');
      cy.get('form[data-cy="dashboard-form"]').submit();
    });

    cy.wait('@getEditedDashboard').then(({ response }) => {
      expect(response.statusCode).to.eq(200);
    });
  });

  it('the user checks the edited dashboard in the dashboard page', () => {
    cy.visit('/myrw/dashboards');

    cy.fixture('dashboards/get-all/output').then((dashboardsPayload) => {
      cy.wait('@getDashboards').then(({ response }) => {
        expect(response.statusCode).to.eq(200);
        expect(response.body.data.length).to.eq(dashboardsPayload.data.length);
      });

      cy.get('.c-dashboards-list > .list > .list-item').then((dashboardItems) => {
        expect(dashboardItems.length).to.eq(dashboardsPayload.data.length);
      });

      cy.fixture('dashboards/patch/input').then((dashboard) => {
        cy.get('.c-dashboards-list > .list > .list-item:first').find('.c-title').should('have.text', dashboard.name);
      });
    });
  });
});
