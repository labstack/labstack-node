class Post {
  constructor(client) {
    this.client = client
  }

  verify(request) {
    return this.client._request('GET', '/post/verify', request, null, true)
  }
}

module.exports = Post