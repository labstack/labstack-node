const express = require('express')
const labstack = require('..')

const app = express()
const {cube} = labstack.express

app.use(cube(process.env.LABSTACK_KEY, {
    batchSize: 1
}))
app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(3001, () => console.log('Example app listening on port 3001!'))