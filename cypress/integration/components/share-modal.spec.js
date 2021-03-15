
describe('a user wants to share the page with a shortened link', () => {
  before(() => {
    cy.intercept(
      {
        method: 'POST',
        url: 'https://api-ssl.bitly.com/v4/shorten',
      },
      {
        "created_at":"2020-09-19T10:55:26+0000",
        "id":"bit.ly/id",
        "link":"https://bit.ly/test",
        "custom_bitlinks":[],
        "long_url":"https://random_url.com/test",
        "archived":false,
        "tags":[],
        "deeplinks":[],
        "references":{
          "group":"https://api-ssl.bitly.com/v4/groups/some_hash"
        }
      },
    ).as('getBitlyLink');
  });

  it('the user gets the shortened link', () => {
    cy.visit('/dashboards/forests');

    cy.get('.page-header-content').find('button[data-cy="share-button"]').click();

    cy.get('.c-share-modal').find('#share-link').then(($btn) => {
      expect($btn.val()).to.eq('https://bit.ly/test');
    });
  });
})
