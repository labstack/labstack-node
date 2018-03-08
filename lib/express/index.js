const {Cube} = require('../cube')

function cube(key, options) {
    return (request, response, next) => {
        const cube = new Cube(key, options)
        const req = cube.start(request, response)
        next()
        cube.stop(req, response)
    }
}

module.exports = {
    cube
}