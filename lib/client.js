const fs = require('fs')
const path = require('path')
const got = require('got')
const FormData = require('form-data');

class Client {
  constructor(apiKey) {
    this.apiURL = 'https://api.labstack.com'
    this.apiKey = apiKey
  }

  _request(method, path, body, json) {
    return got.post(`${this.apiURL}${path}`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`
      },
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

  barcodeGenerate(request) {
    return this._request('POST', '/barcode/generate', request, true)
  }

  barcodeScan(request) {
    const body = new FormData()
    body.append('file', fs.createReadStream(request.file))
    return this._request('POST', '/barcode/scan', body)
  }

  currencyExchange(request) {
    return this._request('POST', '/currency/exchange', request, true)
  }

  dnsLookup(request) {
    return this._request('POST', '/dns/lookup', request, true)
  }

  emailVerify(request) {
    return this._request('POST', '/email/verify', request, true)
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
    body.append('format', request.format)
    return this._request('POST', '/image/resize', body, false)
  }

  imageWatermark(request) {
    const body = new FormData()
    body.append('file', fs.createReadStream(request.file))
    body.append('text', request.text)
    body.append('font', request.font)
    body.append('size', request.size)
    body.append('color', request.color)
    body.append('opacity', request.opacity)
    body.append('position', request.position)
    body.append('margin', request.margin)
    return this._request('POST', '/image/watermark', body, false)
  }

  pdfCompress(request) {
    const body = new FormData()
    body.append('file', fs.createReadStream(request.file))
    return this._request('POST', '/pdf/compress', body, false)
  }

  pdfImage(request) {
    const body = new FormData()
    body.append('file', fs.createReadStream(request.file))
    if (request.extract) {
      // TODO: https://github.com/form-data/form-data/issues/137
      body.append('extract', request.extract.toString())
    }
    return this._request('POST', '/pdf/image', body, false)
  }

  pdfSplit(request) {
    const body = new FormData()
    body.append('file', fs.createReadStream(request.file))
    body.append('pages', request.pages)
    return this._request('POST', '/pdf/split', body, false)
  }


  textSentiment(request) {
    return this._request('POST', '/text/sentiment', request, true)
  }

  textSpellcheck(request) {
    return this._request('POST', '/text/spellcheck', request, true)
  }

  textSummary(request) {
    return this._request('POST', '/text/summary', request, true)
  }

  webpagePDF(request) {
    return this._request('POST', '/webpage/pdf', request, true)
  }

  wordLookup(request) {
    return this._request('POST', '/word/lookup', request, true)
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
