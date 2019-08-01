const got = require("got");
const { CurrencyService } = require("./currency");
const { EmailService } = require("./email");
const { DomainService } = require("./domain");
const { IPService } = require("./ip");
const { WebpageService } = require("./webpage");

class Client {
  constructor(key) {
    this.key = key;
  }

  _request(method, url, query, body, json) {
    console.log(method, url);
    return got(url, {
      method,
      headers: {
        Authorization: `Bearer ${this.key}`
      },
      query,
      body,
      json
    })
      .then(response => {
        if (json) {
          return response.body;
        }
        return JSON.parse(response.body);
      })
      .catch(error => {
        if (error instanceof got.HTTPError) {
          const body = JSON.parse(error.response.body);
          throw new LabStackError(body.code, body.message);
        } else {
          throw new LabStackError(0, error);
        }
      });
  }

  currency() {
    return new CurrencyService(this);
  }

  domain() {
    return new DomainService(this);
  }

  email() {
    return new EmailService(this);
  }

  ip() {
    return new IPService(this);
  }

  webpage() {
    return new WebpageService(this);
  }
}

class LabStackError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
    Error.captureStackTrace(this, LabStackError);
    this.name = this.constructor.name;
  }
}

module.exports = {
  Client,
  LabStackError
};
