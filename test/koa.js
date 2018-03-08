const Koa = require('koa')
const Router = require('koa-router')
const labstack = require('..')

const koa = new Koa()
const app = new Router()
const {cube} = labstack.koa

app.get('/', ctx => {
  ctx.body = 'Hello, World!'
})

koa.use(cube(process.env.LABSTACK_KEY, {
    batchSize: 1
}))
koa.use(app.routes())
koa.listen(3002)