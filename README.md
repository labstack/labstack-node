<a href="https://labstack.com"><img height="80" src="https://cdn.labstack.com/images/labstack-logo.svg"></a>

## Node.js Client

## Installation

NPM `npm install --save labstack`<br>
Yarn `yarn add labstack`

## Quick Start

[Sign up](https://labstack.com/signup) to get an API key

Create a file `app.js` with the following content:

```js
const {Client, JetMessage } = require('labstack')

const client = new Client('<ACCOUNT_ID>', '<API_KEY>')
const jet = client.jet()
const message = new JetMessage('jack@labstack.com', 'LabStack', 'Hello')
message.body = 'hello'
message.addInline('/tmp/walle.png')
jet.send(message).then(msg => {
}).catch(err => {
})
```

From terminal run your app:

```sh
node app.js
```

## [Docs](https://labstack.com/docs) | [Forum](https://forum.labstack.com)
