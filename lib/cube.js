const got = require('got')

class Cube {
  constructor(key, options) {
    this._started = false
    this.url = 'https://api.labstack.com/cube'
    this.key = key
    options = {} || options
    this.batchSize = options.batchSize || 60
    this.dispatchInterval = options.dispatchInterval || 60
    this.activeRequests = 0
    this.requests = []
  }

  _requestID(request, response) {
    return request.headers['x-request-id'] ||
      response._headers['x-request-id']
  }
  
  _realIP(request) {
    let ip = request.headers['x-forwarded-for'] ||
    request.headers['x-real-ip'] ||
    request.connection.remoteAddress
    if (Array.isArray(ip)) {
      return ip.split(', ')[0]
    } else {
      return ip
    }
  }
  
  _resetRequests() {
    this.requests.length = 0
  }
  
  _dispatch() {
    if (!this.requests.length) {
      return
    }

    // TODO: handler error
    got.post(this.url, {
      headers: {
        'Authorization': `Bearer ${this.key}`
      },
      body: this.requests,
      json: true
    }).then(response => {
    }).catch(error => {
      console.error(error)
      // if (error instanceof got.HTTPError) {
      //   const body = JSON.parse(error.response.body)
      //   throw new Error(body.code, body.message)
      // } else {
      //   throw new APIError(0, error)
      // }
    })
    
    // Reset requests
    this.requests.length = 0
  }
  
  start(request, response) {
    this.activeRequests++

    // Daemon
    if (!this.started) {
      setInterval(() => {
        this._dispatch()
      }, this.dispatchInterval * 1000);
      this.started = true
    }

    const req = {} 
    req.id = this._requestID(request, response)
    req.time = Date.now()
    req.host = request.headers.host
    req.path = request.url
    req.method = request.method
    req.bytes_in = parseInt(request.headers['content-length'])
    if (!req.bytes_in) {
      req.bytes_in = 0
    } 
    req.remote_ip = this._realIP(request)
    req.client_id = req.remote_ip
    req.user_agent = request.headers['user-agent']
    this.requests.push(req)
    return req
  }
  
  stop(request, response) {
    this.activeRequests--
    
    request.status = response.statusCode
    request.bytes_out = response._headers['content-length']
    request.latency = Date.now() - request.time

    // Dispatch batch
	  if (this.requests.length >= this.batchSize) {
      this._dispatch()
    }
  }
}

// class CubeError extends Error {
//   constructor(code, message) {
//     super(message)
//     this.code = code
//     Error.captureStackTrace(this, APIError)
//     this.name = this.constructor.name
//   }
// }

module.exports = {
  Cube
}

