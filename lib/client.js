const axios = require('axios')
require('promise.prototype.finally').shim()
const {Jet} = require('./jet')

class Client {
  constructor(accountId, apiKey) {
    this.accountId = accountId
    this.apiKey = apiKey
    this.axios = axios.create({
      baseURL: 'https://api.labstack.com',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
  }

  jet() {
    return new Jet(this.axios) 
  }
}

module.exports = {
  Client
}
