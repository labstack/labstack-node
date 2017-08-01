<a href="https://labstack.com"><img height="80" src="https://cdn.labstack.com/images/labstack-logo.svg"></a>

## Node.js Client

## Installation

NPM `npm install --save labstack`<br>
Yarn `yarn add labstack`

## Quick Start

[Sign up](https://labstack.com/signup) to an get API key

Create a file `app.js` with the following content:

```js
const {Client} = require('labstack')

const client = new Client('<API_KEY>')
const store = client.store()
store.insert('users', {
  name: 'Jack',
  location: 'Disney'
}).then(doc => {
  console.log(doc)
}).catch(err => {
  console.error(err)
})
```

From terminal run your app:

```sh
node app.js
```

## [Docs](https://labstack.com/docs)
