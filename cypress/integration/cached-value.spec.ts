/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as faker from 'faker'

describe('Cached value', () => {
  let superadminToken
  let admin
  let newUser

  before(() => {
    cy.maybeGetToken(
      'superadmin',
      Cypress.env('SUPERADMIN_EMAIL'),
      Cypress.env('SUPERADMIN_PASSWORD')
    ).then((token) => {
      superadminToken = token
    })
  })

  before(() => {
    admin = {
      role: 'admin',
      email: `qa+cy-default-auth-admin@helloextend.com`,
      password: Cypress.env('SUPERADMIN_PASSWORD')
    }
    newUser = {
      role: 'user',
      email: `${faker.datatype.uuid()}@gmail.com`,
      password: 'p@22w0rd'
    }
  })

  const genericAssertions = (user) => {
    cy.log(`userId: **${user.id}**`)
    expect(user.accessToken).to.be.a('string')
    expect(user.id).to.be.a('string')
  }

  it('Existing user (init() may run the first time to cache things), validate() returns true: run validate() recreate() ', () => {
    let sessionToken

    cy.log('run the function once so that the value is cached')
    cy.maybeGetTokenAndUser('adminSession-cache', admin).then((user) => {
      genericAssertions(user)
      sessionToken = user.accessToken
    })

    cy.log('call it a second time')

    cy.maybeGetTokenAndUser('adminSession-cache', admin).then((user) => {
      genericAssertions(user)
      expect(
        user.accessToken,
        'access token acquired should be from the session'
      ).to.equal(sessionToken)
    })
  })

  it(`Not-Existing user (init() may run the first time to cache things).
  Validate() returns false: run validate() onInvalidated() preSetup() setup().
  On second round validate() recreate()`, () => {
    let sessionToken

    cy.log('run the function once so that the value is cached')
    cy.maybeGetTokenAndUser('userSession-cache', newUser).then((user) => {
      genericAssertions(user)
      sessionToken = user.accessToken
    })

    cy.log('call it a second time')

    cy.maybeGetTokenAndUser('userSession-cache', newUser).then((user) => {
      genericAssertions(user)
      expect(
        user.accessToken,
        'access token acquired should be from the session'
      ).to.equal(sessionToken)
      cy.log('clean up the user')
      cy.deleteUser(superadminToken, user.id).its('status').should('equal', 204)
    })
  })
})
