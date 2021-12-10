/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { DeepPartial } from 'fishery'
import type { APIVersion } from './api-version'
import type { User } from './interfaces/user'

export {}

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      /** sends a POST to auth/login endpoint and yields the access token
       * ```
       * cy.getToken(Cypress.env('SUPERADMIN_EMAIL'), Cypress.env('SUPERADMIN_PASSWORD')).then(token => ..)
       * ```
       * */
      getToken(
        extendEmail: string,
        extendPassword: string
      ): Cypress.Chainable<any>

      /** sends a POST to auth/login endpoint and yields the response
       * allowedToFail */
      getTokenResponse(email: string, password: string): Cypress.Chainable<any>

      /** takes in accessToken, pings /me and yields user with accessToken */
      me(accessToken: string, version?: APIVersion): Cypress.Chainable<any>

      /** creates a user and yields the response body */
      createUser(
        token: string,
        partialUser: DeepPartial<User> | undefined,
        version?: APIVersion
      ): Cypress.Chainable<any>

      createUserWithToken()

      /// cypress-data-session utilities ///

      /** If the unique key for the token is in the cypress-data-session,
       * then skip requesting for the token and instead re-use the unique cypress-data-session key.
       * Otherwise, make a request to get the token
       *
       * ```javascript
       * cy.maybeGetToken('superadmin', Cypress.env('SUPERADMIN_EMAIL'), Cypress.env('SUPERADMIN_PASSWORD'),
       * ```
       */
      maybeGetToken(
        sessionName: string,
        email: string,
        password: string
      ): Cypress.Chainable<any>

      /** First determine if a user exists by checking their token response (preSetup() ).
       * If the user exists, use it for the test (setup () ), but also store it for the next run (as the argument to validate(user) ).
       * On subsequent runs, determine if session data should be re-used, by checking if the user exists (validate(user) ).
       * If the user exists, then re-use the session data and skip preSetup & setup.
       * Otherwise, call preSetup & setup from scratch.
       * */
      maybeGetTokenAndUser(
        sessionName: string,
        partialUser: DeepPartial<User> | undefined
      ): Cypress.Chainable<any>
    }
  }
}
