const fs = require('fs')
const path = require('path')
const got = require('got')
const FormData = require('form-data');

class Client {
  constructor(accountID, apiKey) {
    this.accountID = accountID
    this.apiURL = 'https://api.labstack.com'
    this.apiKey = apiKey
  }

  _request(method, path, query, body, json) {
    return got(`${this.apiURL}${path}`, {
      method,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`
      },
      query,
      body,
      json
    })
    .then(response => {
      if (json) {
        return response.body
      }
      return JSON.parse(response.body)
    })
    .catch(error => {
      if (error instanceof got.HTTPError) {
        const body = JSON.parse(error.response.body)
        throw new APIError(body.code, body.message)
      } else {
        throw new APIError(0, error)
      }
    })
  }

  download(id, path) {
    return new Promise((resolve, reject) => {
      got.stream(`${this.apiURL}/download/${id}`)
      .pipe(fs.createWriteStream(path))
      .on('response', () => {
        resolve()
      })
      .on('error', (error, body, response) => {
        if (error instanceof got.HTTPError) {
          const body = JSON.parse(response.body)
          reject(new APIError(body.code, body.message))
        } else {
          reject(new APIError(0, error))
        }
      })
    })
  }

  currencyConvert(request) {
    return this._request('GET', '/currency/convert', request, null, true)
  }
  
  currencyRates(request) {
    return this._request('GET', '/currency/rates', request, null, true)
  }

  emailVerify(request) {
    return this._request('GET', '/email/verify', request, null, true)
  }

  geocodeAddress(request) {
    return this._request('GET', '/geocode/address', request, null, true)
  }
  
  geocodeIP(request) {
    return this._request('GET', '/geocode/ip', request, null, true)
  }

  geocodeReverse(request) {
    return this._request('GET', '/geocode/reverse', request, null, true)
  }
  
  compressAudio(request) {
    const body = new FormData()
    body.append('file', fs.createReadStream(request.file))
    return this._request('POST', '/compress/audio', null, body, false)
  }

  compressImage(request) {
    const body = new FormData()
    body.append('file', fs.createReadStream(request.file))
    return this._request('POST', '/compress/image', null, body, false)
  }
  
  compressPDF(request) {
    const body = new FormData()
    body.append('file', fs.createReadStream(request.file))
    return this._request('POST', '/compress/pdf', null, body, false)
  }
  
  compressVideo(request) {
    const body = new FormData()
    body.append('file', fs.createReadStream(request.file))
    return this._request('POST', '/compress/video', null, body, false)
  }

  watermarkImage(request) {
    const body = new FormData()
    body.append('file', fs.createReadStream(request.file))
    body.append('text', request.text)
    body.append('font', request.font)
    body.append('size', request.size)
    body.append('color', request.color)
    body.append('opacity', request.opacity)
    body.append('position', request.position)
    body.append('margin', request.margin)
    return this._request('POST', '/image/watermark', null, body, false)
  }

  webpagePDF(request) {
    return this._request('GET', '/webpage/pdf', request, null, true)
  }
  
  nlpSentiment(request) {
    return this._request('GET', '/nlp/sentiment', request, null, true)
  }

  nlpSpellcheck(request) {
    return this._request('GET', '/nlp/spellcheck', request, null, true)
  }

  nlpSummary(request) {
    return this._request('GET', '/nlp/summary', request, null, true)
  }
}

class APIError extends Error {
  constructor(code, message) {
    super(message)
    this.code = code
    Error.captureStackTrace(this, APIError)
    this.name = this.constructor.name
  }
}

module.exports = {
  Client,
  APIError
}
