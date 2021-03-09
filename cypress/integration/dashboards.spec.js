describe('An authenticated user creates a new dashboard', () => {
  beforeEach(() => {
    const WRI_API_URL = Cypress.env('WRI_API_URL');

    cy.fixture('dashboards/post/output').then((dashboardPayload) => {
      cy.intercept({
        method: 'POST',
        url: `${WRI_API_URL}/v1/dashboard`
      },
      dashboardPayload
      ).as('createDashboard');
    });

    cy.fixture('dashboards/get-all/output').then((dashboardsPayload) => {
      cy.intercept({
        method: 'GET',
        url: `${WRI_API_URL}/v1/dashboard`
      },
      dashboardsPayload
      ).as('getDashboards');
    });

    cy.login();
  });

  it ('a user creates a new dashboard from scratch', () => {
    cy.visit('/myrw-detail/dashboards/new');

    cy.fixture('dashboards/post/input').then((dashboard) => {
      cy.log('Fills in dashboard form');

      cy.get('form').find('input[id="input-name"]').type(dashboard.name);
      cy.get('form').find('textarea[id="input-summary"]').type(dashboard.summary);
      cy.get('form').find('textarea[id="input-description"]').type(dashboard.description);
      cy.get('input[type="file"]').attachFile({
        filePath: `../fixtures/${dashboard.photo}`,
      });

      // wysiwyg
      cy.get('.cw-wysiwyg').find('h1').clear().type(dashboard.wysiwyg.title);

      cy.log('Submits dashboard form');
      cy.get('form[data-cy="dashboard-form"]').submit();

      cy.wait('@createDashboard').then(({ response }) => {
        console.log('response', response)
        expect(response.statusCode).to.eq(200);
        expect(response.body.data.attributes.name).to.eq(dashboard.name);
      });
    });
  });

  it ('a user goes to its dashboard page', () => {
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

describe('An authenticated user edits a dashboard', () => {
  beforeEach(() => {
    const WRI_API_URL = Cypress.env('WRI_API_URL');

    cy.login();

    cy.fixture('subscriptions/get-all').then((subscriptionsPayload) => {
      cy.intercept({
        method: 'GET',
        url: `${WRI_API_URL}/v1/subscriptions?application=rw&env=production`,
      },
      subscriptionsPayload
      ).as('getUserSubscriptions');
    });

    cy.fixture('areas/get-user-areas').then((userAreasPayload) => {
      cy.intercept({
        method: 'GET',
        url: `${WRI_API_URL}/v2/area?application=rw&env=production`,
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
        url: `${WRI_API_URL}/v1/dashboard/529?env=production&application=rw`,
      },
      dashboardPayload
      ).as('getOriginalDashboard');
    });

    cy.fixture('dashboards/patch/output').then((dashboardPayload) => {
      cy.intercept({
        method: 'PATCH',
        url: `${WRI_API_URL}/v1/dashboard/529`,
      },
      dashboardPayload
      ).as('getEditedDashboard');

      cy.intercept({
        method: 'GET',
        url: `${WRI_API_URL}/v1/dashboard`
      },
      {
        data: [
          dashboardPayload.data,
        ],
      }
      ).as('getDashboards');
    });

    // cy.fixture('dashboards/patch/output').then((dashboardsPayload) => {
    //   cy.intercept({
    //     method: 'GET',
    //     url: `${WRI_API_URL}/v1/dashboard`
    //   },
    //   {
    //     data: [
    //       dashboardsPayload.data,
    //     ],
    //   }
    //   ).as('getDashboards');
    // });
  });

  it ('a user edits a dashboard', () => {
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

  it ('the user checks the edited dashboard in the dashboard page', () => {
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
