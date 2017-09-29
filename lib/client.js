const fs = require('fs')
const path = require('path')
const got = require('got')
const FormData = require('form-data');

class Client {
  constructor(apiKey) {
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

  downloadFile(id, path) {
    return new Promise((resolve, reject) => {
      got.stream(`https://api.labstack.com/download/${id}`)
      .pipe(fs.createWriteStream(path))
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

  optimizeGif(request) {
    const body = new FormData()
    body.append('file', fs.createReadStream(request.file))
    return this._request('POST', '/optimize-gif', body)
  }
  
  optimizeJpg(request) {
    const body = new FormData()
    body.append('file', fs.createReadStream(request.file))
    return this._request('POST', '/optimize-jpg', body)
  }

  optimizePng(request) {
    const body = new FormData()
    body.append('file', fs.createReadStream(request.file))
    return this._request('POST', '/optimize-png', body, false)
  }

  optimizeSvg(request) {
    const body = new FormData()
    body.append('file', fs.createReadStream(request.file))
    return this._request('POST', '/optimize-svg', body, false)
  }

  pdfImages(request) {
    const body = new FormData()
    body.append('file', fs.createReadStream(request.file))
    return this._request('POST', '/pdf-images', body, false)
  }

  pdfToImage(request) {
    const body = new FormData()
    body.append('file', fs.createReadStream(request.file))
    return this._request('POST', '/pdf-to-image', body, false)
  }

  sendEmail(request) {
    return this._request('POST', '/send-email', request, true)
  }

  textSummary(request) {
    return this._request('POST', '/text-summary', request, true)
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
