const {Cube} = require('./cube')

function cube(key, options) {
    return (context, next) => {
        const cube = new Cube(key, options)
        const {request, response} = context
        const req = cube.start(request, response)
        next()
        response.statusCode = response.status
        cube.stop(req, response)
    }
}

module.exports = {
    cube
}