# babel-env [![npm version](https://img.shields.io/npm/v/@elselabs/babel-env.svg?style=flat-square)](https://www.npmjs.com/package/@elselabs/babel-env) [![npm downloads](https://img.shields.io/npm/dm/@elselabs/babel-env.svg?style=flat-square)](https://www.npmjs.com/package/@elselabs/babel-env)
A flexible Babel plugin that loads environment variables for multiple environments.

# Installation
```
npm i @elselabs/babel-env
```
Add `@elselabs/babel-env` to the plugins list inside `.babelrc` **or** `babel.config.js`, depending on which config used by your project. ([Babel configuration docs link](https://babeljs.io/docs/en/config-files))
```
// .babelrc
{
  "plugins": ["module:@elselabs/babel-env"]
}

// babel.config.js
module.exports = {
  plugins: ['module:@elselabs/babel-env'],
}
```
**NOTE:** Older versions of babel (< 7) do not require the `module:` prefix.

# Usage
By default this package reads a `.env` file inside the project root folder.
```
API_KEY=ipsum
```
And allows you to import these variables in your JS.
```
import { API_KEY } from '@elselabs/babel-env';
console.log(API_KEY)

// or 

import config from '@elselabs/babel-env';
console.log(config.API_KEY)
```
### Handling different environments
By default this package reads the `BABEL_ENV` environment variable to determine which `.env` to read. Therefore, if you set `export BABEL_ENV=production`, it will look for a file named `.env.production`.

The **environment variable**, **file format**, **file directory** and **import module name** are all configurable.

### Configuration

- `environmentVariable` - By default uses the `BABEL_ENV` environment variable. 

You may want to override the environment variable used to determine which environment your compiling. In some cases like `react-native-cli`, it uses `BABEL_ENV` and sets it to either `development` or `production`. As a result, its difficult to compile for another environments like `staging`, `test`, etc. Alternatively, you can create a custom environment variable and have it use that instead.

- `moduleName` - By default the import name is `@elselabs/babel-env`.
- `directory` - By default uses the root project folder. 
- `fileFormat` - By default uses `.env`.

```
// .babelrc example
{
  "plugins": [
      ["module:@elselabs/babel-env", 
        { 
          "environmentVariable": "", 
          "moduleName": "",
          "directory": "",
          "fileFormat": ""
        }
    ]
  ]
}

// babel.config.js example
module.exports = {
  plugins: [
    [
      'module:@elselabs/babel-env',
      {environmentVariable: '', moduleName: '', fileFormat: '', directory: ''},
    ],
  ],
};

```
