const {Cube} = require('./cube')

function cube(key, options) {
    const c = new Cube(key, options)

    return (request, response, next) => {
        const req = c.start({
            id: request.get('x-request-id'),
            host: request.hostname,
            path: request.path,
            method: request.method,
            bytes_in: parseInt(request.get('content-length')) || 0,
            remote_ip: request.ip,
            client_id: request.ip,
            user_agent: request.get('user-agent')
        })

        next()
        const err = response.locals.error
        if (err) {
            req.error = err.message 
            req.stack_trace = err.stack
        }

        req.id = req.id || response.get('x-request-id')
        req.status = response.statusCode
        req.bytes_out = parseInt(response.get('content-length')) || 0
        c.stop(req)
    }
}

module.exports = {
    cube
}