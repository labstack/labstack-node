class Geocode {
  constructor(client) {
    this.client = client
  }

  address(request) {
    return this.client._request('GET', '/geocode/address', request, null, true)
  }
  
  ip(request) {
    return this.client._request('GET', '/geocode/ip', request, null, true)
  }

  reverse(request) {
    return this.client._request('GET', '/geocode/reverse', request, null, true)
  }
}

module.exports = Geocode