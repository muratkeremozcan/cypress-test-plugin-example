# Cypress Test Plugin Example

[![cypress-test-plugin-example](https://github.com/muratkeremozcan/cypress-test-plugin-example/actions/workflows/cypress-test-plugin-example.yml/badge.svg?branch=main&event=push)](https://github.com/muratkeremozcan/cypress-test-plugin-example/actions/workflows/cypress-test-plugin-example.yml)![cypress-data-session version](https://img.shields.io/badge/cypress--data--session-1.13.3-brightgreen)![@bahmutov/cy-api version](https://img.shields.io/badge/@bahmutov/cy--api-1.6.2-brightgreen) ![cypress version](https://img.shields.io/badge/cypress-9.1.0-brightgreen) [![renovate-app badge][renovate-badge]][renovate-app]

How to create an internal test package for your team, in TS, implement custom commands, and use other Cypress plugins.

The example used is a hypothetical test suite for an authentication service. The tests are api tests.

## Create & configure the repo

> You can replicate most of these settings from this repo.

`npm init -y`

Set these `package.json` properties:

```json
...
"main": "src",
"types": "src",
"files": [ "**/*.js", "index.d.ts" ],
...
```

Add scripts, dependencies, devDependencies.

Setup generic repo helpers: eslintrc.js, .nvmrc, prettier, husky, .vscode/settings.json, renovate.json.

[Rename master to main](https://www.git-tower.com/learn/git/faq/git-rename-master-to-main):

```bash
git branch -m master main
# at github/.../settings/branches, switch default branch to main
git push -u origin main
```

Install & open Cypress, implement the commands, tests,` cypress.json`,` cypress.env.json`, `plugins/index.js` like usual. Start with the [default typescript settings](https://docs.cypress.io/guides/tooling/typescript-support#Configure-tsconfig-json). Add secrets to github if using `cypress.env.json`.

## Setup badges

### Renovate badges:

Add anywhere on your readme (bottom).

```markdown
[renovate-badge]: https://img.shields.io/badge/renovate-app-blue.svg
[renovate-app]: https://renovateapp.com/
```

#### Badges for your package.json dependencies

> `npx -p` just installs it on the fly\_

`npx -p dependency-version-badge update-badge <name-of-package> <other-package>`

### Badge for the repo itself

You can use Github to create a badge: Actions > Workflows > click on a workflow > upper right ... > Create Status badge. This will make a badge out of the status of a yml file. Add the query param `?branch=main&event=push` to it to make it only report on main branch's status

```markdown
[![yml-file-name](url-to-worfklow-yml-file/badge.svg?branch=main&event=push)](url-to-worfklow-yml-file)

[![cypress-test-plugin-example](https://github.com/muratkeremozcan/cypress-test-plugin-example/actions/workflows/cypress-test-plugin-example.yml/badge.svg?branch=main&event=push)](https://github.com/muratkeremozcan/cypress-test-plugin-example/actions/workflows/cypress-test-plugin-example.yml)
```

### Badge for cypress dashboard (only works with public dashboards)

```markdown
[![any-name-usually-your-package-dashboard](https://img.shields.io/endpoint?url=https://dashboard.cypress.io/badge/simple/<your-project-id>/main&style=flat&logo=cypress)](https://dashboard.cypress.io/projects/<your-project-id>/runs)
```

## Command Resource Refactoring

If all is working well at this point, Cypress commands have been implemented, you have specs, the repo is setup to your liking, badges are good, push the changes up then proceed. 

At the repo root, create a `src` folder. Move `cypress/support/` folder contents to it. Also move the type definitions at `cypress/index.d.ts` to the root of the src folder.

### Typescript settings

#### `./src/tsconfig.json`

Create a `src/tsconfig.json`.
Include all the plugins types you are using in the command files, and include the folder itself with "./"

```json
{
  "compilerOptions": {
    "types": ["@bahmutov/cy-api", "./"]
  },
  "include": ["**/*.ts"],
  "extends": "../tsconfig.json"
}
```


#### ./src/index.ts
Rename the `index.js` file to `index.ts`. Import all the plugins here.

Convert all the Cypress commands to functions, export the ones that will be used as commands. 

Import them at `index.ts` , and wrap them in Cypress commands.

Not only this gives us cleaner looking functions, but also makes our api more obvious.

```typescript
import '@bahmutov/cy-api/support'
import 'cypress-data-session'

import { getToken, me, createUser } from './commands/generic'
import { maybeGetToken } from './commands/data-session'

Cypress.Commands.add('getToken', getToken)
Cypress.Commands.add('me', me)
Cypress.Commands.add('createUser', createUser)
Cypress.Commands.add('maybeGetToken', maybeGetToken)
```

#### ./cypress/tsconfig.json

The spec files will use Cypress types, and the types from the `./src`. We might also need additional types for independent usage of the plugins in the specs, for example `cypress-data-session` is used to clear the data session in the specs so we need the types here.

```json
{
  "compilerOptions": {
    "types": ["cypress", "cypress-data-session", "../src/"]
  },
  "include": ["**/*.ts"],
  "extends": "../tsconfig.json"
}
```

#### ./tsconfig.json

Update `tsconfig.json` at the project root to include the types from `./src` . 

In order to run typecheck, you may need to have a subset of the types at the root tsconfig.json. Copy the types from one of the other 2 jsons and follow a process of elimination.

```json
"types": [
  "cypress",
  "node",
  "@bahmutov/cy-api",
  "cypress-data-session",
  "./src"
]
```

### Continue with the command resource refactor

#### cypress/support/index.js
Create this file with a one-liner import. This will import the top level package folder. We previously set `package.json`  "main"` to `"src"` for this reason.

```typescript
import '../..'
```

Run the spec files, all should be working the same way



---

install the plugin at another repo

yarn add -D <plugin-name>
or
npm i -D <plugin-name>

setup the types at cypress/tsconfig.json

{
"compilerOptions": {
"types": ["cypress", "<plugin-name>"],
"target": "esnext",
"lib": ["esnext", "dom"],
"allowJs": true,
"resolveJsonModule": true
},
"include": ["**/*.ts"]
}

import the package at cypress/support/index.js  
import '<package-name>'



[renovate-badge]: https://img.shields.io/badge/renovate-app-blue.svg
[renovate-app]: https://renovateapp.com/
