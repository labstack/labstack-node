<a href="https://labstack.com"><img height="80" src="https://cdn.labstack.com/images/labstack-logo.svg"></a>

## Node.js Client

## Installation

NPM `npm install --save labstack`<br>
Yarn `yarn add labstack`

## Quick Start

[Sign up](https://labstack.com/signup) to an get API key

Create a file `app.js` with the following content:

```js
const {Client, StoreError} = require('labstack')

const client = new Client('<API_KEY>')
const store = client.store()
store.insert('foo', 'bar').then(entry => {
}).catch(StoreError, error => {
}
```

From terminal run your app:

```sh
node app.js
```

This will insert an entry `foo` with value `bar` into the datastore.

## [Docs](https://labstack.com/docs)
