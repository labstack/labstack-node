class Geocode {
  constructor(client) {
    this.client = client
  }

  address(location, options) {
    return this.client._request('GET', '/geocode/address', Object.assign({
      location
    }, options) , null, true)
  }
  
  ip(ip, options) {
    return this.client._request('GET', '/geocode/ip', Object.assign({
      ip
    }, options) , null, true)
  }

  reverse(latitude, longitude, options) {
    return this.client._request('GET', '/geocode/reverse', Object.assign({
      latitude,
      longitude
    }, options), null, true)
  }
}

module.exports = Geocode