/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const fs = require('fs-extra')
const path = require('path')
const packageJson = require('../package.json')

const newPackage = {
  ...packageJson
}

// whether dist/package.json exists or not, get it created and synced with root package.json
fs.outputFileSync(
  path.resolve(__dirname, '..', 'dist', 'package.json'),
  JSON.stringify(newPackage, null, 2)
)

// copy the types and dependency types
fs.copy(
  path.resolve(__dirname, '..', 'src', 'index.d.ts'),
  path.resolve(__dirname, '..', 'dist', 'index.d.ts')
)

fs.copy(
  path.resolve(__dirname, '..', 'src', 'api-version.ts'),
  path.resolve(__dirname, '..', 'dist', 'api-version.ts')
)

fs.copy(
  path.resolve(__dirname, '..', 'src', 'api-version.ts'),
  path.resolve(__dirname, '..', 'dist', 'api-version.ts')
)
