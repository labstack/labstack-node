class CurrencyService {
  constructor(client) {
    this.client = client;
    this.url = "https://currency.labstack.com/api/v1";
  }

  convert(request) {
    return this.client._request(
      "GET",
      `${this.url}/convert/${request.amount}/${request.from}/${request.to}`
    );
  }

  list(request) {
    return this.client._request("GET", `${this.url}/list`);
  }

  rates(request) {
    return this.client._request("GET", `${this.url}/rates`);
  }
}

module.exports = {
  CurrencyService
};
