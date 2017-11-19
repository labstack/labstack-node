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

  download(id, path) {
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

  imageCompress(request) {
    const body = new FormData()
    body.append('file', fs.createReadStream(request.file))
    return this._request('POST', '/image/compress', body)
  }

  imageResize(request) {
    const body = new FormData()
    body.append('file', fs.createReadStream(request.file))
    body.append('width', request.width)
    body.append('height', request.height)
    body.append('crop', request.crop)
    return this._request('POST', '/image/resize', body, false)
  }

  pdfToImage(request) {
    const body = new FormData()
    body.append('file', fs.createReadStream(request.file))
    return this._request('POST', '/pdf/to-image', body, false)
  }

  pdfExtractImages(request) {
    const body = new FormData()
    body.append('file', fs.createReadStream(request.file))
    return this._request('POST', '/pdf/extract-images', body, false)
  }
  
  emailVerify(request) {
    return this._request('POST', '/email/verify', request, true)
  }

  textSummary(request) {
    return this._request('POST', '/text/summary', request, true)
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
