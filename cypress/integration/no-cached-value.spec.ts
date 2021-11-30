/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as faker from 'faker'

describe('No Cached value, always calls init() first', () => {
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
  beforeEach(() => {
    Cypress.clearDataSession('adminSession-no-cache')
    Cypress.clearDataSession('userSession-no-cache')
  })

  it('Existing user / validate() returns true: should run init() validate() recreate()', () => {
    let sessionToken

    cy.maybeGetTokenAndUser('adminSession-no-cache', admin).then((user) => {
      genericAssertions(user)
      sessionToken = user.accessToken
    })

    cy.maybeGetTokenAndUser('adminSession-no-cache', admin).then((user) => {
      genericAssertions(user)
      expect(
        user.accessToken,
        'access token acquired should be from the session'
      ).to.equal(sessionToken)
    })
  })

  it('New user / validate() returns false: should run init() validate() preSetup() setup()', () => {
    let sessionToken

    cy.maybeGetTokenAndUser('userSession-no-cache', newUser).then((user) => {
      genericAssertions(user)
      sessionToken = user.accessToken
    })

    cy.maybeGetTokenAndUser('userSession-no-cache', newUser).then((user) => {
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
