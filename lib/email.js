class Email {
  constructor(client) {
    this.client = client
  }

  verify(email) {
    return this.client._request('GET', '/email/verify', {email}, null, true)
  }
}

module.exports = Email 