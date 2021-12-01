/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const fs = require('fs-extra')
const path = require('path')
const packageJson = require('../package.json')

const newPackage = {
  ...packageJson
  // we can `just set these both to src in the main package.json
  // main: './index.js',
  // typings: './index.d.ts'
}

fs.outputFileSync(
  path.resolve(__dirname, '..', 'dist', 'package.json'),
  JSON.stringify(newPackage, null, 2)
)

fs.copy(
  path.resolve(__dirname, '..', 'src', 'index.d.ts'),
  path.resolve(__dirname, '..', 'dist', 'index.d.ts')
)
