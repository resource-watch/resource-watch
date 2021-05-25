describe('Mini Explore - test suit', () => {
  // beforeEach(() => {
  //   cy.validateEnvVar('NEXT_PUBLIC_WRI_API_URL');
  //   cy.validateEnvVar('NEXT_PUBLIC_APPLICATIONS');
  //   cy.validateEnvVar('NEXT_PUBLIC_API_ENV');

  //   cy.fixture('mini-explore/datasets').then((miniExplorePayload) => {
  //     cy.intercept(
  //       {
  //         method: 'GET',
  //         pathname: '/v1/dataset',
  //         url: Cypress.env('NEXT_PUBLIC_WRI_API_URL'),
  //         query: {
  //           application: Cypress.env('NEXT_PUBLIC_APPLICATIONS'),
  //           env: Cypress.env('NEXT_PUBLIC_API_ENV'),
  //           includes: 'layer',
  //           ids: [
  //             'a86d906d-9862-4783-9e30-cdb68cd808b8',
  //             'b75d8398-34f2-447d-832d-ea570451995a',
  //             '4919be3a-c543-4964-a224-83ef801370de',
  //             '484f10d3-a30b-4466-8052-c48d47cfb4a1',
  //             'c5a62289-bdc8-4821-83f0-6f05e3d36bdc',
  //           ].join(','),
  //           'page[size]': 50,
  //         }
  //       },
  //       miniExplorePayload,
  //     ).as('getDataset');
  //   });

  //   cy.fixture('mini-explore/geostore').then((geostorePayload) => {
  //     cy.intercept(
  //       {
  //         method: 'GET',
  //         pathname: '/v1/geostore/972c24e1da2c2baacc7572ee9501abdc',
  //         url: Cypress.env('NEXT_PUBLIC_WRI_API_URL'),
  //       },
  //       geostorePayload,
  //     ).as('getGeostore');
  //   });

  //   cy.visit('/dashboards/ocean-watch/country/BRA');
  // });

  // it('the sidebar displays the data correctly', () => {
  //   cy.wait('@getDataset');

  //   cy.get('.c-mini-explore header > h4').then(($title) => {
  //     expect($title).to.have.text('Lorem ipsum');
  //   })

  //   cy.get('.c-mini-explore .datasets-sidebar').within(() => {
  //     const $datasetGroups = $datasetSidebar.find('.dataset-group');
  //     expect(cy.get('.dataset-group').should('have.length', 2));

  //     cy.get('.dataset-group:first-child').within(() => {
  //       cy.get('.group-header').should('have.length', 1);
  //       cy.get('.group-header > h4').should('have.text', 'Power Infrastructure');
  //       cy.get('.group-header > .number-of-datasets').as('datasetNumber');
  //       cy.get('@datasetNumber').should('have.text', '3 datasets');
  //       cy.get('.c-dataset-card-list .dataset-card-list-item-container').should('have.length', 3);
  //     });
  //   });
  // });

  // it('interaction with a dataset selected by default', () => {
  //   cy.wait('@getDataset');

  //   const $firstDatasetList = cy.get('.c-mini-explore').find('.c-dataset-card-list').first();
  //   const $firstDatasetCard = $firstDatasetList.find('.dataset-card-list-item-container:first-child > .c-dataset-card-item');

  //   // by default, this dataset is enabled, so it should display different styles and label in the button
  //   $firstDatasetCard.should('have.class', 'c-dataset-card-item -active')

  //   const $mapButton = $firstDatasetCard.find('button').first();
  //   $mapButton.should('have.text', 'Active');
  //   $mapButton.should('have.class', 'c-button -primary -compressed -fullwidth');

  //   $mapButton.trigger('click');
  //   $mapButton.should('have.text', 'Add to map');
  //   $mapButton.should('have.class', 'c-button -secondary -compressed -fullwidth');
  // })

  // it('interaction with a dataset', () => {
  //   cy.wait('@getDataset');

  //   const $firstDatasetList = cy.get('.c-mini-explore').find('.c-dataset-card-list').first();
  //   const $lastDatasetCard = $firstDatasetList.find('.dataset-card-list-item-container:last-child > .c-dataset-card-item');

  //   $lastDatasetCard.should('have.class', 'c-dataset-card-item')
  //   const $mapButton = $lastDatasetCard.find('button').first();
  //   $mapButton.should('have.text', 'Add to map');
  //   $mapButton.should('have.class', 'c-button -secondary -compressed -fullwidth');

  //   $mapButton.trigger('click');
  //   $mapButton.should('have.text', 'Active');
  //   $mapButton.should('have.class', 'c-button -primary -compressed -fullwidth');
  // });

  // it('the map legends updates with one item more after clicking on a dataset', () => {
  //   cy.wait('@getDataset');

  //   cy.get('.c-mini-explore').then(($miniExplore) => {
  //     const $firstDatasetList = $miniExplore.find('.c-dataset-card-list').first();
  //     const $mapLegend = $miniExplore.find('.c-legend-map');
  //     const $lastDatasetCard = $firstDatasetList.find('.dataset-card-list-item-container:last-child > .c-dataset-card-item');
  //     const $mapButton = $lastDatasetCard.find('button').first();

  //     expect($mapLegend.find('.vizzuality__c-legend-item')).to.have.length(1);
  //     cy.wait(250);
  //     $mapButton.trigger('click');
  //     expect($mapLegend.find('.vizzuality__c-legend-item')).to.have.length(2);
  //   })
  // });
})
