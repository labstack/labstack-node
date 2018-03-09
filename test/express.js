const express = require('express')
const labstack = require('..')

const app = express()
const {cube} = labstack.express

app.use(cube(process.env.LABSTACK_KEY, {
    batchSize: 1
}))
app.get('/', (req, res, next) => {
    res.send('Hello, World!')
})
app.get('/error', (req, res, next) => {
    throw new Error('Error!')
})
app.use((err, req, res, next) => {
    next(err)
})

app.listen(3001, () => console.log('Example app listening on port 3001!'))