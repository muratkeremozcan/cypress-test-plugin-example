# Cypress Test Plugin Example

![cypress-data-session version](https://img.shields.io/badge/cypress--data--session-1.13.3-brightgreen) ![@bahmutov/cy-api version](https://img.shields.io/badge/@bahmutov/cy--api-1.6.2-brightgreen) ![cypress version](https://img.shields.io/badge/cypress-9.1.0-brightgreen) [![renovate-app badge][renovate-badge]][renovate-app]

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
You can use Github to create a badge: Actions > Workflows > upper right ... > Create Status badge. This will make a badge out of the status of a yml file
[![cypress-store](url-to-worfklow-yml-file/badge.svg?branch=main&event=push)](url-to-worfklow-yml-file)

badge for cypress dashboard (only works with public dashboards)
[![any-name-usually-your-package-dashboard](https://img.shields.io/endpoint?url=https://dashboard.cypress.io/badge/simple/<your-project-id>/main&style=flat&logo=cypress)](https://dashboard.cypress.io/projects/<your-project-id>/runs)

Command Resource Refactoring
src/
At the repo root, create a src folder. Move cypress/support/ folder contents to it. Also move the type definitions at cypress/index.d.ts to the root of the src folder.

src/tsconfig.json
Create a tsconfig.json file at the root.
Include all plugins types you are using in the command files, and include the folder itself with "./"
{ "compilerOptions": { "types": ["@bahmutov/cy-api", "cypress-data-session", "./"] }, "include": ["**/*.ts"], "extends": "../tsconfig.json"}

src/index.ts
Rename the index.js file to inde.ts. Import all the plugins here.
Convert all the commands to functions, export the ones that will be used as commands.
Import them at the index.ts file, and wrap them in Cypress commands. Ex:
import { getToken } from './commands/generic'
Cypress.Commands.add('getToken', getToken)

cypress/tsconfig.json
Update the tsconfig file at the root to include the types from "../src" . You can also remove any types you are not using the spec files anymore, since you already them them from the src folder. Usually a process of elimination is effective here
{ "compilerOptions": { "lib": ["esnext", "dom"], "types": [ "cypress", "cypress-data-session", "@extend/cypress-auth", "../src" ], "allowJs": true, "resolveJsonModule": true }, "include": ["**/*.ts"]}

cypress/support/index.js
Create this file with a one-liner to import. This will import the top level package folder. We previously set package.json "main" to "src" for this reason.
import '../..'

run the spec files, all should be working the same way

./tsconfig.json
In order to run typecheck, you may need to have a subset of the types at the root tsconfig.json. Copy the types from one of the other 2 jsons and follow a process of elimination.

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
