class Webpage {
  constructor(client) {
    this.client = client
  }

  pdf(request) {
    return this.client._request('GET', '/webpage/pdf', request, null, true)
  }
}

module.exports = Webpage