import type { DeepPartial } from 'fishery'
import { APIVersion } from '../api-version'
import { UserFactory } from '../factories/user-factory'
import { User } from '../interfaces/user'

/** sends a POST to auth/login endpoint and yields the response
 * if allowedToFail = true, the response can be a failure response */
export const tokenResponse = (
  email: string,
  password: string,
  allowedToFail = true
) =>
  cy.api({
    url: '/auth/login',
    method: 'POST',
    body: {
      email,
      password
    },
    retryOnStatusCodeFailure: !allowedToFail,
    failOnStatusCode: !allowedToFail
  })

export const getToken = (email: string, password: string) =>
  tokenResponse(email, password, false).its('body').its('accessToken')

/** sends a POST to auth/me endpoint and yields the response
 * if allowedToFail = true, the response can be a failure response */
export const identityResponse = (
  accessToken: string,
  version: APIVersion = APIVersion.default,
  allowedToFail = true
) =>
  cy.api({
    url: '/auth/me',
    method: 'GET',
    headers: {
      'X-Extend-Access-Token': accessToken,
      Accept: `version=${version}`
    },
    retryOnStatusCodeFailure: !allowedToFail,
    failOnStatusCode: !allowedToFail
  })

export const me = (
  accessToken: string,
  version: APIVersion = APIVersion.default
) =>
  identityResponse(accessToken, version, false)
    .its('body')
    .then((user) => ({ ...user, accessToken }))

export const createUser = (
  token: string,
  partialUser?: DeepPartial<User> | undefined,
  version: APIVersion = APIVersion.default
) =>
  cy
    .api({
      url: '/auth/register',
      method: 'POST',
      headers: {
        'X-Extend-Access-Token': token,
        Accept: `version=${version}`
      },
      body: new UserFactory(token).build(partialUser),
      retryOnStatusCodeFailure: true
    })
    .its('body')

export const getUser = (token: string, userId: string) =>
  cy.api({
    url: `/auth/users/${userId}`,
    method: 'GET',
    headers: {
      'X-Extend-Access-Token': token,
      Accept: 'version=default'
    },
    failOnStatusCode: false
  })

export const deleteUser = (token: string, userId: string) => {
  cy.log(`**deleting the user with id ${userId}**`)
  return cy.api({
    url: `/auth/users/${userId}`,
    method: 'DELETE',
    headers: {
      'X-Extend-Access-Token': token,
      Accept: 'version=default'
    },
    retryOnStatusCodeFailure: true
  })
}
