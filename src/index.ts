import '@bahmutov/cy-api/support'
import 'cypress-data-session'

import {
  getToken,
  me,
  createUser,
  getUser,
  deleteUser
} from './commands/generic'

import { maybeGetToken, maybeGetTokenAndUser } from './commands/data-session'

Cypress.Commands.add('getToken', getToken)
Cypress.Commands.add('me', me)
Cypress.Commands.add('createUser', createUser)
Cypress.Commands.add('getUser', getUser)
Cypress.Commands.add('deleteUser', deleteUser)
Cypress.Commands.add('maybeGetToken', maybeGetToken)
Cypress.Commands.add('maybeGetTokenAndUser', maybeGetTokenAndUser)
