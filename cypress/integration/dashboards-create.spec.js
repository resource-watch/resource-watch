describe('An authenticated user creates a new dashboard', () => {
  beforeEach(() => {
    cy.validateEnvVar('NEXT_PUBLIC_WRI_API_URL');

    cy.fixture('dashboards/post/output').then((dashboardPayload) => {
      cy.intercept({
          method: 'POST',
          url: Cypress.env('NEXT_PUBLIC_WRI_API_URL'),
          pathname: `/v1/dashboard`
        },
        dashboardPayload
      ).as('createDashboard');
    });

    cy.login();
  });

  it ('a user creates a new dashboard from scratch', () => {
    cy.visit('/myrw-detail/dashboards/new');

    cy.fixture('dashboards/post/input').then((dashboard) => {
      cy.log('Fills in dashboard form');

      const $form = cy.get('form[data-cy="dashboard-form"]');

      $form.get('input[id="input-name"]').type(dashboard.name);
      $form.get('textarea[id="input-summary"]').type(dashboard.summary);
      $form.get('textarea[id="input-description"]').type(dashboard.description);
      cy.get('input[type="file"]').attachFile({
        filePath: `../fixtures/${dashboard.photo}`,
      });

      // wysiwyg
      cy.get('.cw-wysiwyg').find('h1').clear().type(dashboard.wysiwyg.title);

      cy.log('Submits dashboard form');
      cy.get('form[data-cy="dashboard-form"]').submit();

      cy.wait('@createDashboard').then(({ response }) => {
        expect(response.statusCode).to.eq(200);
        expect(response.body.data.attributes.name).to.eq(dashboard.name);
      });
    });
  });

  it ('a user goes to its dashboard page', () => {
    cy.fixture('dashboards/get-all/output').then((dashboardsPayload) => {
      cy.intercept({
          method: 'GET',
          url: Cypress.env('NEXT_PUBLIC_WRI_API_URL'),
          pathname: `/v1/dashboard`
        },
        dashboardsPayload
      ).as('getDashboards');
    });

    cy.visit('/myrw/dashboards');

    cy.fixture('dashboards/get-all/output').then((dashboardsPayload) => {
      cy.wait('@getDashboards').then(({ response }) => {
        expect(response.statusCode).to.eq(200);
        expect(response.body.data.length).to.eq(dashboardsPayload.data.length);
      });

      cy.get('.c-dashboards-list > .list > .list-item').then((dashboardItems) => {
        expect(dashboardItems.length).to.eq(dashboardsPayload.data.length);
      });
    })
  });
});
