class WebpageService {
  constructor(client) {
    this.client = client;
    this.url = "https://webpage.labstack.com/api/v1";
  }

  image(request) {
    return this.client._request("GET", `${this.url}/image`, {
      url: request.url
    });
  }

  pdf(request) {
    return this.client._request("GET", `${this.url}/pdf`, {
      url: request.url
    });
  }
}

module.exports = {
  WebpageService
};
