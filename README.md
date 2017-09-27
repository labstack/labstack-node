<a href="https://labstack.com"><img height="80" src="https://cdn.labstack.com/images/labstack-logo.svg"></a>

## Node.js Client

## Installation

NPM `npm install --save labstack`<br>
Yarn `yarn add labstack`

## Quick Start

[Sign up](https://labstack.com/signup) to get an API key

Create a file `app.js` with the following content:

```js
const {Client, ApiError} = require('labstack')

const client = new Client('<ACCOUNT_ID>', '<API_KEY>')

client.optimizeJpeg({file: '<PATH>'})
.then(output => {
   console.log(output)
})
.catch(error => {
   console.error(error)
})
```

From terminal run your app:

```sh
node app.js
```

## [Documentation](https://labstack.com/docs) | [Forum](https://forum.labstack.com)
