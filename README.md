<a href="https://labstack.com"><img height="80" src="https://cdn.labstack.com/images/labstack-logo.svg"></a>

## Node.js Client

## Installation

NPM `npm install --save labstack`<br>
Yarn `yarn add labstack`

## Quick Start

[Sign up](https://labstack.com/signup) to get an API key

Create a file `app.js` with the following content:

```js
const {Client, APIError} = require('labstack')

const client = new Client('<API_KEY>')
const geocode = client.geocode()

geocode.address('eiffel tower')
.then(response => {
  console.info(response)
})
.catch(error => {
  console.error(error)
})
```

From terminal run your app:

```sh
node app.js
```

## [Docs](https://labstack.com/docs) | [Forum](https://forum.labstack.com)
