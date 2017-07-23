const axios = require('axios')
require('promise.prototype.finally').shim()
const {Email} = require('./email')
const {Log} = require('./log')
const {Store} = require('./store')

class Client {
  constructor(key) {
    this.axios = axios.create({
      baseURL: 'https://api.labstack.com',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
  }

  email() {
    return new Email(this.axios) 
  }

  log() {
    return new Log(this.axios)
  }

  store() {
    return new Store(this.axios)
  }
}

module.exports = {
  Client
}
