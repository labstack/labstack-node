const {Cube} = require('./cube')

function cube(key, options) {
  const c = new Cube(key, options)
  
  return (request, response, next) => {
    const r = c.start({
      id: request.get('X-Request-ID'),
      host: request.hostname,
      path: request.path,
      method: request.method,
      bytes_in: parseInt(request.get('Content-Length') || 0),
      remote_ip: request.ip,
      client_id: request.get('X-Client-ID'),
      user_agent: request.get('User-Agent')
    })
    
    next()
    const err = response.locals.error
    if (err) {
      r.error = err.message 
      r.stack_trace = err.stack
    }
    
    r.id = r.id || response.get('x-request-id')
    r.status = response.statusCode
    r.bytes_out = parseInt(response.get('content-length')) || 0
    c.stop(r)
  }
}

module.exports = {
  cube
}