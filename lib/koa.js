const {Cube} = require('./cube')

function cube(key, options) {
    const c = new Cube(key, options)

    return (ctx, next) => {
        const req = c.start({
            id: ctx.request.get('x-request-id'),
            host: ctx.hostname,
            path: ctx.path,
            method: ctx.method,
            bytes_in: parseInt(ctx.request.get('content-length')) || 0,
            remote_ip: ctx.ip,
            client_id: ctx.ip,
            user_agent: ctx.request.get('user-agent')
        })

        next()

        req.id = req.id || ctx.response.get('x-request-id')
        req.status = ctx.status
        req.bytes_out = ctx.length
        c.stop(req)
    }
}

module.exports = {
    cube
}