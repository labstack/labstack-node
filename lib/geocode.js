class Geocode {
  constructor(client) {
    this.client = client
  }

  address(location, options) {
    return this.client._request('GET', '/geocode/address', Object.assign({
      location
    }, options) , null, true)
  }
  
  ip(ip) {
    return this.client._request('GET', '/geocode/ip', {ip}, null, true)
  }

  reverse(longitude, latitude, options) {
    return this.client._request('GET', '/geocode/reverse', Object.assign({
      longitude,
      latitude
    }, options), null, true)
  }
}

module.exports = Geocode