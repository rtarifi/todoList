const restify = require('restify')
const corsMiddleware = require('restify-cors-middleware')

const server = restify.createServer()

const cors = corsMiddleware({
 preflightMaxAge: 300,
 origins: ['*'],
 allowHeaders: [
  'x-todo-token'
 ]
})

server.pre(cors.preflight)
server.use(cors.actual)

server.use(restify.plugins.bodyParser({ mapParams: true }))
server.use(restify.plugins.queryParser({ mapParams: true }))

const modules = {
 task: require('./lib/task.js'),
 login: require('./lib/login.js'),
 token: require('./lib/token.js')
}

server.use(modules.token)

server.post('/login', modules.login)

server.get('/list', modules.task.list)
server.post('/list', modules.task.create)
server.get('/list/:id', modules.task.get)
server.post('/list/:id', modules.task.update)
server.del('/list/:id', modules.task.delete)

server.listen(8080, () => {
 console.log('%s listening at %s', server.name, server.url)
})
