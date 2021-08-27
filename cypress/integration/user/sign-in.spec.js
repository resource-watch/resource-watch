describe('Sign In', () => {
  beforeEach(() => {
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

    cy.url().should('include', '/myrw/widgets/my_widgets')

    // verifies user session is established
    cy.getCookie('next-auth.session-token').should('not.to.be.null');
    cy.getCookie('next-auth.csrf-token').should('not.to.be.null');
  });
})
