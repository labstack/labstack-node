const fs = require('fs')
const path = require('path')
const got = require('got')
const FormData = require('form-data');

class Client {
  constructor(accountId, apiKey) {
    this.accountId = accountId
    this.apiKey = apiKey
  }

  _request(method, path, body, json) {
    return got.post(`https://api.labstack.com${path}`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`
      },
      body,
      json
    })
    .then(response => {
      if (response.body) {
        return JSON.parse(response.body)
      }
    })
    .catch(error => {
      if (error instanceof got.HTTPError) {
        const body = JSON.parse(error.response.body)
        throw new ApiError(body.code, body.message)
      } else {
        throw new ApiError(0, error)
      }
    })
  }

  download(url, file) {
    return new Promise((resolve, reject) => {
      got.stream(url)
      .pipe(fs.createWriteStream(file))
      .on('response', () => {
        resolve()
      })
      .on('error', (error, body, response) => {
        if (error instanceof got.HTTPError) {
          const body = JSON.parse(response.body)
          reject(new ApiError(body.code, body.message))
        } else {
          reject(new ApiError(0, error)) 
        }
      })
    })
  }

  optimizeGif(input) {
    const body = new FormData()
    body.append('file', fs.createReadStream(input.file))
    return this._request('POST', '/optimize-gif', body)
  }
  
  optimizeJpeg(input) {
    const body = new FormData()
    body.append('file', fs.createReadStream(input.file))
    return this._request('POST', '/optimize-jpeg', body)
  }

  optimizePng(input) {
    const body = new FormData()
    body.append('file', fs.createReadStream(input.file))
    return this._request('POST', '/optimize-png', body, false)
  }

  optimizeSvg(input) {
    const body = new FormData()
    body.append('file', fs.createReadStream(input.file))
    return this._request('POST', '/optimize-svg', body, false)
  }

  pdfImages(input) {
    const body = new FormData()
    body.append('file', fs.createReadStream(input.file))
    return this._request('POST', '/pdf-images', body, false)
  }

  pdfToImage(input) {
    const body = new FormData()
    body.append('file', fs.createReadStream(input.file))
    return this._request('POST', '/pdf-to-image', body, false)
  }

  sendEmail(input) {
    return this._request('POST', '/send-email', input, true)
  }
}

class ApiError extends Error {
  constructor(code, message) {
    super(message)
    this.code = code
    Error.captureStackTrace(this, ApiError)
    this.name = this.constructor.name
  }
}

module.exports = {
  Client,
  ApiError
}
