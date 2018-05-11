const fs = require('fs')
const path = require('path')
const got = require('got')
const FormData = require('form-data')
const Currency = require('./currency')
const Geocode = require('./geocode')
const Post = require('./post')
const Watermark = require('./watermark')
const Webpage = require('./webpage')

class Client {
  constructor(apiKey) {
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

  currency() {
    return new Currency(this)
  }

  geocode() {
    return new Geocode(this)
  }

  post() {
    return new Post(this)
  }

  watermark() {
    return new Watermark(this)
  }

  Webpage() {
    return new Webpage(this)
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
  
  // compressAudio(request) {
  //   const body = new FormData()
  //   body.append('file', fs.createReadStream(request.file))
  //   return this._request('POST', '/compress/audio', null, body, false)
  // }

  // compressImage(request) {
  //   const body = new FormData()
  //   body.append('file', fs.createReadStream(request.file))
  //   return this._request('POST', '/compress/image', null, body, false)
  // }
  
  // compressPDF(request) {
  //   const body = new FormData()
  //   body.append('file', fs.createReadStream(request.file))
  //   return this._request('POST', '/compress/pdf', null, body, false)
  // }
  
  // compressVideo(request) {
  //   const body = new FormData()
  //   body.append('file', fs.createReadStream(request.file))
  //   return this._request('POST', '/compress/video', null, body, false)
  // }

  // nlpSentiment(request) {
  //   return this._request('GET', '/nlp/sentiment', request, null, true)
  // }

  // nlpSpellcheck(request) {
  //   return this._request('GET', '/nlp/spellcheck', request, null, true)
  // }

  // nlpSummary(request) {
  //   return this._request('GET', '/nlp/summary', request, null, true)
  // }
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
