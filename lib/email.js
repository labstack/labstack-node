class EmailService {
  constructor(client) {
    this.client = client;
    this.url = "https://email.labstack.com/api/v1";
  }

  verify(request) {
    return this.client._request("GET", `${this.url}/verify/${request.email}`);
  }
}

module.exports = {
  EmailService
};
