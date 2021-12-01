describe('GET token', () => {
  it('should get token', () => {
    cy.getToken(
      Cypress.env('SUPERADMIN_EMAIL'),
      Cypress.env('SUPERADMIN_PASSWORD')
    ).should('not.be.empty')
  })
  it('should maybe get token', () => {
    cy.maybeGetToken(
      'sanitySession',
      Cypress.env('SUPERADMIN_EMAIL'),
      Cypress.env('SUPERADMIN_PASSWORD')
    ).should('not.be.empty')
  })
})
