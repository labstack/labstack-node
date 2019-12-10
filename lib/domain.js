class DomainService {
  constructor(client) {
    this.client = client;
    this.url = "https://domain.labstack.com/api/v1";
  }

  dns(request) {
    return this.client._request(
      "GET",
      `${this.url}/${request.type}/${request.domain}`
    );
  }

  search(request) {
    return this.client._request("GET", `${this.url}/search`, {
      q: request.q
    });
  }

  status(request) {
    return this.client._request("GET", `${this.url}/status/${request.domain}`);
  }

  whois(request) {
    return this.client._request("GET", `${this.url}/whois/${request.domain}`);
  }
}

module.exports = {
  DomainService
};
