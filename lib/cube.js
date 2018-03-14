const os = require('os')
const pusage = require('pidusage')
const got = require('got')

class Cube {
  constructor(apiKey, options) {
    this.url = 'https://api.labstack.com/cube'
    this.apiKey = apiKey 
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

  _dispatch() {
    if (!this.requests.length) {
      return
    }

    // TODO: handler error
    got.post(this.url, {
      headers: {
        'User-Agent': 'labstack/cube',
        'Authorization': `Bearer ${this.apiKey}`
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
    request.tags = this.tags
    this.requests.push(request)

    return request
  }
  
  stop(request) {
    this.activeRequests--
   
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
