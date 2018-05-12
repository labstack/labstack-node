class Currency {
  constructor(client) {
    this.client = client
  }

  convert(from, to, amount) {
    return this.client._request('GET', '/currency/convert', {
      from,
      to,
      amount
    }, null, true)
  }
  
  rates(base) {
    return this.client._request('GET', '/currency/rates', {base}, null, true)
  }
}

module.exports = Currency