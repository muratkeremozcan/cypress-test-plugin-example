# Cypress Test Plugin Example

[![renovate-app badge][renovate-badge]][renovate-app] ![cypress version](https://img.shields.io/badge/cypress-9.1.0-brightgreen)

[renovate-badge]: https://img.shields.io/badge/renovate-app-blue.svg
[renovate-app]: https://renovateapp.com/

create & configure the repo
npm init -y

"main": "src",  
"types": "src",  
"files": [ "**/*.js", "index.d.ts" ],

add scripts, dependencies, devDependencies

eslintrc.js, .nvmrc, prettier, husky, .vscode/settings.json, renovate.json

rename master
(reference https://www.git-tower.com/learn/git/faq/git-rename-master-to-main)
git branch -m master main
at github/.../settings/branches, switch default branch to main
git push -u origin main

configure Cypress and create tests
start a new branch,
use default typescript settings https://docs.cypress.io/guides/tooling/typescript-support#Configure-tsconfig-json
open cypress, implement the commands, tests, cypress.json, cypress.env.json, plugins/index.js like usual. Add secrets to github if using cypress.env.json

setup badges
renovate
Add anywhere on your readme (bottom)
[renovate-badge]: https://img.shields.io/badge/renovate-app-blue.svg
[renovate-app]: https://renovateapp.com/
Add to the top
[![any badge name] followed by the above links
[![renovate-app badge][renovate-badge]][renovate-app]

badges for your package.json dependencies
for the badges for dependencies / devDependencies (npx -p just installs it on the fly\_
npx -p dependency-version-badge update-badge <name-of-package> <other-package>

badge for the repo itself
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
