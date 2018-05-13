class Currency {
  constructor(client) {
    this.client = client
  }

  convert(amount, from, to) {
    return this.client._request('GET', '/currency/convert', {
      amount,
      from,
      to
    }, null, true)
  }
  
  rates(base) {
    return this.client._request('GET', '/currency/rates', {base}, null, true)
  }
}

module.exports = Currency