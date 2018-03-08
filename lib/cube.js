const os = require('os')
const pusage = require('pidusage')
const got = require('got')

class Cube {
  constructor(key, options) {
    this.url = 'https://api.labstack.com/cube'
    this.key = key
    options = options || {}
    this.node = options.node || os.hostname()
    this.batchSize = options.batchSize || 60
    this.dispatchInterval = options.dispatchInterval || 60
    this.tags = options.tags
    this.activeRequests = 0
    this.requests = []

    // Dispatch daemon
    setInterval(() => {
      this._dispatch()
    }, this.dispatchInterval * 1000)

    // System daemon
    setInterval(() => {
      pusage.stat(process.pid, (err, stat) => {
        this.uptime = Math.floor(process.uptime())
        this.cpu = stat.cpu
        this.memory = stat.memory
      })
    }, 1000)
  }

  _requestID(request, response) {
    console.log(request.headers,  response)
    return request.headers['x-request-id'] ||
      response.headers['x-request-id']
  }
  
  _realIP(request) {
    // let ip = request.headers['x-forwarded-for'] ||
    // request.headers['x-real-ip'] ||
    // request.connection.remoteAddress
    // if (Array.isArray(ip)) {
    //   return ip.split(', ')[0]
    // } else {
    //   return ip
    // }
  }
  
  _resetRequests() {
    this.requests.length = 0
  }
  
  _dispatch() {
    if (!this.requests.length) {
      return
    }

    console.log(this.requests)

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

  start(request) {
    this.activeRequests++

    request.time = Date.now()
    request.active = this.activeRequests
    request.node = this.node
    request.uptime = this.uptime
    request.cpu = this.cpu
    request.memory = this.memory
    this.requests.push(request)

    return request
  }
  
  stop(request) {
    this.activeRequests--
   
    // r.id = this._realIP(response)
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
