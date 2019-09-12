const errors = require('restify-errors')

const nano = require('nano')('http://localhost:5984')
const db = nano.db.use('todo')

const async = require('async')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')

const config = require('../config')

module.exports = (req, res, next) => {
 const {username, password} = req.params

 if (!username || !password) return next(new errors.MissingParameterError('missing login credentials'))
 if (!config || !config.privateKey || !config.expiryTime) return next(new errors.InternalServerError('internal config error'))

 const expiryTime = config.expiryTime
 const privateKey = config.privateKey

 async.auto({
  getProfileDoc: (cb) => {
   db.view('profile', 'by_username', {
    key: username,
    include_docs: true
   }, (err, result) => {
    if (err || !result || !result.rows) return cb(new errors.InternalServerError('internal error'))

    if (result.rows.length === 1) {
     cb(null, result.rows[0].doc)

    } else if (result.rows.length > 1) {
     cb(new errors.InternalServerError('internal error'))

    } else {
     cb(new errors.InvalidCredentialsError('invalid username'))
    }
   })
  },
  verifyPassword: ['getProfileDoc', (result, cb) => {
   if (!result || !result.getProfileDoc) {
    return cb(new errors.InternalServerError('internal error'))
   }

   const doc = result.getProfileDoc
   if (!doc.login ||!doc.login.salt || !doc.login.key) return cb(new errors.GoneError('profile error'))

   const salt = doc.login.salt
   const iterations = 10
   const keylen = 12
   const digest = 'sha512'

   crypto.pbkdf2(password, salt, iterations, keylen, digest, (err, derivedKey) => {
    if (err) return next(new errors.InvalidCredentialsError('invalid password'))

    const inputPassword = derivedKey.toString('hex')
    const savedPassword = doc.login.key
    const payload = { id: doc._id }

    if (savedPassword !== inputPassword) return cb(new errors.InvalidCredentialsError('invalid password'))

    res.send({
     success: true,
     token: jwt.sign(payload, privateKey, { expiresIn: expiryTime })
    })
   })
  }]
 }, (err, result) => {
  if (err) return next(err)

  if (!result || !result.verifyPassword) return next(new errors.InternalServerError('internal error'))

  res.send(result.verifyPassword)
  next()
 })
}
