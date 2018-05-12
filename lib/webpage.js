class Webpage {
  constructor(client) {
    this.client = client
  }

  pdf(url, options) {
    return this.client._request('GET', '/webpage/pdf', Object.assign({
      url  
    }, options), null, true)
  }
}

module.exports = Webpage