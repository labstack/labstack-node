const {Cube} = require('./cube')

function cube(key, options) {
    const c = new Cube(key, options)

    return async (ctx, next) => {
        const r = c.start({
            id: ctx.request.get('x-request-id'),
            host: ctx.hostname,
            path: ctx.path,
            method: ctx.method,
            bytes_in: parseInt(ctx.request.get('content-length')) || 0,
            remote_ip: ctx.ip,
            client_id: ctx.request.get('x-client-id'),
            user_agent: ctx.request.get('user-agent')
        })

        try {
            await next()
        } catch (err) {
            r.error = err.message 
            r.stack_trace = err.stack
            ctx.status = err.status || 500
            ctx.body = err.message
            ctx.app.emit('error', err, ctx)
        }

        r.id = r.id || ctx.response.get('x-request-id')
        r.status = ctx.status
        r.bytes_out = ctx.length
        c.stop(r)
    }
}

module.exports = {
    cube
}