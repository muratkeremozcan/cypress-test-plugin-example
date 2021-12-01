/* eslint-disable @typescript-eslint/ban-types */

import type { DeepPartial } from 'fishery'
import { APIVersion } from '../api-version'
import { User } from '../interfaces/user'
import {
  getToken,
  me,
  tokenResponse,
  createUser,
  identityResponse
} from './generic'

export const maybeGetToken = (
  sessionName: string,
  email: string,
  password: string
) =>
  cy.dataSession({
    name: `${sessionName}Token`,
    setup: () => {
      cy.log('**called setup for maybeGetToken**')
      return getToken(email, password)
    },
    // if validate is true, get the token from cypress-data-session and skip setup
    // if the token is not in cypress-data-session, only then the setup fn is run and we make an api request with cy.getToken
    validate: true,
    shareAcrossSpecs: true
  })

/** Decorates the user with a password */
const addPasswordToUser = (
  accessToken: string,
  partialUser: DeepPartial<User>
) =>
  me(accessToken).then((user) => ({ ...user, password: partialUser.password }))

/** Executes if the arg passed in is a function, else returns false  */
const executeFn = (fn: Function | undefined) =>
  typeof fn === 'function' ? fn() : false

/** Checks that there is a token response for a user. If there is a response, decorates the user with a password
 * Else, executes a function to create a user or returns false */
const checkUser = (partialUser: DeepPartial<User>, fn?: Function) =>
  tokenResponse(partialUser.email, partialUser.password).then((response) =>
    response.body?.accessToken
      ? addPasswordToUser(response.body.accessToken, partialUser)
      : executeFn(fn)
  )

// TODO: [DEVXTEST-470] Right now this only works if the password comes in with the partialUser
/** creates a user and yields a user which includes an accessToken */
export const createUserWithToken = (
  accessToken: string,
  partialUser: DeepPartial<User>,
  version: APIVersion = APIVersion.default
) =>
  createUser(accessToken, partialUser, version).then((user) =>
    getToken(user.email, partialUser.password).then((token) => ({
      ...user,
      accessToken: token
    }))
  )

// TODO: [DEVXTEST-470] Right now this only works if the password comes in with the partialUser
export const maybeGetTokenAndUser = (
  sessionName: string,
  partialUser: DeepPartial<User>
) =>
  cy.dataSession({
    name: `${sessionName}`,

    init: () => {
      cy.log(
        `**init()**: runs when there is nothing in cache. Yields the value to validate().
          Checks something, for ex: is there a token response for the email/pw combo?`
      )

      return checkUser(partialUser)
    },

    validate: (maybeUser) => {
      cy.log(
        '**validate()**: gets passed what init() yields, or gets passed a cached value'
      )
      cy.log('maybeUser is', maybeUser)

      return identityResponse(maybeUser.accessToken)
        .its('body')
        .then((body) => body.id != null)
        .then(Boolean)
    },

    preSetup: () => {
      cy.log(`**preSetup()**: prepares data for setup function(). Does not get anything passed to it.
        For example: see if we can get a token before creating a user in setup()`)
      return maybeGetToken(
        'superadminSession',
        Cypress.env('SUPERADMIN_EMAIL'),
        Cypress.env('SUPERADMIN_PASSWORD')
      )
    },

    setup: (superAdminToken: string) => {
      cy.log(`**setup()**: if there is no user, create one as superadmin.
        Gets passed in what is yielded from preSetup()
        *also gets called after onInvalidated() (workaround)`)

      // workaround to a problem we cannot resolve: validate() returns true, but we get invalidated()
      // because a parent session has been recomputed. May happen on rare tests (ex: cached-value.spec) when we close a test and then re-run it.
      return checkUser(partialUser, () =>
        createUserWithToken(superAdminToken, partialUser)
      )
    },

    recreate: (user) => {
      cy.log(
        '**recreate()**: gets passed what validate() yields if validate is successful'
      )
      cy.log('recreated user is', user)
      return Promise.resolve(user)
    },

    onInvalidated: () => {
      cy.log(
        `**onInvalidated**: runs when validate() returns false.
           Will be called before the "setup" function executes.
           Clearing session: ${sessionName}'
          `
      )
      Cypress.clearDataSession(sessionName)
    },

    shareAcrossSpecs: true
  })
