class IPService {
  constructor(client) {
    this.client = client;
    this.url = "https://ip.labstack.com/api/v1";
  }

  lookup(request) {
    return this.client._request("GET", `${this.url}/${request.ip}`);
  }
}

module.exports = {
  IPService
};
