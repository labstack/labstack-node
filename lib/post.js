class Post {
  constructor(client) {
    this.client = client
  }

  verify(email) {
    return this.client._request('GET', '/post/verify', {email}, null, true)
  }
}

module.exports = Post