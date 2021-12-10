/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { DeepPartial } from 'fishery'
import { UserFactory } from '../factories/user-factory'
import { User } from '../interfaces/user'

/** Picks n random items from an array */
export const pickNRandom = (n, arr) =>
  arr.sort(() => Math.random() - Math.random()).slice(0, n)

export const getToken = (email: string, password: string) =>
  new Cypress.Promise((resolve) => resolve(`token-for-${email}-${password}`))

export const createUser = (token, partialUser) =>
  new Cypress.Promise((resolve) =>
    resolve(new UserFactory(token).build(partialUser))
  )

export const createUserWithToken = (accessToken, partialUser) =>
  createUser(accessToken, partialUser).then((user) =>
    // @ts-ignore
    getToken(user.email, partialUser.password).then((token) => ({
      // @ts-ignore
      ...user,
      accessToken: token
    }))
  )

export const me = (
  accessToken: string,
  partialUser: DeepPartial<User> | undefined
) =>
  cy
    .fixture('users')
    .then(
      (users) => users.filter((user) => user.email === partialUser.email)[0]
    )
    .then((user) => ({ ...user, accessToken }))
