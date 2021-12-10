/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/ban-types */

export const maybeGetToken = (
  sessionName: string,
  email: string,
  password: string
) =>
  cy.dataSession({
    name: `${sessionName}Token`,
    setup: () => {
      cy.log('**called setup for maybeGetToken**')
      return cy.getToken(email, password)
    },
    // if validate is true, get the token from cypress-data-session and skip setup
    // if the token is not in cypress-data-session, only then the setup fn is run and we make an api request with cy.getToken
    validate: true,
    shareAcrossSpecs: true
  })
