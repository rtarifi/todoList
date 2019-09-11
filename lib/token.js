const errors = require('restify-errors')

const jwt = require('jsonwebtoken')

const nano = require('nano')('http://localhost:5984')
const db = nano.db.use('todo')

const config = require('../config.json')

module.exports = (req, res, next) => {
 const token = req.headers['x-todo-token']

 if (!config || !config.privateKey) return next(new errors.InternalServerError("could not validate token"))

 if (token) {
  jwt.verify(token, config.privateKey, (err, decoded) => {
   if (err) {
    return next(new errors.InvalidCredentialsError("invalid token"))
   }
   req.auth = decoded
   next()
  })
 } else {
  next()
 }
}
