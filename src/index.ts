/* eslint-disable @typescript-eslint/ban-ts-comment */
import '@bahmutov/cy-api/support'
import 'cypress-data-session'

import { getToken, me, createUser } from './commands/generic'

import { maybeGetToken } from './commands/data-session'

// we have to disable some types because we are making up fake responses for thins that look like real life

// @ts-ignore
Cypress.Commands.add('getToken', getToken)
// @ts-ignore
Cypress.Commands.add('me', me)
// @ts-ignore
Cypress.Commands.add('createUser', createUser)
Cypress.Commands.add('maybeGetToken', maybeGetToken)
