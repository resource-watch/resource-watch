
describe('', () => {
  beforeEach(() => {
    cy.fixture('auth').then((authPayload) => {
      cy.intercept(
        {
          method: 'POST',
          url: '/local-sign-in',
        },
        authPayload,
      ).as('getAuthPayload');
    });

    cy.visit('/sign-in');
  });

  it('the user ignores the email format for the email field and an error displays', () => {
    cy.get('form').find('input[name="email"]').type('notAnEmail');
    cy.get('p.error').should('contain', 'The field should be an email');
  })

  it('the user keeps empty the email field and a native error displays', () => {
    cy.get('form').find('input[name="email"]').type('{enter}');
    cy.get('input[name="email"]:invalid').should("have.length", 1);
  })

  it('the user types something and then keeps empty the email field and an error displays', () => {
    cy.get('form').find('input[name="email"]').type('something').clear();
    cy.get('p.error').first().should('contain', 'The field is required');
  })

  it('the user keeps empty the password field and a native error displays', () => {
    cy.get('form').find('input[name="password"]').type('{enter}');
    cy.get('input[name="password"]:invalid').should("have.length", 1);
  })

  it('the user types something and then keeps empty the password field and an error displays', () => {
    cy.get('form').find('input[name="password"]').type('something').clear();
    cy.get('p.error').first().should('contain', 'The field is required');
  })

  it('the user goes to sign-in page, fills the form and gets logged', () => {
    cy.get('form').find('input[name="email"]').type('john@doe.com');
    cy.get('form').find('input[name="password"]').type('password1234');
    cy.get('form').find('button[type="submit"]').click();

    cy.wait('@getAuthPayload').then(({ request, response }) => {
      expect(request.body.email).to.eq('john@doe.com');
      expect(request.body.password).to.eq('password1234');

      expect(response.body.email).to.eq('john@doe.com');
      expect(response.body.name).to.eq('John Doe');
    });
  });
})
