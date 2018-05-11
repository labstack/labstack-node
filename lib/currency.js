class Currency {
  constructor(client) {
    this.client = client
  }

  convert(request) {
    return this.client._request('GET', '/currency/convert', request, null, true)
  }
  
  rates(request) {
    return this.client._request('GET', '/currency/rates', request, null, true)
  }
}

module.exports = Currency