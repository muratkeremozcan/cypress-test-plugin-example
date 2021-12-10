import { pickNRandom } from './../../src/commands/generic'
/* eslint-disable @typescript-eslint/ban-ts-comment */

describe('command tests - test the lego blocks that will build our uber function', () => {
  let admin

  before(() => {
    admin = {
      role: 'admin',
      email: `auth-admin@gmail.com`,
      password: 'p@22w0rd'
    }
  })
  it('cy.getToken() should get a token', () => {
    cy.getToken('email', 'pw').should('eq', 'token-for-email-pw')
  })

  it('cy.createUser() should create a user', () => {
    cy.createUser('someSuperToken', admin)
      .its('email')
      .should('eq', 'auth-admin@gmail.com')
  })

  it('cy.maybeGetToken() should try to get a token from session, if the token is not in then session then calls setup()', () => {
    // if we run it twice, it will not call setup
    cy.maybeGetToken('fakeDataSession', 'email', 'pw').should(
      'eq',
      'token-for-email-pw'
    )
  })

  it('cy.me() takes in an accessToken, (assume it pings an identity endpoint), yields the user, enhances it with an accessToken', () => {
    cy.me('specialTokenForUser', admin).should((user) => {
      expect(user.email).to.equal('auth-admin@gmail.com')
      expect(user.accessToken).to.equal('specialTokenForUser')
    })

    const existingUser = {
      role: 'user',
      email: 'anotherUser@gmail.com'
    }
    // @ts-ignore
    cy.me('specialTokenForAnotherUser', existingUser).should((user) => {
      expect(user.email).to.equal('anotherUser@gmail.com')
      expect(user.accessToken).to.equal('specialTokenForAnotherUser')
    })
  })

  it('picks a random item from a simple array', () => {
    const items = ['a', 'b', 'c']
    const item = pickNRandom(1, items)

    expect(items).to.include(`${item}`)
    expect(item).to.have.length(1)
  })

  it('picks a random item from a complex array', () => {
    const items = [
      {
        body: {
          accessToken: `token`
        }
      },
      null
    ]
    const item = pickNRandom(1, items)[0]

    cy.wrap(item).should('be.oneOf', items)
  })
})
